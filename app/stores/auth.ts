import { defineStore } from "pinia"
import { useAuthApi } from "../api/AuthApi"
import { ref } from "vue"

import type { IAuthUser } from "../types/auth/auth-user.interface"
import type { IRegister } from "~/types/auth/register.interface"
import type { ILogin } from "~/types/auth/login.interface"
import type { IUpdateUser } from "~/types/auth/update-user.interface"
import type { IChangePassword } from "~/types/auth/change-password.interface"

export const useAuth = defineStore('auth', () => {
  const user = ref<IAuthUser | null>(null)
  const authChecked = ref(false)
  const AuthAPI = useAuthApi()
  const router = useRouter()

  async function register(data: IRegister): Promise<boolean> {
    try {
      const response = await AuthAPI.register(data)
      
      user.value = response

      return true
    } catch {
      return false
    }
  }

  async function login(data: ILogin): Promise<boolean> {
    try {
      const response = await AuthAPI.login(data)

      user.value = response

      return true
    } catch {
      return false
    }
  }

  async function checkAuth(): Promise<boolean> {
    if (authChecked.value) {
      return !!user.value?._id
    }

    try {
      if (user.value?._id) {
        authChecked.value = true
        return true
      }

      const response = await AuthAPI.refresh()

      user.value = response
      authChecked.value = true

      return true
    } catch {
      user.value = null
      authChecked.value = true

      return false
    }
  }

  async function logout(): Promise<void> {
    try {
      await AuthAPI.logout()
    } finally {
      user.value = null
      
      await router.push('/')
    }
  }

  async function updateUser(data: IUpdateUser): Promise<boolean> {
    try {
      const response = await AuthAPI.updateUser(data)

      user.value = response

      return true
    } catch {
      return false
    }
  }

  async function changePassword(data: IChangePassword): Promise<boolean> {
    try {
      const response = await AuthAPI.changePassword(data)

      user.value = response

      return true
    } catch {
      return false
    }
  }

  async function deleteUser(password: string): Promise<boolean> {
    try {
      await AuthAPI.deleteUser(password)

      user.value = null
      
      await router.push('/')

      return true
    } catch {
      return false
    }
  }

  return {
    // переменные
    user,
    // функции
    register, login, checkAuth, logout,
    updateUser, changePassword, deleteUser,
  }
})
