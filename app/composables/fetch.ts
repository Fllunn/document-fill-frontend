import type { UseFetchOptions } from 'nuxt/app';

export function useApiFetch<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) {
  const headers = useRequestHeaders(['cookie'])
  
  options = Object.assign(options, { headers })

  return useFetch(url, {
    ...options,
    baseURL: useRuntimeConfig().public.apiBase as string,
    $fetch: useNuxtApp().$apiFetch,
  })
}
