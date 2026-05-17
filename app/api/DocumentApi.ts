export const useDocumentApi = () => {
  const { $apiFetch } = useNuxtApp()

  return {
    create(templateId: string, values: Record<string, any>, name?: string) {
      return $apiFetch<Blob>('/documents', {
        method: 'POST',
        body: { templateId, values, name },
        responseType: 'blob',
      })
    },

    extract(file: File) {
      const form = new FormData()
      form.append('file', file)
      return $apiFetch<{ values: Record<string, string>; name: string }>('/documents/extract', {
        method: 'POST',
        body: form,
      })
    },

    update(file: File, values: Record<string, string>, name?: string) {
      const form = new FormData()
      form.append('file', file)
      form.append('values', JSON.stringify(values))
      if (name) form.append('name', name)
      return $apiFetch<Blob>('/documents/update', {
        method: 'POST',
        body: form,
        responseType: 'blob',
      })
    },
  }
}
