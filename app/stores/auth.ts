import { defineStore } from "pinia"
import { useAuthApi } from "../api/AuthApi"
import { ref } from "vue"
import type { FetchError } from "ofetch"

import type { IAuthUser } from "../types/auth/auth-user.interface"
import type { IRegister } from "~/types/auth/register.interface"
import type { ILogin } from "~/types/auth/login.interface"
import type { IUpdateUser } from "~/types/auth/update-user.interface"
import type { IChangePassword } from "~/types/auth/change-password.interface"

export const useAuth = defineStore('auth', () => {
  const user = ref<IAuthUser | null>(null)
  const isAuthChecked = ref(false)
  const AuthAPI = useAuthApi()
  const router = useRouter()

  let authPromise: Promise<boolean> | null = null
  let refreshPromise: Promise<boolean> | null = null
  let isAuthFailed = false

  async function register(data: IRegister): Promise<boolean> {
    try {
      const response = await AuthAPI.register(data)
      
      user.value = response

      isAuthChecked.value = true
      isAuthFailed = false
      authPromise = null
      refreshPromise = null

      return true
    } catch {
      return false
    }
  }

  async function login(data: ILogin): Promise<boolean> {
    try {
      const response = await AuthAPI.login(data)

      user.value = response

      isAuthChecked.value = true
      isAuthFailed = false
      authPromise = null
      refreshPromise = null

      return true
    } catch {
      return false
    }
  }

  async function checkAuth(): Promise<boolean> {
    if (isAuthFailed) return false

    if (isAuthChecked.value) {
      return !!user.value?._id
    }

    if (user.value?._id) {
      isAuthChecked.value = true
      return true
    }

    if (authPromise) {
      return authPromise
    }

    authPromise = (async () => {
      try {
        user.value = await AuthAPI.me()
        isAuthChecked.value = true
        isAuthFailed = false
        return true
      } catch (error) {
        const status = (error as FetchError).status

        if (status === 401) {
          if (refreshPromise) {
            return refreshPromise
          }

          refreshPromise = (async () => {
            try {
              user.value = await AuthAPI.refresh()
              isAuthChecked.value = true
              isAuthFailed = false
              return true
            } catch {
              isAuthChecked.value = true
              user.value = null
              isAuthFailed = true
              return false
            } finally {
              refreshPromise = null
            }
          })()

          return refreshPromise
        }

        isAuthChecked.value = true
        user.value = null
        isAuthFailed = true
        return false
      } finally {
        authPromise = null
      }
    })()

    return authPromise
  }

  async function logout(): Promise<void> {
    try {
      await AuthAPI.logout()
    } finally {
      user.value = null

      isAuthChecked.value = true
      isAuthFailed = true

      authPromise = null
      refreshPromise = null
      
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
      isAuthChecked.value = true
      isAuthFailed = true
      authPromise = null
      refreshPromise = null
      
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
