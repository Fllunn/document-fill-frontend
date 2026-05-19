<script setup lang="ts">
import type { IAuthUser } from '~/types/auth/auth-user.interface'

defineProps<{
  users: IAuthUser[]
  loading: boolean
  total: number
}>()

const emit = defineEmits<{
  delete: [id: string]
  'update:options': [options: { page: number; itemsPerPage: number; sortBy: { key: string; order: 'asc' | 'desc' }[] }]
}>()

const headers = [
  { title: '', key: 'actions', sortable: false },
  { title: 'ID', key: '_id', sortable: false },
  { title: 'Имя', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Роли', key: 'roles', sortable: true },
  { title: 'Файлы', key: 'fileCount', sortable: true },
  { title: 'Дата регистрации', key: 'createdAt', sortable: true },
]

const menuOpen = ref<Record<string, boolean>>({})
</script>

<template>
  <v-data-table-server
    :items="users"
    :headers="headers"
    :loading="loading"
    :items-length="total"
    :items-per-page-options="[{ value: 10, title: '10' }, { value: 20, title: '20' }, { value: 50, title: '50' }, { value: 100, title: '100' }]"
    item-value="_id"
    @update:options="emit('update:options', $event)"
  >
    <template #item.roles="{ item }">
      {{ item.roles?.join(', ') ?? '-' }}
    </template>

    <template #item.createdAt="{ item }">
      {{ item.createdAt ? new Date(item.createdAt).toLocaleString() : '-' }}
    </template>

    <template #item.actions="{ item }">
      <v-menu v-model="menuOpen[item._id]" :close-on-content-click="false">
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps"
            icon="mdi-delete"
            variant="text"
            color="error"
            size="small"
          />
        </template>
        <v-card>
          <v-card-text class="pb-0">Удалить пользователя?</v-card-text>
          <v-card-actions class="justify-center">
            <v-btn size="small" @click="menuOpen[item._id] = false">Отмена</v-btn>
            <v-btn
              size="small"
              color="error"
              @click="emit('delete', item._id); menuOpen[item._id] = false"
            >
              Удалить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </template>
  </v-data-table-server>
</template>
