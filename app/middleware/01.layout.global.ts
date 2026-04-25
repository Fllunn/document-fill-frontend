export default defineNuxtRouteMiddleware((to, from) => {
  const { isAdmin } = useRole();

  if (isAdmin.value) {
    return setPageLayout("admin")
  }

  return setPageLayout("default")
});