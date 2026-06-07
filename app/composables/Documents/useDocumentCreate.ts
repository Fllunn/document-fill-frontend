import { useDocumentApi } from '~/api/DocumentApi'
import { useSaveBlob } from '~/composables/Documents/useSaveBlob'
import { toast } from 'vue3-toastify'

export const useDocumentCreate = () => {
  const api = useDocumentApi()
  const { saveBlob } = useSaveBlob()
  const config = useRuntimeConfig()
  const loading = ref(false)

  async function create(
    templateId: string,
    values: Record<string, any>,
    rawValues: Record<string, any> | undefined,
    name?: string,
    format: 'docx' | 'pdf' = 'docx',
    namePattern?: string,
  ): Promise<boolean> {
    loading.value = true
    try {
      const { downloadToken } = await api.create(templateId, values, rawValues, name, format, namePattern)
      const filename = `${name ?? 'document'}.${format}`
      const downloadUrl = `${config.public.apiBase}/documents/download/${downloadToken}`
      const isMobile = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent)

      if (isMobile) {
        window.location.href = downloadUrl
        toast.success(`Документ "${filename}" создан`)
        return true
      }

      const response = await fetch(downloadUrl)
      const blob = await response.blob()
      const saved = await saveBlob(blob, filename, format)
      if (!saved) {
        toast.info('Отмена')
        return false
      }
      toast.success(`Документ "${filename}" создан`)
      return true
    } catch (error: any) {
      const json = error?.data ?? {}
      const msg: string = Array.isArray(json?.message) ? json.message[0] : (json?.message ?? '')

      if (msg.includes('лимит')) {
        toast.warning(msg)
        return true
      }

      toast.error(msg || 'Ошибка при создании документа')
      return false
    } finally {
      loading.value = false
    }
  }

  return { loading, create }
}
