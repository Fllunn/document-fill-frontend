export const useTelegramApi = () => {
  const { $apiFetch } = useNuxtApp()

  return {
    getStatus() {
      return $apiFetch<{ linked: boolean }>('/telegram/status', { method: 'GET' })
    },

    getLinkCode() {
      return $apiFetch<{ code: string; expiresIn: number }>('/telegram/link-code', { method: 'POST' })
    },

    unlink() {
      return $apiFetch<void>('/telegram/unlink', { method: 'DELETE' })
    },
  }
}
