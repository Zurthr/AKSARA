import { ref, readonly, onMounted } from 'vue'
import { useApi } from './useApi'
import { normalizePaginatedCollection, type PaginatedCollection } from '~/utils/pagination'
import mockCommunitiesData from 'mockData/communities.json'

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
  cover?: string
  memberCount?: number
  isJoined?: boolean
  source?: string
}

export type CommunitiesResponse = PaginatedCollection<Community>

// Normalize raw community data
const normalizeCommunity = (raw: Record<string, unknown>, source: string = 'unknown'): Community => {
  return {
    id: raw.id as string | number || 0,
    name: (raw.name as string) || '',
    icon: (raw.icon as string) || 'chat',
    accent: (raw.accent as string) || '#E6F2FF',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    description: (raw.description as string) || '',
    members: (raw.members as string) || (raw.memberCount ? `${raw.memberCount}` : '0'),
    postsToday: (raw.postsToday as number | string) ?? 0,
    cover: (raw.cover as string) || '',
    memberCount: (raw.memberCount as number) || 0,
    isJoined: (raw.isJoined as boolean) || false,
    source
  }
}

// Fallback data from mock JSON
const fallbackCommunities: Community[] = Array.isArray(mockCommunitiesData)
  ? mockCommunitiesData.map((c, i) => normalizeCommunity(c as Record<string, unknown>, 'json'))
  : []

// Communities API composable with lazy loading and dual-source fetching
export const useCommunities = (pageSize: number = 10) => {
  const api = useApi()
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
    page.value++

    let apiCommunities: Community[] = []
    let apiHasMore = false
    let mockCommunities: Community[] = []
    let mockHasMore = false

    // 1. Try Laravel API
    try {
      const params = new URLSearchParams({
        page: String(page.value),
        per_page: String(pageSize)
      })
      if (filterQuery) {
        params.append('search', filterQuery)
      }

      const response = await api.get<unknown>(`/communities?${params.toString()}`)
      const normalized = normalizePaginatedCollection<Community>(response)

      if (normalized && Array.isArray(normalized.data)) {
        apiCommunities = normalized.data.map((c, i) => ({
          ...normalizeCommunity(c as unknown as Record<string, unknown>, 'laravel'),
          id: c.id || `laravel-${i}`
        }))

        const resolvedPage = normalized.current_page || page.value
        const lastPage = normalized.last_page || resolvedPage
        apiHasMore = resolvedPage < lastPage || (apiCommunities.length === pageSize && !normalized.last_page)
      }
    } catch (err) {
      console.warn('Laravel API failed for communities, using fallback:', err)
    }

    // 2. Try Mock Backend
    try {
      const mockParams: Record<string, any> = {
        _page: page.value,
        _limit: pageSize
      }
      if (filterQuery) {
        mockParams.q = filterQuery
      }

      const response = await $fetch<Community[]>('http://localhost:3002/communities', {
        params: mockParams
      })

      if (response && Array.isArray(response)) {
        mockCommunities = response.map((c, i) => ({
          ...normalizeCommunity(c as unknown as Record<string, unknown>, 'mock'),
          id: c.id || `mock-${i}`
        }))
        mockHasMore = response.length === pageSize
      }
    } catch (err) {
      console.warn('Mock backend failed for communities:', err)
    }

    // 3. Fallback to static JSON if both fail on first page
    if (apiCommunities.length === 0 && mockCommunities.length === 0 && page.value === 1) {
      const start = 0
      const end = pageSize
      mockCommunities = fallbackCommunities.slice(start, end)
      mockHasMore = end < fallbackCommunities.length
    }

    // 4. Merge results (dedupe by id)
    const seenIds = new Set<string>()
    const merged: Community[] = []

    for (const c of [...apiCommunities, ...mockCommunities]) {
      const idKey = String(c.id)
      if (!seenIds.has(idKey)) {
        seenIds.add(idKey)
        merged.push(c)
      }
    }

    if (page.value === 1) {
      communities.value = merged
    } else {
      communities.value = [...communities.value, ...merged]
    }

    hasMore.value = apiHasMore || mockHasMore

    if (merged.length === 0) {
      hasMore.value = false
    }

    setLoading(false)
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

export const useCommunity = () => {
  const api = useApi()

  const getCommunity = async (id: string | number): Promise<Community | null> => {
    // Run fetches in parallel to avoid waiting for timeouts sequentially
    const fetchLaravel = api.get<any>(`/communities/${id}`)
      .then(res => ({ source: 'laravel' as const, data: res }))
      .catch(() => null);

    const fetchMock = $fetch<Record<string, unknown>>(`http://localhost:3002/communities/${id}`)
      .then(res => ({ source: 'mock' as const, data: res }))
      .catch(() => null);

    const [laravelRes, mockRes] = await Promise.all([fetchLaravel, fetchMock]);

    // Priority 1: Laravel API
    if (laravelRes && laravelRes.data) {
      const raw = laravelRes.data.data || laravelRes.data;
      return normalizeCommunity(raw as Record<string, unknown>, 'laravel');
    }

    // Priority 2: Mock Backend
    if (mockRes && mockRes.data) {
      return normalizeCommunity(mockRes.data, 'mock');
    }

    // Priority 3: Fallback JSON
    const found = fallbackCommunities.find(c => String(c.id) === String(id))
    if (found) return found

    return null
  }

  return {
    getCommunity
  }
}
