import { useDocumentApi } from '~/api/DocumentApi'
import { toast } from 'vue3-toastify'

export const useDocumentUpdate = () => {
  const api = useDocumentApi()
  const loading = ref(false)

  async function update(file: File, values: Record<string, any>, name?: string): Promise<boolean> {
    loading.value = true
    try {
      const blob = await api.update(file, values, name)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${name ?? 'document'}.docx`
      document.body.appendChild(a)
      a.click()
      
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 100)
      return true
    } catch {
      toast.error('Ошибка при обновлении документа')
      return false
    } finally {
      loading.value = false
    }
  }

  return { loading, update }
}
