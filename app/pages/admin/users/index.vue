<script setup lang="ts">
import { useAdminUsers } from '~/composables/Admin/useAdminUsers'

definePageMeta({
  middleware: "admin"
})

const { users, total, page, limit, sortByField, order, loading, fetchUsers, deleteUser } = useAdminUsers()

await fetchUsers()

watch([page, limit, sortByField, order], fetchUsers)

const handleOptions = (opts: { page: number; itemsPerPage: number; sortBy: { key: string; order: 'asc' | 'desc' }[] }) => {
  const sort = opts.sortBy[0]
  page.value = opts.page
  limit.value = opts.itemsPerPage
  sortByField.value = sort?.key ?? 'createdAt'
  order.value = sort?.order ?? 'desc'
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <AdminUsersTable
          :users="users"
          :loading="loading"
          :total="total"
          @delete="deleteUser"
          @update:options="handleOptions"
        />
      </v-col>
    </v-row>
  </v-container>
</template>