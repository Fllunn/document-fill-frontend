<script setup lang="ts">
defineProps<{
  src: string
  title?: string
  address?: string
}>()
</script>

<template>
  <v-card flat>
    <v-card elevation="0" class="work-img-wrap">
      <img :src="src" loading="lazy" class="work-img" />
    </v-card>
    <v-card-subtitle v-if="address" class="text-center px-0 pt-2 pb-0 text-wrap">{{ address }}</v-card-subtitle>
    <v-card-title v-if="title" class="text-center px-0 pt-1 text-wrap">{{ title }}</v-card-title>
  </v-card>
</template>

<style scoped>
.work-img-wrap {
  /* aspect-ratio: 4 / 5; */
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #b9b9b9;
}

.work-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  -webkit-user-drag: none;
}

.work-img-wrap {
  user-select: none;
}
</style>
