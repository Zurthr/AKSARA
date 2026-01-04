export default defineNuxtRouteMiddleware(async (to) => {
  const { ensureValidSession } = useAuth()

  const hasSession = await ensureValidSession()

  // If user is not authenticated, redirect to login
  if (!hasSession) {
    return navigateTo('/auth/login')
  }
})
