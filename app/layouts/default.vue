<script setup lang="ts">
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'F1') {
    e.preventDefault()
    window.open('/help/index.htm', '_blank')
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <v-app>
    <AppBar>
      <template #action>
        <v-btn href="/help/index.htm" target="_blank" variant="flat" color="primary">
          Помощь
        </v-btn>
      </template>

      <template #action-mobile>
        <v-list-item href="/help/index.htm" target="_blank" prepend-icon="mdi-help" rounded="xl">
          <v-list-item-title>Помощь</v-list-item-title>
        </v-list-item>
      </template>
    </AppBar>

    <v-main>
      <slot />
    </v-main>

    <Footer />
  </v-app>
</template>