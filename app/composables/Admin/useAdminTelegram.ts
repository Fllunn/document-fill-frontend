import { useTelegramApi } from '~/api/TelegramApi'
import { toast } from 'vue3-toastify'

export const useAdminTelegram = () => {
  const telegramApi = useTelegramApi()

  const linked = ref(false)
  const code = ref<string | null>(null)
  const loading = ref(false)
  const loadingUnlink = ref(false)

  let expireTimer: ReturnType<typeof setTimeout> | null = null

  const fetchStatus = async () => {
    loading.value = true
    try {
      const data = await telegramApi.getStatus()
      if (data) linked.value = data.linked
    } catch {
      linked.value = false
    } finally {
      loading.value = false
    }
  }

  const generateCode = async () => {
    loading.value = true
    try {
      const data = await telegramApi.getLinkCode()
      if (data) {
        code.value = data.code
        if (expireTimer) clearTimeout(expireTimer)
        expireTimer = setTimeout(() => {
          code.value = null
        }, data.expiresIn * 1000)
      }
    } finally {
      loading.value = false
    }
  }

  const unlinkTelegram = async () => {
    loadingUnlink.value = true
    try {
      await telegramApi.unlink()
      linked.value = false
      code.value = null
      toast('Telegram отвязан', { type: 'success' })
    } finally {
      loadingUnlink.value = false
    }
  }

  return { linked, code, loading, loadingUnlink, fetchStatus, generateCode, unlinkTelegram }
}
