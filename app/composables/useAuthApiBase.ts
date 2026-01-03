export const useAuthApiBase = () => {
  const config = useRuntimeConfig()
  const fallback = 'http://localhost:8000/api'
  const configuredBase = config.public.externalApiUrl || fallback
  const baseUrl = process.dev ? '/api' : configuredBase

  return baseUrl.replace(/\/$/, '')
}
