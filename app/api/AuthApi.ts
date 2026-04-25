import type { ILogin } from "~/types/auth/login.interface"
import type { IRegister } from "~/types/auth/register.interface"
import type { IAuthUser } from "~/types/auth/auth-user.interface"
import type { IUpdateUser } from "~/types/auth/update-user.interface"
import type { IChangePassword } from "~/types/auth/change-password.interface"

export const useAuthApi = () => {
  const { $apiFetch } = useNuxtApp()

  return {
    register(user: IRegister) {
      return $apiFetch<IAuthUser>('/auth/register', { method: 'POST', body: user })
    },

    login(user: ILogin) {
      return $apiFetch<IAuthUser>('/auth/login', { method: 'POST', body: user })
    },

    refresh() {
      return $apiFetch<IAuthUser>('/auth/refresh', { method: 'GET' })
    },

    logout() {
      return $apiFetch<void>('/auth/logout', { method: 'POST' })
    },

    updateUser(user: IUpdateUser) {
      return $apiFetch<IAuthUser>('/auth/update', { method: 'POST', body: user })
    },

    changePassword(user: IChangePassword) {
      return $apiFetch<IAuthUser>('/auth/password/change', {
        method: 'POST',
        body: user,
      })
    },
  }
}
