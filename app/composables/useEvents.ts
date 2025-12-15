import { ref, readonly } from 'vue'
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

export interface EventUpdateData extends Partial<EventCreateData> { }

export interface EventsResponse {
  data: Event[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

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

  const getAllEvents = async (page: number = 1, perPage: number = 10): Promise<EventsResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.get<EventsResponse>(`/events?page=${page}&per_page=${perPage}`)
      return response
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
 * Composable for lazy loading events with pagination
 * Uses json-server pagination with _page and _limit params
 */
export function useLazyEvents(pageSize: number = 6) {
  const events = ref<Event[]>([])
  const isLoading = ref(false)
  const hasMore = ref(true)
  const currentPage = ref(0)
  const error = ref<Error | null>(null)
  const currentSearchQuery = ref('')

  const loadMore = async () => {
    if (isLoading.value || !hasMore.value) return

    isLoading.value = true
    error.value = null
    currentPage.value++

    try {
      const params: any = {
        _page: currentPage.value,
        _limit: pageSize
      }

      if (currentSearchQuery.value) {
        params.q = currentSearchQuery.value
      }

      const response = await $fetch<Event[]>(`http://localhost:3002/events`, {
        params
      })

      if (response.length < pageSize) {
        hasMore.value = false
      }

      if (response.length === 0) {
        if (currentPage.value === 1) {
          events.value = []
        }
        hasMore.value = false
      } else {
        if (currentPage.value === 1) {
          events.value = response
        } else {
          events.value = [...events.value, ...response]
        }
      }
    } catch (e) {
      error.value = e as Error
      console.error('Error loading events:', e)
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
    currentSearchQuery.value = query
    reset()
    loadMore()
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
