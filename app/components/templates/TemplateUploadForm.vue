<script setup lang="ts">

import { ref } from 'vue';
import { useUploadTemplate } from '~/composables/useUploadTemplate'

const file = ref<File | null>(null);
const { loading, error, uploadTemplate } = useUploadTemplate();

const upload = async () => {
  if (!file.value) return;

  await uploadTemplate(file.value);
}

</script>

<template>
  <v-form>
    <v-file-input v-model="file" label="Загрузить шаблон"
      :loading="loading" :disabled="loading" accept=".docx,.doc" />

    <v-btn color="primary" @click="upload" :loading="loading" :disabled="loading || !file">
      Загрузить
    </v-btn>
  </v-form>
</template>