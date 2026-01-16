<script setup lang="ts">
import { ref } from 'vue'
import { useUploadTemplate } from '~/composables/Templates/useUploadTemplate'

const { state, createFromFile } = useUploadTemplate()

const file = ref<File | null>(null)
const isSystem = ref(false)

function onFileChange(value: File | File[] | null) {
  file.value = Array.isArray(value) ? value[0] ?? null : value
}

async function submit() {
  if (!file.value) return

  const success = await createFromFile(file.value, isSystem.value)
  if (success) {

    // Сброс формы
    file.value = null
    isSystem.value = false
    state.value = null
  }
}
</script>

<template>
  <v-file-input
    label="Загрузить шаблон"
    accept=".docx"
    @update:model-value="onFileChange"
    v-model="file"
  />

  <v-checkbox v-model="isSystem" label="Системный шаблон" />

  <v-btn color="primary" @click="submit">Создать</v-btn>
</template>
