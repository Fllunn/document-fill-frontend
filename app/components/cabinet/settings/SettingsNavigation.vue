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
  <v-list nav slim density="comfortable">
    <v-list-item
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      :prepend-icon="item.icon" 
    >
      <template #title>
        <span class="title">
          {{ item.title }}
        </span>
      </template>
    </v-list-item>
  </v-list>
</template>

<style>
.title {
  font-size: clamp(0.875rem, 0.8281rem + 0.125vw, 0.9375rem);
  font-weight: 400;
}
</style>