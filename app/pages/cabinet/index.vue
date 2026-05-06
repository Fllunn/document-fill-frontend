<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import { toast } from 'vue3-toastify'
import TemplatesApi from '~/api/TemplatesApi'
import type { ITemplate } from '~/types/template.interface'

const { isAdmin } = useRole()

const templates = ref<ITemplate[]>([])
const loading = ref(false)

const systemTemplates = computed(() => templates.value.filter((t) => t.storageType === 'system'))
const userTemplates = computed(() => templates.value.filter((t) => t.storageType === 'user'))

async function fetchTemplates(): Promise<void> {
  loading.value = true

  try {
    templates.value = await TemplatesApi.getAll()
  } finally {
    loading.value = false
  }
}

async function downloadTemplate(templateId: string, name: string): Promise<void> {
  const blob = await TemplatesApi.download(templateId)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')

  a.href = url
  a.download = `${name}.docx`
  a.click()
  URL.revokeObjectURL(url)
}

async function deleteTemplate(templateId: string): Promise<void> {
  const saveTemplates = templates.value
  templates.value = templates.value.filter((t) => t._id !== templateId)

  try {
    await TemplatesApi.delete(templateId)

    toast('Шаблон успешно удален', { type: 'success' })
  } catch {
    templates.value = saveTemplates
  }
}

onMounted(fetchTemplates)
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Шаблоны</h1>
      </v-col>

      <v-col cols="12">
        <TemplatesTemplateUploadForm @uploaded="fetchTemplates" />
      </v-col>

      <v-col v-if="loading" cols="12" class="d-flex justify-center">
        <v-progress-circular indeterminate />
      </v-col>

      <template v-else>
        <v-col cols="12">
          <h2>Мои шаблоны</h2>
        </v-col>

        <v-col v-if="userTemplates.length === 0" cols="12">
          Нет загруженных шаблонов
        </v-col>

        <v-col v-for="template in userTemplates" :key="template._id" cols="12">
          <TemplatesFileCard
            :title="template.name"
            :action-button="{ icon: 'mdi-download-outline', confirmText: 'Скачать шаблон?', confirmLabel: 'Скачать', color: 'primary' }"
            :delete-button="{ icon: 'mdi-delete-outline', confirmText: 'Удалить шаблон?', confirmLabel: 'Удалить', color: 'error' }"
            @action="downloadTemplate(template._id, template.name)"
            @delete="deleteTemplate(template._id)"
          />
        </v-col>

        <v-col cols="12">
          <h2>Системные шаблоны</h2>
        </v-col>

        <v-col v-if="systemTemplates.length === 0" cols="12">
          Нет системных шаблонов
        </v-col>

        <v-col v-for="template in systemTemplates" :key="template._id" cols="12">
          <TemplatesFileCard
            :title="template.name"
            :action-button="{ icon: 'mdi-download-outline', confirmText: 'Скачать шаблон?', confirmLabel: 'Скачать', color: 'primary' }"
            :delete-button="isAdmin ? { icon: 'mdi-delete-outline', confirmText: 'Удалить шаблон?', confirmLabel: 'Удалить', color: 'error' } : undefined"
            @action="downloadTemplate(template._id, template.name)"
            @delete="deleteTemplate(template._id)"
          />
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>