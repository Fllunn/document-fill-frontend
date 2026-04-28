import type { FetchError, FetchOptions } from 'ofetch'
import { toast } from 'vue3-toastify'

type ApiError = {
  message?: string
}

type ApiOptions = Omit<FetchOptions, 'method'> & {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
}

const REFRESH_URL = '/auth/refresh'
const SKIP_REFRESH_URLS = ['/auth/register', '/auth/login', REFRESH_URL, '/auth/logout']

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const requestHeaders = import.meta.server ? useRequestHeaders(['cookie']) : {}

  let refreshPromise: Promise<unknown> | null = null

  const apiFetchBase = $fetch.create({
    baseURL: config.public.apiBase as string,
    credentials: 'include',

    onRequest({ options }) {
      if (!import.meta.server || !requestHeaders.cookie) {
        return
      }

      const headers = new Headers(options.headers)

      headers.set('cookie', requestHeaders.cookie)

      options.headers = headers
    },
  })

  async function refresh(): Promise<void> {
    refreshPromise ??= apiFetchBase(REFRESH_URL, {
      method: 'GET',
    }).finally(() => {
      refreshPromise = null
    })

    await refreshPromise
  }

  const apiFetch = async <T>(url: string, options?: ApiOptions): Promise<T> => {
    try {
      return await apiFetchBase<T>(url, options)
    } catch (error) {
      let finalError = error
      let fetchError = finalError as FetchError<ApiError>

      if (fetchError.status === 401 && !SKIP_REFRESH_URLS.some((route) => url.includes(route))) {
        try {
          await refresh()

          return await apiFetchBase<T>(url, options)
        } catch (retryError) {
          finalError = retryError
          fetchError = retryError as FetchError<ApiError>
        }
      }

      if (import.meta.client && !url.includes(REFRESH_URL) && fetchError.data?.message) {
        toast(fetchError.data.message, { type: 'error' })
      }

      throw finalError
    }
  }

  return {
    provide: {
      apiFetch,
    },
  }
})
