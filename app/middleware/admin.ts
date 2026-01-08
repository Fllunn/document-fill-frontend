export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth();
  
  // Если пользователь не авторизован
  if (!auth.user?._id) {
    return navigateTo("/login");
  }
  
  // Если у пользователя нет роли админа
  if (!auth.user?.roles?.includes('admin')) {
    return navigateTo("/cabinet/me");
  }
  
  return true;
})