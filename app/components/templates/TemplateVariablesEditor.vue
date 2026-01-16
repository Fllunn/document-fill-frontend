<script setup lang="ts">

import { onMounted } from 'vue';
import { useVariablesTemplate } from '~/composables/Templates/useVariablesTemplate';

const templateId = ref<string | null>(null);

const { state, getVariables } = useVariablesTemplate();

// onMounted(() => {
//   if (templateId.value) {
//     getVariables(templateId.value);
//   }
// });

watch(templateId, (newId) => {
  if (newId) {
    getVariables(newId);
  }
});

</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field label="ID шаблона" v-model="templateId"></v-text-field>

        <v-progress-circular v-if="state.loading" indeterminate />
        <v-alert v-else-if="state.error">Ошибка: {{ state.error }}</v-alert>

        <v-list v-else>
          <v-list-item v-for="(v, i) in state.data" :key="i">
            <v-text-field :placeholder="v" />
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    
  </v-container>
</template>

