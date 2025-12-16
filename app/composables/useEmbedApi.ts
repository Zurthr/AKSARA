import { useRuntimeConfig } from '#imports'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
type FetchOptions = Omit<RequestInit, 'method' | 'body'> & {
  headers?: Record<string, string>
}

const buildUrl = (baseUrl: string, path: string) => {
  const normalizedBase = baseUrl.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}

const performRequest = async <T>(method: HttpMethod, url: string, data?: unknown, options: FetchOptions = {}) => {
  // Separate headers from other options to avoid overwriting computed headers
  const { headers: optionHeaders, ...restOptions } = options

  const headers = {
    'Content-Type': 'application/json',
    ...optionHeaders,
  }

  const init: RequestInit = {
    method,
    headers,
    ...restOptions,
  }

  if (data !== undefined) {
    const jsonBody = JSON.stringify(data)
    console.log('Request body:', jsonBody) // Debug log
    init.body = jsonBody
  }

  console.log('Request URL:', url)
  console.log('Request method:', method)
  console.log('Request headers:', headers)

  const response = await fetch(url, init)

  if (!response.ok) {
    let errorData: unknown = null
    let rawError = ''

    try {
      rawError = await response.text()
      errorData = rawError ? JSON.parse(rawError) : null
    } catch (e) {
      // If JSON parsing fails, keep the raw text for debugging
      errorData = rawError || null
      console.error('Failed to parse error response:', e)
    }

    console.error('API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      errorData
    })

    // Build a readable message even when the backend sends an object for "message"
    const message =
      typeof errorData === 'string'
        ? errorData
        : typeof (errorData as any)?.message === 'string'
          ? (errorData as any).message
          : typeof (errorData as any)?.error === 'string'
            ? (errorData as any).error
            : typeof (errorData as any)?.message === 'object'
              ? JSON.stringify((errorData as any).message)
              : errorData
                ? JSON.stringify(errorData)
                : `API request failed with status ${response.status}`

    throw new Error(message)
  }

  return (await response.json()) as T
}

export const useEmbedApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.embedApiUrl || '/proxy-embed'

  const request = async <T>(method: HttpMethod, path: string, data?: unknown, options?: FetchOptions) => {
    const url = buildUrl(baseUrl, path)

    // Always make direct requests to avoid proxy body forwarding issues
    return performRequest<T>(method, url, data, {
      ...options,
      mode: 'cors',
      credentials: 'include'
    })
  }

  // Add authentication if token is available
  const getAuthHeaders = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      return token ? { Authorization: `Bearer ${token}` } : {}
    }
    return {}
  }

  return {
    // Public endpoint (no auth required)
    getEmbedData: <T>(id: string, options?: FetchOptions) =>
      request<T>('GET', `/embeds/${id}`, undefined, options),

    // Authenticated endpoints
    getEmbeds: <T>(options?: FetchOptions) =>
      request<T>('GET', '/embeds', undefined, {
        headers: { ...getAuthHeaders(), ...options?.headers },
        ...options
      }),

    createEmbed: <T>(data: unknown, options?: FetchOptions) =>
      request<T>('POST', '/embeds', data, {
        headers: { ...getAuthHeaders(), ...options?.headers },
        ...options
      }),

    updateEmbed: <T>(id: string, data: unknown, options?: FetchOptions) =>
      request<T>('PUT', `/embeds/${id}`, data, {
        headers: { ...getAuthHeaders(), ...options?.headers },
        ...options
      }),

    deleteEmbed: <T>(id: string, options?: FetchOptions) =>
      request<T>('DELETE', `/embeds/${id}`, undefined, {
        headers: { ...getAuthHeaders(), ...options?.headers },
        ...options
      }),
  }
}
