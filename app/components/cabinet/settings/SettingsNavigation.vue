<script setup lang="ts">
const items = [
  {
    title: 'Профиль',
    to: '/cabinet/settings/profile',
    icon: 'mdi-account-outline',
  },
  {
    title: 'Безопасность',
    to: '/cabinet/settings/security',
    icon: 'mdi-lock-outline',
  },
]
</script>

<template>
  <v-list nav density="comfortable">
    <v-list-item
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      :title="item.title"
      :prepend-icon="item.icon"
    />
  </v-list>
</template>
