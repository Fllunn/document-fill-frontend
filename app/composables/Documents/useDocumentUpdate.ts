import { useDocumentApi } from '~/api/DocumentApi'
import { useSaveBlob } from '~/composables/Documents/useSaveBlob'
import { toast } from 'vue3-toastify'

export const useDocumentUpdate = () => {
  const api = useDocumentApi()
  const { saveBlob } = useSaveBlob()
  const loading = ref(false)

  async function update(file: File, values: Record<string, any>, name?: string, format: 'docx' | 'pdf' = 'docx'): Promise<boolean> {
    loading.value = true
    try {
      const blob = await api.update(file, values, name, format)
      const filename = `${name ?? 'document'}.${format}`
      await saveBlob(blob, filename, format)
      toast.success(`Документ "${filename}" создан`)
      return true
    } catch (error: any) {
      const blob: Blob | undefined = error?.data

      const json = blob instanceof Blob ? JSON.parse(await blob.text()) : (error?.data ?? {})

      const msg: string = Array.isArray(json?.message) ? json.message[0] : (json?.message ?? '')

      toast.error(msg || 'Ошибка при обновлении документа')
      
      return false
    } finally {
      loading.value = false
    }
  }

  return { loading, update }
}
