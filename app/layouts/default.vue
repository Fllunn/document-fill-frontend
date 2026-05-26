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
    <AppBar />

    <v-main>
      <slot />
    </v-main>

    <Footer />
  </v-app>
</template>