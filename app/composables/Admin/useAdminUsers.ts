import type { IAuthUser } from "~/types/auth/auth-user.interface"
import { useAdminApi } from "~/api/AdminApi"

export const useAdminUsers = () => {
  const adminApi = useAdminApi()

  const users = ref<IAuthUser[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)
  const sortByField = ref('createdAt')
  const order = ref<'asc' | 'desc'>('desc')
  const loading = ref(false)

  const fetchUsers = async () => {
    loading.value = true
    try {
      const data = await adminApi.getAllUsers({
        page: page.value,
        limit: limit.value,
        sortBy: sortByField.value,
        order: order.value,
      })
      if (data) {
        users.value = data.users
        total.value = data.total
      }
    } catch {
      users.value = []
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await adminApi.deleteUser(id)
      await fetchUsers()
      return true
    } catch {
      return false
    }
  }

  return { users, total, page, limit, sortByField, order, loading, fetchUsers, deleteUser }
}
