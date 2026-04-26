<script setup lang="ts">
type Props = {
  icon: string
  title: string
  description: string
  actionText: string
}

defineProps<Props>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <v-card>
    <v-card-text>
      <v-row align="center">
        <v-col cols="auto" class="d-none d-sm-inline-flex">
          <v-icon :icon="icon" />
        </v-col>

        <v-col cols="12" sm>
          <v-card-item class="pa-0 ">
            <v-card-title class="pa-0 text-wrap">
              {{ title }}
            </v-card-title>

            <v-card-subtitle class="pa-0 text-wrap">
              {{ description }}
            </v-card-subtitle>
          </v-card-item>
        </v-col>

        <v-col cols="12" sm="auto">
          <v-btn color="primary" @click="emit('action')">
            {{ actionText }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
