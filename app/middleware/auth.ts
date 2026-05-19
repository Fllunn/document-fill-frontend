export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const auth = useAuth()

  if (auth.user?._id) {
    return
  }

  const isAuth = await auth.checkAuth()

  if (!isAuth) {
    return navigateTo('/login')
  }
})
