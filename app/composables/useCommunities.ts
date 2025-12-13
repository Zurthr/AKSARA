import { ref, readonly } from 'vue'
import { useApi } from './useApi'

// TypeScript interfaces for Communities API
export interface Community {
  id: number
  name: string
  description: string
  image_url?: string
  cover_image_url?: string
  member_count: number
  post_count: number
  category: string
  is_private: boolean
  created_by: number
  created_at: string
  updated_at: string
  latest_posts?: CommunityPost[]
}

export interface CommunityPost {
  id: number
  title: string
  content: string
  author: {
    id: number
    name: string
    avatar_url?: string
  }
  community_id: number
  replies_count: number
  likes_count: number
  created_at: string
  updated_at: string
}

export interface CommunityCreateData {
  name: string
  description: string
  image_url?: string
  cover_image_url?: string
  category: string
  is_private: boolean
}

export interface CommunityUpdateData extends Partial<CommunityCreateData> {}

export interface CommunitiesResponse {
  data: Community[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// Communities API composable
export const useCommunities = () => {
  const api = useApi()
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const setLoading = (value: boolean) => {
    loading.value = value
  }
  
  const setError = (err: string | null) => {
    error.value = err
  }
  
  const getAllCommunities = async (page: number = 1, perPage: number = 10): Promise<CommunitiesResponse | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.get<CommunitiesResponse>(`/communities?page=${page}&per_page=${perPage}`)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch communities')
      return null
    } finally {
      setLoading(false)
    }
  }
  
  const getCommunityById = async (id: number): Promise<Community | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.get<{ data: Community }>(`/communities/${id}`)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch community')
      return null
    } finally {
      setLoading(false)
    }
  }
  
  const createCommunity = async (communityData: CommunityCreateData): Promise<Community | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.post<{ data: Community }>('/communities', communityData)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create community')
      return null
    } finally {
      setLoading(false)
    }
  }
  
  const updateCommunity = async (id: number, communityData: CommunityUpdateData): Promise<Community | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.post<{ data: Community }>(`/communities/${id}`, communityData)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update community')
      return null
    } finally {
      setLoading(false)
    }
  }
  
  const deleteCommunity = async (id: number): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    try {
      await api.delete(`/communities/${id}`)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete community')
      return false
    } finally {
      setLoading(false)
    }
  }
  
  return {
    loading: readonly(loading),
    error: readonly(error),
    getAllCommunities,
    getCommunityById,
    createCommunity,
    updateCommunity,
    deleteCommunity
  }
}
