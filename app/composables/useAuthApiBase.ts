export const useAuthApiBase = () => {
  const config = useRuntimeConfig()
  const fallback = 'http://localhost:3001/api'
  const baseUrl = config.public.apiBaseUrl || fallback

  return baseUrl.replace(/\/$/, '')
}
