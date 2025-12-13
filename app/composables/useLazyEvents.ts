
import { ref, onMounted } from 'vue'
import { useEvents } from './useEvents'
import type { Event as EventItem } from './useEvents'

export function useLazyEvents(pageSize: number = 6) {
    const events = ref<EventItem[]>([])
    const isLoading = ref(false)
    const hasMore = ref(true)
    const currentPage = ref(0)
    const error = ref<Error | null>(null)

    // Use the existing logic for fetching events (Laravel API)
    const { getAllEvents } = useEvents()

    const loadMore = async () => {
        if (isLoading.value || !hasMore.value) return

        isLoading.value = true
        error.value = null
        currentPage.value++

        try {
            console.log('[useLazyEvents] Fetching page:', currentPage.value)
            const response = await getAllEvents(currentPage.value, pageSize)

            if (!response || !response.data) {
                hasMore.value = false
                return
            }

            const newEvents = response.data
            // If we got fewer items than requested, we've reached the end
            if (newEvents.length < pageSize) {
                hasMore.value = false
            }

            if (newEvents.length === 0) {
                hasMore.value = false
            } else {
                // Determine if we should append or if it's new data. 
                // Since this is infinite scroll, we append.
                // We might want to deduplicate by ID if necessary, but API usually handles pagination correctly.

                // Simple append for now
                const existingIds = new Set(events.value.map(e => e.id))
                const uniqueNewEvents = newEvents.filter(e => !existingIds.has(e.id))

                events.value = [...events.value, ...uniqueNewEvents]
            }

            // Also check pagination metadata if available
            if (response.last_page && currentPage.value >= response.last_page) {
                hasMore.value = false
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

    onMounted(() => {
        loadMore()
    })

    return {
        events,
        isLoading,
        hasMore,
        error,
        loadMore,
        reset
    }
}
