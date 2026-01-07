export const useRole = () => {
  const authStore = useAuth();
  const config = useRuntimeConfig();

  const isAdmin = computed(() => {
    if (!authStore.user) {
      return false;
    }

    const hasManagerRole = authStore.user.roles.includes('manager');
    if (!hasManagerRole) {
      return false;
    }
    return true;
    // const adminEmails = config.public.adminEmails ? config.public.adminEmails.split(',') : [];

    // for (let email of adminEmails) {
    //   if (email === authStore.user.email) {
    //     return true
    //   }
    // }
    // return false;
  });

  const isManager = computed(() => {
    if (!authStore.user) {
      return false;
    }

    const hasManagerRole = authStore.user.roles.includes('manager');
    if (!hasManagerRole) {
      return false;
    }

    return true;
  })


  const isEmployer = computed(() => {
    if (!authStore.user) {
      return false;
    }

    const hasEmployerRole = authStore.user.roles.includes('employer');
    if (!hasEmployerRole) {
      return false;
    }

    return true;
  })

  const isEmployee = computed(() => {
    if (!authStore.user) {
      return false;
    }

    const hasEmployeeRole = authStore.user.roles.includes('employee');
    if (!hasEmployeeRole) {
      return false;
    }

    return true;
  })

  const isModerated = computed(() => {
    if (!authStore.user) {
      return false;
    }

    return true;
    // return authStore.user.isModerated
  })




  return {
    isAdmin, isManager, isEmployer, isEmployee, isModerated
  };
};