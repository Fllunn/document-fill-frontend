import { toast } from 'vue3-toastify'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const requestHeaders = import.meta.server ? useRequestHeaders(['cookie']) : {}

  const $apiFetch = $fetch.create({
    baseURL: config.public.apiBase as string,
    credentials: 'include',

    onRequest({ options }) {
      if (import.meta.server && requestHeaders.cookie) {
        const headers = new Headers(options.headers)

        headers.set('cookie', requestHeaders.cookie)

        options.headers = headers
      }
    },

    onResponseError({ response }) {
      if (response._data?.message && import.meta.client) {
        toast(response._data.message, { type: 'error' })
      }
    },
  })

  return {
    provide: {
      apiFetch: $apiFetch,
    },
  }
})