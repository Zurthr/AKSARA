import { ref, readonly } from 'vue'
import mockEventsData from 'mockData/events.json'
import { normalizeEventCollection } from '~/utils/events-normalizer'
import { normalizePaginatedCollection, type PaginatedCollection } from '~/utils/pagination'
import { useApi } from './useApi'

// TypeScript interfaces for Events API
export interface Event {
  id: number | string
  title: string
  description: string
  date: string
  time?: string
  location: string
  organizer: string
  capacity?: number
  registered_count?: number
  image_url?: string
  image?: string
  category?: string
  is_free: boolean
  price?: number
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  tags?: string[]
  attendees?: Array<{ id?: number | string; name?: string; avatar?: string }>
  attendeeCount?: number
  maxAttendees?: number
  community_id?: string
  community_name?: string
  subtitle?: string
  registration_url?: string
  [key: string]: unknown
}

export interface EventCreateData {
  title: string
  description: string
  date: string
  time?: string
  location: string
  organizer: string
  capacity?: number
  image_url?: string
  category?: string
  is_free: boolean
  price?: number
}

export interface EventUpdateData extends Partial<EventCreateData> { }

export type EventsResponse = PaginatedCollection<Event>

const fallbackEvents = normalizeEventCollection(
  Array.isArray(mockEventsData) ? (mockEventsData as Array<Record<string, unknown>>) : []
)

