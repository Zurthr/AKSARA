import { getRecentRecommendationEvents } from '~/composables/useClickTracking'

export type RecommendationType = 'post' | 'book' | 'event' | 'community'

export interface RecommendationItem {
  id: string
  title: string
  type: RecommendationType
  score: number
}

export const useRecommendations = () => {
  const config = useRuntimeConfig()
  const auth = useAuth()
  const accessToken = useState<string | null>('auth_access_token')

  const fetchRecommendations = async (type: RecommendationType, limit: number) => {
    const url = `${config.public.apiBaseUrl}/recommendations?limit=${limit}&type=${type}`
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
    fetchRecommendations
  }
}
