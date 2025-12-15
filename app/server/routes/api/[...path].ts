import { defineEventHandler, getRequestURL, proxyRequest } from 'h3'

const API_BASE = 'https://aksara-api.fruz.xyz'

export default defineEventHandler(async (event) => {
  const requestUrl = getRequestURL(event)

  // Extract the path after /api
  const upstreamPath = requestUrl.pathname.replace(/^\/api/, '/api')
  const targetUrl = `${API_BASE}${upstreamPath}${requestUrl.search}`

  console.log(`[API Proxy] ${event.method} ${requestUrl.pathname} → ${targetUrl}`)

  try {
    return await proxyRequest(event, targetUrl, {
      fetch,
      // Don't override host header - let it be aksara-api.fruz.xyz
      // This ensures proper routing on the backend
      sendStream: false,
      // Forward all headers except host
      headers: {
        'X-Forwarded-Host': requestUrl.host,
        'X-Forwarded-Proto': requestUrl.protocol.replace(':', '')
      }
    })
  } catch (error) {
    console.error('[API Proxy] Error:', error)
    throw error
  }
})
