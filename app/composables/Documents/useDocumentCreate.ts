import { useDocumentApi } from '~/api/DocumentApi'
import { toast } from 'vue3-toastify'

export const useDocumentCreate = () => {
  const api = useDocumentApi()
  const loading = ref(false)

  async function create(templateId: string, values: Record<string, any>, name?: string) {
    loading.value = true
    try {
      const blob = await api.create(templateId, values, name)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${name ?? 'document'}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 100)
    } catch {
      toast.error('Ошибка при создании документа')
      return false
    } finally {
      loading.value = false
    }
  }

  return { loading, create }
}
