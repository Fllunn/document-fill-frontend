export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuth()

  if (auth.user?._id) {
    return
  }

  const isAuth = await auth.checkAuth()

  if (!isAuth) {
    return navigateTo('/login')
  }
})
