<script setup lang="ts">
type Step = { title: string; description: string }

defineProps<{ steps: Step[] }>()
</script>

<template>
  <v-container class="py-16">
    <TypeWriter tag="h2" class="text-center mb-12 font-bold" :strings="['Как сделать документ?']" :loop="false"/>
    <v-row justify="center">

      <v-col cols="12" md="4" class="d-flex flex-column align-center text-center px-8">
        <v-avatar size="64" variant="outlined" class="mb-6">
          <span class="step-number">1</span>
        </v-avatar>
        <v-card width="300" height="150" class="mb-6" variant="outlined" elevation="2">
          <v-card-text class="d-flex align-center justify-center flex-wrap h-100 text-center">
            <span>Меня зовут <span class="text-primary font-weight-bold">{Имя}</span>, мне <span class="text-primary font-weight-bold">{Возраст}</span> лет!</span>
          </v-card-text>
        </v-card>
        <v-card-title class="mb-1 text-wrap font-weight-bold">{{ steps[0]?.title }}</v-card-title>
        <p class="text-wrap">{{ steps[0]?.description }}</p>
      </v-col>

      <v-col cols="12" md="4" class="d-flex flex-column align-center text-center px-8">
        <v-avatar size="64" variant="outlined" class="mb-6">
          <span class="step-number">2</span>
        </v-avatar>
        <v-card width="300" height="150" class="mb-6" variant="outlined" elevation="2">
          <v-card-text class="d-flex flex-column justify-center h-100">
            <v-text-field
              model-value="Иван"
              label="Имя"
              variant="outlined"
              density="compact"
              readonly
              hide-details
              class="mb-2"
              style="flex: 0 0 auto"
            />
            <v-text-field
              model-value="20"
              label="Возраст"
              variant="outlined"
              density="compact"
              readonly
              hide-details
              style="flex: 0 0 auto"
            />
          </v-card-text>
        </v-card>
        <v-card-title class="mb-1 text-wrap font-weight-bold">{{ steps[1]?.title }}</v-card-title>
        <p class="text-wrap">{{ steps[1]?.description }}</p>
      </v-col>

      <v-col cols="12" md="4" class="d-flex flex-column align-center text-center px-8">
        <v-avatar size="64" variant="outlined" class="mb-6">
          <span class="step-number">3</span>
        </v-avatar>
        <v-card width="300" height="150" class="mb-6" variant="outlined" elevation="2">
          <v-card-text class="d-flex align-center justify-center h-100 text-center">
            <span>Меня зовут Иван, мне 20 лет!</span>
          </v-card-text>
        </v-card>
        <v-card-title class="mb-1 text-wrap font-weight-bold">{{ steps[2]?.title }}</v-card-title>
        <p class="text-wrap">{{ steps[2]?.description }}</p>
      </v-col>

    </v-row>
  </v-container>
</template>

<style scoped>
.step-number {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
}
</style>
