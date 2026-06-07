import { useDocumentApi } from '~/api/DocumentApi'
import { useSaveBlob } from '~/composables/Documents/useSaveBlob'
import { toast } from 'vue3-toastify'

export const useDocumentUpdate = () => {
  const api = useDocumentApi()
  const { saveBlob } = useSaveBlob()
  const config = useRuntimeConfig()
  const loading = ref(false)

  async function update(
    file: File,
    values: Record<string, any>,
    rawValues: Record<string, any> | undefined,
    name?: string,
    format: 'docx' | 'pdf' = 'docx',
  ): Promise<boolean> {
    loading.value = true
    try {
      const { downloadToken } = await api.update(file, values, rawValues, name, format)
      const filename = `${name ?? 'document'}.${format}`
      const apiBase = (config.public.apiBase as string).replace(/\/$/, '')
      const downloadUrl = `${apiBase}/documents/download/${downloadToken}`

      const response = await fetch(downloadUrl)
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}))
        const msg = errJson?.message ?? `Ошибка загрузки (${response.status})`
        throw Object.assign(new Error(msg), { data: errJson })
      }
      const blob = await response.blob()

      const isMobile = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent)
      if (isMobile) {
        const blobUrl = URL.createObjectURL(blob)
        window.location.href = blobUrl
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000)
        toast.success(`Документ "${filename}" создан`)
        return true
      }

      const saved = await saveBlob(blob, filename, format)
      if (!saved) {
        toast.info('Отмена')
        return false
      }
      toast.success(`Документ "${filename}" создан`)
      return true
    } catch (error: any) {
      const json = error?.data ?? {}
      const msg: string = Array.isArray(json?.message) ? json.message[0] : (json?.message ?? error?.message ?? '')

      toast.error(msg || 'Ошибка при обновлении документа')
      return false
    } finally {
      loading.value = false
    }
  }

  return { loading, update }
}
