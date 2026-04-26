export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuth()

  const isAuth = authStore.user?._id ? true : await authStore.checkAuth()

  if (!isAuth) {
    return
  }

  if (authStore.user?.roles.includes('admin')) {
    return navigateTo('/admin')
  }

  return navigateTo('/cabinet')
})
