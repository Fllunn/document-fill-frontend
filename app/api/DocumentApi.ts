export const useDocumentApi = () => {
  const { $apiFetch } = useNuxtApp()

  return {
    create(templateId: string, values: Record<string, any>, rawValues: Record<string, any> | undefined, name?: string, format?: 'docx' | 'pdf', namePattern?: string) {
      return $apiFetch<Blob>('/documents', {
        method: 'POST',
        body: { templateId, values, rawValues, name, namePattern },
        responseType: 'blob',
        params: format ? { format } : undefined,
      })
    },

    extract(file: File) {
      const form = new FormData()
      form.append('file', file)
      return $apiFetch<{ values: Record<string, any>; rawValues: Record<string, any> | null; name: string }>('/documents/extract', {
        method: 'POST',
        body: form,
      })
    },

    update(file: File, values: Record<string, any>, rawValues: Record<string, any> | undefined, name?: string, format?: 'docx' | 'pdf') {
      const form = new FormData()
      form.append('file', file)
      form.append('values', JSON.stringify(values))
      if (rawValues) form.append('rawValues', JSON.stringify(rawValues))
      if (name) form.append('name', name)
      return $apiFetch<Blob>('/documents/update', {
        method: 'POST',
        body: form,
        responseType: 'blob',
        params: format ? { format } : undefined,
      })
    },
  }
}
