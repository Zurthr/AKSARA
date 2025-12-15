import { ref, readonly, onMounted } from 'vue'


// Interface matching Community/index.vue expectation
export interface Community {
  id: string | number
  name: string
  icon: string
  accent: string
  tags: string[]
  description: string
  members: string
  postsToday: number | string
  memberCount?: number
  isJoined?: boolean
}

// Communities API composable with lazy loading
export const useCommunities = (pageSize: number = 10) => {
  const communities = ref<Community[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasMore = ref(true)
  const page = ref(0)

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (err: string | null) => {
    error.value = err
  }

  const loadMoreCommunities = async (filterQuery: string = '') => {
    if (loading.value || !hasMore.value) return

    setLoading(true)
    setError(null)
    page.value++ // Increment page before fetch

    try {
      // Build query parameters
      const params: Record<string, any> = {
        _page: page.value,
        _limit: pageSize
      }

      // Add text search if provided (mock backend uses 'q' for full text search)
      if (filterQuery) {
        params.q = filterQuery
      }

      const response = await $fetch<Community[]>('http://localhost:3002/communities', {
        params
      })

      if (response && Array.isArray(response)) {
        if (response.length < pageSize) {
          hasMore.value = false
        }

        if (response.length > 0) {
          communities.value = [...communities.value, ...response]
        } else {
          // If we get 0 results on a page > 1, it means we reached the end
          hasMore.value = false
        }
      } else {
        // Unexpected response format
        hasMore.value = false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch communities')
      page.value-- // Revert page increment on error
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    communities.value = []
    page.value = 0
    hasMore.value = true
    error.value = null
  }

  const refetchCommunities = async (filterQuery: string = '') => {
    reset()
    await loadMoreCommunities(filterQuery)
  }

  return {
    communities,
    loading: readonly(loading),
    error: readonly(error),
    hasMore: readonly(hasMore),
    loadMoreCommunities,
    refetchCommunities
  }
}
