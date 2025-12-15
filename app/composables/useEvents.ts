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

export interface EventUpdateData extends Partial<EventCreateData> {}

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
    clearError
  }
}

/**
 * Composable for lazy loading events with pagination against the primary API
 */
export function useLazyEvents(pageSize: number = 6) {
  const { getAllEvents } = useEvents()
  const events = ref<Event[]>([])
  const isLoading = ref(false)
  const hasMore = ref(true)
  const currentPage = ref(0)
  const error = ref<Error | null>(null)
  const currentSearchQuery = ref('')

  const applyFallback = (page: number) => {
    const normalizedQuery = currentSearchQuery.value.trim().toLowerCase()
    const filteredFallback = normalizedQuery
      ? fallbackEvents.filter((item) => {
          const title = typeof item.title === 'string' ? item.title.toLowerCase() : ''
          const description = typeof item.description === 'string' ? item.description.toLowerCase() : ''
          return title.includes(normalizedQuery) || description.includes(normalizedQuery)
        })
      : fallbackEvents

    const fallbackStartIndex = (page - 1) * pageSize
    const fallbackSlice = filteredFallback.slice(fallbackStartIndex, fallbackStartIndex + pageSize)

    if (fallbackSlice.length === 0) {
      return false
    }

    if (page === 1) {
      events.value = fallbackSlice
    } else {
      events.value = [...events.value, ...fallbackSlice]
    }

    currentPage.value = page
    const consumed = fallbackStartIndex + fallbackSlice.length
    hasMore.value = consumed < filteredFallback.length
    error.value = null
    return true
  }

  const loadMore = async () => {
    if (isLoading.value || !hasMore.value) {
      return
    }

    isLoading.value = true
    error.value = null

    const nextPage = currentPage.value + 1

    try {
      const response = await getAllEvents(nextPage, pageSize, currentSearchQuery.value || undefined)

      if (!response) {
        if (!applyFallback(nextPage)) {
          error.value = new Error('Failed to fetch events')
          hasMore.value = false
        }
        return
      }

      const pageItems = Array.isArray(response.data) ? response.data : []
      const resolvedPage = response.current_page || nextPage
      const resolvedLastPage = response.last_page || resolvedPage

      if (nextPage === 1) {
        events.value = pageItems
      } else {
        events.value = [...events.value, ...pageItems]
      }

      currentPage.value = resolvedPage

      const explicitMore = resolvedPage < resolvedLastPage
      const assumeMore = !response.last_page && pageItems.length === pageSize
      const reachedEnd = pageItems.length === 0

      hasMore.value = !reachedEnd && (explicitMore || assumeMore)

      if (reachedEnd) {
        hasMore.value = false
      }
    } catch (err) {
      console.error('Failed to load events:', err)

      if (!applyFallback(nextPage)) {
        error.value = err instanceof Error ? err : new Error('Failed to load events')
        hasMore.value = false
      }
    } finally {
      isLoading.value = false
    }
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
