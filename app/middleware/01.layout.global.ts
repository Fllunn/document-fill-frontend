export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAdmin } = useRole();
  const auth = useAuth();

  await auth.checkAuth()

  if (isAdmin.value) {
    return setPageLayout("admin")
  }

  return setPageLayout("default")
});