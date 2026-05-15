<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import { toast } from 'vue3-toastify'
import { useField, useForm } from 'vee-validate'
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

const { nameRule } = useValidationRules()

const isRenameDialogOpen = ref(false)
const renameId = ref<string | null>(null)
const renamePlaceholder = ref('')

const {
  meta: renameMeta,
  handleSubmit: handleRenameSubmit,
  resetForm: resetRenameForm,
} = useForm({
  initialValues: { name: '' },
  validationSchema: { name: nameRule },
})

const renameName = useField<string>('name')

watch(isRenameDialogOpen, (isOpen) => {
  if (!isOpen) resetRenameForm()
})

function openRenameDialog(templateId: string, currentName: string) {
  renameId.value = templateId
  renamePlaceholder.value = currentName
  isRenameDialogOpen.value = true
}

const renameTemplate = handleRenameSubmit(async (values) => {
  const id = renameId.value!
  const oldTemplates = templates.value

  templates.value = templates.value.map((t) =>
    t._id === id ? { ...t, name: values.name } : t,
  )
  isRenameDialogOpen.value = false

  try {
    await TemplatesApi.update(id, { name: values.name })

    toast('Шаблон успешно переименован', { type: 'success' })
  } catch {
    templates.value = oldTemplates
  }
})

const userTemplateCols = computed(() => {
  const countTemplates = userTemplates.value.length
  if (countTemplates === 1) return { cols: 12 }
  if (countTemplates === 2) return { cols: 12, sm: 6 }
  return { cols: 12, sm: 6, md: 4 }
})

const systemTemplateCols = computed(() => {
  const countTemplates = systemTemplates.value.length
  if (countTemplates === 1) return { cols: 12 }
  if (countTemplates === 2) return { cols: 12, sm: 6 }
  return { cols: 12, sm: 6, md: 4 }
})

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

        <v-col v-for="template in userTemplates" :key="template._id" v-bind="userTemplateCols">
          <TemplatesFileCard
            :title="template.name"
            :action-button="{ icon: 'mdi-download-outline', confirmText: 'Скачать шаблон?', confirmLabel: 'Скачать', color: 'primary' }"
            :fill-button="{ icon: 'mdi-form-select', color: 'success' }"
            :rename-button="{ icon: 'mdi-pencil-outline', color: 'secondary' }"
            :delete-button="{ icon: 'mdi-delete-outline', confirmText: 'Удалить шаблон?', confirmLabel: 'Удалить', color: 'error' }"
            @action="downloadTemplate(template._id, template.name)"
            @fill="navigateTo(`/cabinet/fill/${template._id}`)"
            @rename="openRenameDialog(template._id, template.name)"
            @delete="deleteTemplate(template._id)"
          />
        </v-col>

        <v-col cols="12">
          <h2>Предустановленные шаблоны</h2>
        </v-col>

        <v-col v-if="systemTemplates.length === 0" cols="12">
          Нет предустановленных шаблонов
        </v-col>

        <v-col v-for="template in systemTemplates" :key="template._id" v-bind="systemTemplateCols">
          <TemplatesFileCard
            :title="template.name"
            :action-button="{ icon: 'mdi-download-outline', confirmText: 'Скачать шаблон?', confirmLabel: 'Скачать', color: 'primary' }"
            :fill-button="{ icon: 'mdi-form-select', color: 'success' }"
            :rename-button="isAdmin ? { icon: 'mdi-pencil-outline', color: 'secondary' } : undefined"
            :delete-button="isAdmin ? { icon: 'mdi-delete-outline', confirmText: 'Удалить шаблон?', confirmLabel: 'Удалить', color: 'error' } : undefined"
            @action="downloadTemplate(template._id, template.name)"
            @fill="navigateTo(`/cabinet/fill/${template._id}`)"
            @rename="openRenameDialog(template._id, template.name)"
            @delete="deleteTemplate(template._id)"
          />
        </v-col>
      </template>
    </v-row>

    <CabinetSettingsDialog
      v-model="isRenameDialogOpen"
      title="Переименовать шаблон"
      submit-text="Сохранить"
      :disabled="!renameMeta.valid"
      @submit="renameTemplate"
    >
      <UiTextField
        v-model="renameName.value.value"
        :error-messages="renameName.errorMessage.value"
        label="Новое название"
        :placeholder="renamePlaceholder"
        prepend-inner-icon="mdi-account-circle-outline"
        autofocus
      />
    </CabinetSettingsDialog>
  </v-container>
</template>