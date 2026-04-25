<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>

<template>
  <CabinetSettingsLayout>
    <NuxtPage />
  </CabinetSettingsLayout>
</template>
