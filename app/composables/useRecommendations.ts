import { getRecentRecommendationEvents } from '~/composables/useClickTracking'

export type RecommendationType = 'post' | 'book' | 'event' | 'community'

export interface RecommendationItem {
  id: string
  title: string
  type: RecommendationType
  score: number
}

type RecommendationOptions = {
  tag?: string
  tags?: string[]
}

export const useRecommendations = () => {
  const config = useRuntimeConfig()
  const auth = useAuth()
  const accessToken = useState<string | null>('auth_access_token')

  const buildRecommendationsUrl = (type: RecommendationType, limit: number, options?: RecommendationOptions) => {
    const url = new URL(`${config.public.apiBaseUrl}/recommendations`)
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('type', type)
    if (options?.tag) {
      url.searchParams.set('tag', options.tag)
    }
    if (options?.tags?.length) {
      url.searchParams.set('tags', options.tags.join(','))
    }
    return url.toString()
  }

  const fetchRecommendations = async (type: RecommendationType, limit: number, options?: RecommendationOptions) => {
    const url = buildRecommendationsUrl(type, limit, options)
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    let body: Record<string, unknown> | undefined

    const sessionOk = await auth.ensureValidSession()
    if (sessionOk && accessToken.value) {
      headers.Authorization = `Bearer ${accessToken.value}`
    } else {
      const events = getRecentRecommendationEvents()
      if (!events.length) {
        return []
      }
      body = { events }
    }

    try {
      const response = await $fetch<{ success: boolean; data: RecommendationItem[] }>(url, {
        method: 'POST',
        headers,
        body
      })

      if (!response.success || !Array.isArray(response.data)) {
        return []
      }

      return response.data
    } catch (err) {
      console.error(`Failed to load ${type} recommendations:`, err)
      return []
    }
  }

  return {
    fetchRecommendations,
    fetchTagSuggestions: async (limit: number = 6) => {
      const url = `${config.public.apiBaseUrl}/recommendations/tags?limit=${limit}`
      const headers: Record<string, string> = {}
      const sessionOk = await auth.ensureValidSession()
      if (sessionOk && accessToken.value) {
        headers.Authorization = `Bearer ${accessToken.value}`
      }

      try {
        const response = await $fetch<{ success?: boolean; data?: string[] }>(url, {
          method: 'GET',
          headers
        })
        const tags = Array.isArray(response?.data) ? response.data : []
        return tags.filter((tag) => typeof tag === 'string')
      } catch (err) {
        console.error('Failed to load tag suggestions:', err)
        return []
      }
    }
  }
}
