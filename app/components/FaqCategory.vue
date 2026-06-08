<script setup lang="ts">
import type { FaqItem } from '~/data/faq'

defineProps<{
  title?: string
  items: FaqItem[]
}>()
</script>

<template>
  <v-card variant="outlined" class="mb-6 pa-4">
    <h2 v-if="title" class="mt-2 mb-2">{{ title }}</h2>
    <v-expansion-panels variant="accordion" elevation="0">
      <template v-for="(item, i) in items" :key="i">
        <v-expansion-panel elevation="0" bg-color="transparent">
          <v-expansion-panel-title class="px-0">{{ item.q }}</v-expansion-panel-title>
          <v-expansion-panel-text class="px-0">
            {{ item.a }}
            <ImageMain
              v-if="item.img"
              :src="item.img.src"
              :title="item.img.title"
              :address="item.img.address"
              class="mt-3"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-divider v-if="i < items.length - 1" />
      </template>
    </v-expansion-panels>
  </v-card>
</template>

<style scoped>
:deep(.v-expansion-panel-title) {
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
}

:deep(.v-expansion-panel-text__wrapper) {
  font-size: clamp(1rem, 1.5vw, 1.1rem);
}
</style>
