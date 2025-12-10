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
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const init: RequestInit = {
    method,
    headers,
    ...options,
  }

  if (data !== undefined) {
    init.body = JSON.stringify(data)
  }

  const response = await fetch(url, init)

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl

  const request = async <T>(method: HttpMethod, path: string, data?: unknown, options?: FetchOptions) => {
    const url = buildUrl(baseUrl, path)
    return performRequest<T>(method, url, data, options)
  }

  return {
    get: <T>(path: string, options?: FetchOptions) => request<T>('GET', path, undefined, options),
    post: <T>(path: string, data?: unknown, options?: FetchOptions) => request<T>('POST', path, data, options),
    put: <T>(path: string, data?: unknown, options?: FetchOptions) => request<T>('PUT', path, data, options),
    patch: <T>(path: string, data?: unknown, options?: FetchOptions) => request<T>('PATCH', path, data, options),
    delete: <T>(path: string, options?: FetchOptions) => request<T>('DELETE', path, undefined, options),
  }
}
