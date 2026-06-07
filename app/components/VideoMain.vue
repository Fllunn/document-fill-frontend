<script setup lang="ts">
defineProps<{
  src: string
  image?: string
  title?: string
  address?: string
}>()

const isMobile = computed(() => {
  if (import.meta.client) {
    return /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent)
  }
  return false
})
</script>

<template>
  <v-card flat>
    <div class="work-video-wrap">
      <video
        v-if="isMobile"
        :src="src"
        :poster="image"
        class="work-video"
        controls
        controlsList="nodownload"
      />
      <v-video
        v-else
        :src="src"
        :image="image"
        class="work-video"
        controls
      />
    </div>
    <v-card-subtitle v-if="address" class="text-center px-0 pt-2 pb-0 text-wrap">{{ address }}</v-card-subtitle>
    <v-card-title v-if="title" class="text-center px-0 pt-1 text-wrap">{{ title }}</v-card-title>
  </v-card>
</template>

<style scoped>
.work-video-wrap {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 8px;
  user-select: none;
}

.work-video {
  width: 100%;
  height: auto;
  display: block;
}
</style>
