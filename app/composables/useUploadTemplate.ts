import { toast } from 'vue3-toastify'

export const useUploadTemplate = () => {
  const { $apiFetch } = useNuxtApp()
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  const uploadTemplate = async (file: File) => {
    loading.value = true
    error.value = null
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await $apiFetch('/templates/upload', {
        method: 'POST',
        body: formData,
      })

      if (process.client) {
        toast('Шаблон успешно загружен', { type: 'success' })
      }

      return response
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Ошибка при загрузке шаблона'
      error.value = errorMessage
      
      if (process.client) {
        toast(errorMessage, { type: 'error' })
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    uploadTemplate
  }
} 