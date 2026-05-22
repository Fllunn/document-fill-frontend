import { useDocumentApi } from '~/api/DocumentApi'
import { toast } from 'vue3-toastify'

export const useDocumentUpdate = () => {
  const api = useDocumentApi()
  const loading = ref(false)

  async function update(file: File, values: Record<string, any>, name?: string, format: 'docx' | 'pdf' = 'docx'): Promise<boolean> {
    loading.value = true
    try {
      const blob = await api.update(file, values, name, format)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${name ?? 'document'}.${format}`
      document.body.appendChild(a)
      a.click()
      
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 100)
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
