export default defineNuxtRouteMiddleware((to, from) => {
  let authStore = useAuth()
  let isAuth = !!authStore.user

  if (isAuth) {
    if (authStore.user?.roles.indexOf('admin') != -1) {
      return navigateTo('/admin')
    }
    if (authStore.user?.roles.indexOf('user') != -1) {
      return navigateTo('/cabinet')
    }
  }
})