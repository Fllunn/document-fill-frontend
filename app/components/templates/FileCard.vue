<script setup lang="ts">
type Props = {
  title: string
  subtitle?: string
  prependIcon?: string
  actionIcon: string
}

defineProps<Props>()
const emit = defineEmits<{ action: [] }>()
</script>

<template>
  <v-card variant="outlined" rounded="lg">
    <v-list-item
      :prepend-icon="prependIcon ?? 'mdi-file-word-outline'"
      :title="title"
      :subtitle="subtitle"
      density="compact"
    >
      <template #append>
        <v-btn :icon="actionIcon" variant="text" size="small" @click="emit('action')" />
      </template>
    </v-list-item>
  </v-card>
</template>