// Events API composable
export const useEvents = () => {
  const api = useApi()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (err: string | null) => {
    error.value = err
  }

  const buildEventsQuery = (page: number, perPage: number, searchQuery?: string) => {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage)
    })

    const normalizedQuery = searchQuery?.trim()
    if (normalizedQuery) {
      params.append('search', normalizedQuery)
      params.append('q', normalizedQuery)
    }

    return params.toString()
  }

  const getAllEvents = async (
    page: number = 1,
    perPage: number = 10,
    searchQuery?: string
  ): Promise<EventsResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const queryString = buildEventsQuery(page, perPage, searchQuery)
      const response = await api.get<unknown>(`/events?${queryString}`)
      return normalizePaginatedCollection<Event>(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events')
      return null
    } finally {
      setLoading(false)
    }
  }

  const getEventById = async (id: number | string): Promise<Event | null> => {
    setLoading(true)
    setError(null)

    try {
      const encodedId = encodeURIComponent(String(id))
      const response = await api.get<{ data: Event }>(`/events/${encodedId}`)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch event')
      return null
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async (eventData: EventCreateData): Promise<Event | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.post<{ data: Event }>('/events', eventData)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateEvent = async (id: number | string, eventData: EventUpdateData): Promise<Event | null> => {
    setLoading(true)
    setError(null)

    try {
      const encodedId = encodeURIComponent(String(id))
      const response = await api.post<{ data: Event }>(`/events/${encodedId}`, eventData)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event')
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = async (id: number | string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const encodedId = encodeURIComponent(String(id))
      await api.delete(`/events/${encodedId}`)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event')
      return false
    } finally {
      setLoading(false)
    }
  }

  const getEventsByCommunityId = async (
    communityId: number | string,
    page: number = 1,
    perPage: number = 10
  ): Promise<EventsResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      // 1. Try fetching from API
      // Assuming GET /events supports ?community_id=...
      const queryString = new URLSearchParams({
        community_id: String(communityId),
        page: String(page),
        per_page: String(perPage)
      }).toString()

      const response = await api.get<unknown>(`/events?${queryString}`)
      return normalizePaginatedCollection<Event>(response)
    } catch (err) {
      console.warn('API failed for community events, using fallback:', err)

      // 2. Fallback to mock data
      // Filter fallbackEvents by community_id
      const filtered = fallbackEvents.filter(e =>
        String(e.community_id) === String(communityId)
      )

      const start = (page - 1) * perPage
      const end = start + perPage
      const paginatedData = filtered.slice(start, end)

      return {
        data: paginatedData,
        current_page: page,
        last_page: Math.ceil(filtered.length / perPage) || 1,
        per_page: perPage,
        total: filtered.length
      }
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    clearError,
    getEventsByCommunityId
  }
}



import { useLocalEvents } from './useLocalEvents'

/**
 * Composable for lazy loading events with pagination against the primary API
 * AND composes data from Mock JSON and Local Storage
 */
export function useLazyEvents(pageSize: number = 6) {
  const { getAllEvents } = useEvents()
  const events = ref<Event[]>([])
  const isLoading = ref(false)
  const hasMore = ref(true)
  const currentPage = ref(0)
  const error = ref<Error | null>(null)
  const currentSearchQuery = ref('')

  // Access local events manager
  const { readLocalEvents } = useLocalEvents()

  const loadMore = async () => {
    if (isLoading.value || !hasMore.value) {
      return
    }

    isLoading.value = true
    error.value = null

    const nextPage = currentPage.value + 1

    // ---------------------------------------------------------
    // 1. Prepare Static Data (Mock + Local)
    // ---------------------------------------------------------
    let staticEventsSlice: Event[] = []
    let staticHasMore = false

    try {
      const localItems = (typeof window !== 'undefined') ? readLocalEvents() : []
      // Combine Mock + Local
      const allStaticEvents = [...localItems, ...fallbackEvents] as Event[]

      // Filter by Search Query if present
      let filteredStatic = allStaticEvents
      const query = currentSearchQuery.value.trim().toLowerCase()
      if (query) {
        filteredStatic = allStaticEvents.filter((item) => {
          const title = typeof item.title === 'string' ? item.title.toLowerCase() : ''
          const description = typeof item.description === 'string' ? item.description.toLowerCase() : ''
          return title.includes(query) || description.includes(query)
        })
      }

      const start = (nextPage - 1) * pageSize
      const end = start + pageSize
      const rawSlice = filteredStatic.slice(start, end)

      // Map IDs to be unique (prefixed) to avoid collision with Backend IDs
      staticEventsSlice = rawSlice.map(ev => {
        // Determine source to apply correct prefix if not already present
        // fallbackEvents come from events.json
        // localItems come from localStorage

        // We can check if it exists in localItems to know it's local
        const isLocal = localItems.some((i: any) => i.id === ev.id)
        const prefix = isLocal ? 'local-' : 'mock-'

        // If ID is already string and has prefix, leave it. Otherwise prefix it.
        const idStr = String(ev.id)
        const newId = (idStr.startsWith('mock-') || idStr.startsWith('local-'))
          ? idStr
          : `${prefix}${idStr}`

        return {
          ...ev,
          id: newId
        }
      })

      staticHasMore = end < filteredStatic.length
    } catch (e) {
      console.warn("Failed to process static events:", e)
    }

    // ---------------------------------------------------------
    // 2. Fetch API Data
    // ---------------------------------------------------------
    let apiEventsSlice: Event[] = []
    let apiHasMore = false

    try {
      const response = await getAllEvents(nextPage, pageSize, currentSearchQuery.value || undefined)

      if (response && Array.isArray(response.data)) {
        apiEventsSlice = response.data

        const resolvedPage = response.current_page || nextPage
        const resolvedLast = response.last_page || resolvedPage

        const explicitMore = resolvedPage < resolvedLast
        const assumeMore = !response.last_page && apiEventsSlice.length === pageSize

        apiHasMore = (apiEventsSlice.length > 0) && (explicitMore || assumeMore)
      }
    } catch (e) {
      console.error("Backend API load failed for events (using fallback logic):", e)
      if (staticEventsSlice.length === 0 && nextPage === 1) {
        error.value = e instanceof Error ? e : new Error("Failed to load events")
      }
    }

    // ---------------------------------------------------------
    // 3. Merge & Update
    // ---------------------------------------------------------
    const newItems = [...apiEventsSlice, ...staticEventsSlice]

    if (nextPage === 1) {
      events.value = newItems
    } else {
      events.value = [...events.value, ...newItems]
    }

    currentPage.value = nextPage
    hasMore.value = apiHasMore || staticHasMore

    if (newItems.length === 0 && !apiHasMore && !staticHasMore) {
      hasMore.value = false
    }

    isLoading.value = false
  }

  const reset = () => {
    events.value = []
    currentPage.value = 0
    hasMore.value = true
    error.value = null
  }

  const search = (query: string) => {
    currentSearchQuery.value = query.trim()
    reset()
    void loadMore()
  }

  return {
    events,
    isLoading,
    hasMore,
    error,
    loadMore,
    reset,
    search
  }
}
