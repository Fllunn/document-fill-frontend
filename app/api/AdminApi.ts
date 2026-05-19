import type { IAdminUsersResponse } from "~/types/admin/admin-users-response.interface"

interface GetUsersParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  sortBy?: string
  order?: string
}

export const useAdminApi = () => {
  const { $apiFetch } = useNuxtApp()

  return {
    getAllUsers(params: GetUsersParams = {}) {
      return $apiFetch<IAdminUsersResponse>('/admin/users', {
        method: 'GET',
        query: params,
      })
    },

    deleteUser(id: string) {
      return $apiFetch<void>(`/admin/users/${id}`, { method: 'DELETE' })
    },
  }
}
