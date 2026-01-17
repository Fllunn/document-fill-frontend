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

        <v-sheet v-else>
          <v-list>
            <template v-for="(vars, category) in state.data" :key="category">
              <v-subheader>{{ category }}</v-subheader>

              <v-list-item v-for="(v, i) in vars" :key="i">
                <v-text-field :placeholder="v" />
              </v-list-item>
            </template>
          </v-list>
        </v-sheet>

      </v-col>
    </v-row>
    
  </v-container>
</template>

