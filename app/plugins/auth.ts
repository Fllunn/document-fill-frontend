export default defineNuxtPlugin(async (nuxtApp) => {
  await useAuth().checkAuth()
})
