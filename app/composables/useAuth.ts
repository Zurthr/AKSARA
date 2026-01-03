import { computed } from 'vue'

// Types based on API response structur// Types
export interface User {
  id: string
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  // Profile is nested in API response
  profile?: {
    id: string
    userId: string
    displayName?: string
    bio?: string
    avatarUrl?: string | null
    interestScores?: Record<string, number>
  }
  // Legacy fields for backward compatibility
  firstName?: string
  lastName?: string
  displayName?: string
  bio?: string
  interestScores?: Record<string, number>
  updatedAt?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  email?: string
  displayName?: string
  bio?: string
  interestScores?: Record<string, number>
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    tokens: AuthTokens
  }
}

export interface RefreshResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
  }
}

export interface ProfileResponse {
  success: boolean
  message: string
  data: User
}

export interface ApiError {
  success: false
  message: string
  error?: string
  errors?: Record<string, string[]>
}

export const useAuth = () => {
  const router = useRouter()

  // Shared auth state across app instances
  const user = useState<User | null>('auth_user', () => null)
  const accessToken = useState<string | null>('auth_access_token', () => null)
  const refreshToken = useState<string | null>('auth_refresh_token', () => null)
  const isLoading = useState<boolean>('auth_is_loading', () => false)
  const error = useState<string | null>('auth_error', () => null)
  const isInitialized = useState<boolean>('auth_is_initialized', () => false)

  // Base API URL - Use proxy in development to avoid CORS
  const baseURL = useAuthApiBase()

  // Computed
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

  // Helper function for API calls
  const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${baseURL}${endpoint}`

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (accessToken.value) {
      defaultHeaders.Authorization = `Bearer ${accessToken.value}`
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    }

    const response = await fetch(url, config)
    let data: any = null

    try {
      data = await response.json()
    } catch (parseError) {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }
      return data as T
    }

    if (!response.ok) {
      const validationMessage = data?.errors
        ? Object.values<string[]>(data.errors)[0]?.[0]
        : null
      let errorMessage: string | null = null

      if (typeof data?.message === 'string') {
        errorMessage = data.message
      } else if (typeof data?.error === 'string') {
        errorMessage = data.error
      } else if (data?.error && typeof data.error === 'object') {
        errorMessage = typeof data.error.message === 'string'
          ? data.error.message
          : null
      }

      const message = errorMessage || validationMessage || `Request failed with status ${response.status}`
      throw new Error(message)
    }

    return data
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  // Set tokens and user data
  const setAuthData = (authData: AuthResponse['data']) => {
    user.value = authData.user
    accessToken.value = authData.tokens.accessToken
    refreshToken.value = authData.tokens.refreshToken

    // Store in localStorage for persistence
    if (process.client) {
      localStorage.setItem('accessToken', authData.tokens.accessToken)
      localStorage.setItem('refreshToken', authData.tokens.refreshToken)
      localStorage.setItem('user', JSON.stringify(authData.user))
    }
  }

  // Clear auth data
  const clearAuthData = () => {
    user.value = null
    accessToken.value = null
    refreshToken.value = null

    if (process.client) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }

  // Restore session from localStorage
  const restoreSession = () => {
    if (process.client) {
      const storedToken = localStorage.getItem('accessToken')
      const storedRefreshToken = localStorage.getItem('refreshToken')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedRefreshToken && storedUser) {
        try {
          accessToken.value = storedToken
          refreshToken.value = storedRefreshToken
          user.value = JSON.parse(storedUser)
        } catch (err) {
          console.error('Failed to restore session:', err)
          clearAuthData()
        }
      }
    }
  }

  if (process.client && !isInitialized.value) {
    restoreSession()
    isInitialized.value = true
  }

  // Register new user
  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      isLoading.value = true
      clearError()

      const response = await apiCall<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      })

      setAuthData(response.data)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Login user
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      isLoading.value = true
      clearError()

      const response = await apiCall<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      })

      setAuthData(response.data)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Get user profile
  const getProfile = async (): Promise<User | null> => {
    try {
      isLoading.value = true
      clearError()

      const response = await apiCall<ProfileResponse>('/auth/profile')
      user.value = response.data

      // Update stored user data
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(response.data))
      }

      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get profile'
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Update user profile
  const updateProfile = async (profileData: UpdateProfileData): Promise<boolean> => {
    try {
      isLoading.value = true
      clearError()

      const response = await apiCall<ProfileResponse>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      })

      user.value = response.data

      // Update stored user data
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(response.data))
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update profile'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Refresh access token
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      if (!refreshToken.value) return false

      const response = await apiCall<RefreshResponse>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: refreshToken.value })
      })

      accessToken.value = response.data.accessToken

      if (process.client) {
        localStorage.setItem('accessToken', response.data.accessToken)
      }

      return true
    } catch (err) {
      console.error('Token refresh failed:', err)
      // If refresh fails, logout user
      await logout()
      return false
    }
  }

  // Logout user
  const logout = async () => {
    try {
      isLoading.value = true

      // Call logout endpoint if refresh token exists
      if (refreshToken.value) {
        await apiCall('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: refreshToken.value })
        })
      }
    } catch (err) {
      console.error('Logout API call failed:', err)
    } finally {
      clearAuthData()
      isLoading.value = false

      // Redirect to login page
      await router.push('/auth/login')
    }
  }

  // Check if token needs refresh (optional enhancement)
  const checkTokenExpiry = () => {
    if (!accessToken.value) return

    try {
      // Decode JWT payload (basic check)
      const payload = JSON.parse(atob(accessToken.value.split('.')[1]))
      const expiry = payload.exp * 1000 // Convert to milliseconds
      const now = Date.now()

      // If token expires in less than 5 minutes, refresh it
      if (expiry - now < 5 * 60 * 1000) {
        refreshAccessToken()
      }
    } catch (err) {
      console.error('Token validation failed:', err)
    }
  }

  return {
    // State
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    refreshAccessToken,
    restoreSession,
    clearError,
    checkTokenExpiry
  }
}
