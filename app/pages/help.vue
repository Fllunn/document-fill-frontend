<script setup lang="ts">
import { faqCategories } from '~/data/faq'
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h1 class="mb-6">Помощь</h1>

        
        <v-card variant="outlined" class="mb-6 pa-4 d-flex align-center justify-space-between flex-wrap gap-4">
          <span>Для более подробного ознакомления Вы можете посмотреть руководство пользователя</span>
          <v-btn href="/help/index.htm" target="_blank" variant="flat" color="primary">
            Руководство пользователя
          </v-btn>
        </v-card>

        <FaqCategory
          v-for="category in faqCategories"
          :key="category.title"
          :title="category.title"
          :items="category.items"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
