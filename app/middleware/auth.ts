export default defineNuxtRouteMiddleware((to, from) => {
  let authStore = useAuth()
  let isAuth = !!authStore.user

  if (!isAuth) {
    return navigateTo('/login')
  }
})