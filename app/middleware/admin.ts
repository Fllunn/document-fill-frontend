export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuth()

  const isAuth = auth.user?._id ? true : await auth.checkAuth()

  if (!isAuth) {
    return navigateTo('/login')
  }

  if (!auth.user?.roles?.includes('admin')) {
    return navigateTo('/cabinet')
  }
})
