<script setup lang="ts">
import { toast } from 'vue3-toastify'
import { useUploadTemplate } from '~/composables/Templates/useUploadTemplate'

const { state, createFromFile } = useUploadTemplate()
const { isAdmin } = useRole()

const emit = defineEmits<{ uploaded: [] }>()

const MAX_SIZE = 512 * 1024

const file = ref<File | null>(null)
const isSystem = ref(false)
const isDragging = ref(false)

const fileSize = computed(() => {
  if (!file.value) return ''

  const kb = file.value.size / 1024

  if (kb < 1024) {
    return `${kb.toFixed(1)} КБ`
  }

  return `${(kb / 1024).toFixed(1)} МБ`
})

function setFile(picked: File | undefined) {
  if (!picked?.name.endsWith('.docx'))
    return toast('Разрешены только файлы .docx', { type: 'error' })

  if (!isAdmin.value && picked.size > MAX_SIZE)
    return toast('Размер файла не должен превышать 512 КБ', { type: 'error' })

  file.value = picked
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  
  setFile(e.dataTransfer?.files[0])
}

async function submit() {
  if (!file.value) return

  const success = await createFromFile(file.value, isSystem.value)
  if (success) {
    file.value = null
    isSystem.value = false
    state.value = null
    emit('uploaded')
  }
}
</script>

<template>
  <v-card variant="outlined" rounded="lg">
    <v-card
      flat
      tag="label"
      :color="isDragging ? 'primary' : undefined"
      :variant="isDragging ? 'tonal' : 'flat'"
      @click="() => {}"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="onDrop($event as DragEvent)"
    >
      <v-card-text class="d-flex flex-column align-center text-center pa-8">
        <v-icon size="48">mdi-cloud-upload-outline</v-icon>

        <v-card-title class="text-wrap">
          Нажмите сюда или перетащите файл, чтобы загрузить шаблон
        </v-card-title>

        <v-card-subtitle class="text-wrap">
          Поддерживаемый формат: docx
        </v-card-subtitle>
      </v-card-text>

      <input
        type="file"
        accept=".docx"
        class="d-none"
        @change="setFile(($event.target as HTMLInputElement).files?.[0])"
      />
    </v-card>

    <v-divider />

    <v-card-text v-if="isAdmin">
      <v-checkbox
        v-model="isSystem"
        label="Системный шаблон"
        hide-details
      />
    </v-card-text>

    <template v-if="file">
      <v-divider />

      <v-card-actions class="pa-4">
        <TemplatesFileCard
          :title="file.name"
          :subtitle="fileSize"
          action-icon="mdi-close"
          class="flex-grow-1"
          @action="file = null"
        />

        <v-btn
          color="primary"
          variant="outlined"
          @click="submit"
        >
          Загрузить
        </v-btn>
      </v-card-actions>
    </template>
  </v-card>
</template>
