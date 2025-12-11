import { defineEventHandler, getRequestURL, proxyRequest } from 'h3'

const API_BASE = 'https://aksara-api.fruz.xyz/api'

export default defineEventHandler(async (event) => {
  const requestUrl = getRequestURL(event)
  const upstreamPath = requestUrl.pathname.replace(/^\/api/, '')
  const targetUrl = `${API_BASE}${upstreamPath}${requestUrl.search}`

  return proxyRequest(event, targetUrl, {
    fetch,
    headers: {
      host: 'aksara-api.fruz.xyz'
    }
  })
})
