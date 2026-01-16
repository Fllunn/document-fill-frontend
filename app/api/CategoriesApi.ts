export default {
  create(categories: string[]): Promise<{ templateCategories: string[] }> {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch('/user/categories', { method: 'POST', body: { categories } })
  },

  get(): Promise<{ templateCategories: string[] }> {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch('/user/categories', { method: 'GET' })
  },

  update(categories: string[]): Promise<{ templateCategories: string[] }> {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch('/user/categories', { method: 'PATCH', body: { categories } })
  },

  delete(): Promise<{ templateCategories: string[] }> {
    const { $apiFetch } = useNuxtApp()

    return $apiFetch('/user/categories', { method: 'DELETE' })
  }
}
