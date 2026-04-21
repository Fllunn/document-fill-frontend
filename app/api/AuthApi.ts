import type { ILogin } from "~/types/auth/login.interface"
import type { IRegister } from "~/types/auth/register.interface"
import type { IAuthUser } from "~/types/auth/auth-user.interface"
import type { IUpdateUser } from "~/types/auth/update-user.interface"
import type { IChangePassword } from "~/types/auth/change-password.interface"

export default {
  register(user: IRegister) {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch<IAuthUser>('/auth/register', { method: 'POST', body: user })
  },

  login(user: ILogin) {
    const { $apiFetch } = useNuxtApp()
    
    return $apiFetch<IAuthUser>('/auth/login', { method: 'POST', body: user })
  },

  refresh() {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch<IAuthUser>('/auth/refresh', { method: 'GET' })
  },

  logout() {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch<void>('/auth/logout', { method: 'POST' })
  },

  updateUser(user: IUpdateUser) {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch<IAuthUser>('/auth/update', { method: 'POST', body: { user } })
  },

  changePassword(user: IChangePassword) {
    const { $apiFetch } = useNuxtApp()
    
    return $apiFetch<IAuthUser>('/auth/password/change', {
      method: 'POST',
      body: user,
    })
  },
}
