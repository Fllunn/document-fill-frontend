export default defineNuxtRouteMiddleware((to, from) => {
  const { isAdmin, isManager, isEmployee, isEmployer } = useRole();

  if (isAdmin.value) {
    return setPageLayout("admin")
  }

  return setPageLayout("default")
});