import { useDocumentApi } from '~/api/DocumentApi'
import { useSaveBlob } from '~/composables/Documents/useSaveBlob'
import { toast } from 'vue3-toastify'

export const useDocumentCreate = () => {
  const api = useDocumentApi()
  const { saveBlob } = useSaveBlob()
  const loading = ref(false)

  async function create(
    templateId: string,
    values: Record<string, any>,
    name?: string,
    format: 'docx' | 'pdf' = 'docx',
    namePattern?: string,
  ): Promise<boolean> {
    loading.value = true
    try {
      const blob = await api.create(templateId, values, name, format, namePattern)
      const filename = `${name ?? 'document'}.${format}`
      const saved = await saveBlob(blob, filename, format)
      if (!saved) {
        toast.info('Отмена')
        return false
      }
      toast.success(`Документ "${filename}" создан`)
      return true
    } catch (error: any) {
      const blob: Blob | undefined = error?.data
      const json = blob instanceof Blob ? JSON.parse(await blob.text()) : (error?.data ?? {})
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
