import type { ITemplate } from '~/types/template.interface'
import type { ITemplateToEdit } from '~/types/template-edit.interfaces'

export default {
  createFromFile(file: File, isSystem: boolean): Promise<any> {
    const { $apiFetch } = useNuxtApp()

    const formData = new FormData()
    formData.append('file', file)
    formData.append('isSystem', String(isSystem))

    return $apiFetch('/templates', { method: 'POST', body: formData })
  },

  getAll(): Promise<ITemplate[]> {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch<ITemplate[]>('/templates', { method: 'GET' })
  },

  getOne(templateId: string): Promise<ITemplate> {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch<ITemplate>(`/templates/${templateId}`, { method: 'GET' })
  },

  delete(templateId: string): Promise<boolean> {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch<boolean>(`/templates/${templateId}`, { method: 'DELETE' })
  },

  update(templateId: string, template?: Partial<ITemplateToEdit>, file?: File): Promise<ITemplateToEdit> {
    const { $apiFetch } = useNuxtApp()

    const formData = new FormData()

    if (template) {
      Object.entries(template).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })
    }

    if (file) {
      formData.append('file', file)
    }

    return $apiFetch<ITemplateToEdit>(`/templates/${templateId}`, { method: 'PATCH', body: formData })
  },

  getVariables(templateId: string): Promise<string[]> {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch<string[]>(`/templates/${templateId}/variables`, { method: 'GET' })
  },
}