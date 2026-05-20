<script setup lang="ts">
import { toast } from 'vue3-toastify'
import { useDocumentExtract } from '~/composables/Documents/useDocumentExtract'

definePageMeta({ middleware: 'auth' })

const { loading: extracting, extract, variables, initialValues, initialLoopValues, docName } = useDocumentExtract()
const { isAdmin } = useRole()

const MAX_SIZE = 1 * 1024 * 1024

const file = ref<File | null>(null)
const extracted = ref(false)
const isDragging = ref(false)
const fillFormSection = ref<HTMLElement | null>(null)

const { fileSize } = useFileSize(file)

function setFile(picked: File | undefined) {
  if (!picked?.name.endsWith('.docx'))
    return toast('Разрешены только файлы .docx', { type: 'error' })

  if (!isAdmin.value && picked.size > MAX_SIZE)
    return toast(`Размер файла не должен превышать ${MAX_SIZE / (1024 * 1024)} МБ`, { type: 'error' })

  file.value = picked
  extracted.value = false
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  setFile(e.dataTransfer?.files[0])
}

async function submit() {
  if (!file.value) return
  const success = await extract(file.value)
  if (success) {
    extracted.value = true
    await nextTick()
    await nextTick()
    const sectionEl = (fillFormSection.value as any)?.$el as HTMLElement | undefined
    const firstTitle = sectionEl?.querySelector<HTMLElement>('.v-card-title')
    if (firstTitle) {
      const top = firstTitle.getBoundingClientRect().top + window.scrollY - 64
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }
}

</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Заполнение документа</h1>
      </v-col>

      <v-col cols="12">
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
              <v-icon size="48">mdi-file-document-outline</v-icon>

              <v-card-title class="text-wrap">
                Нажмите сюда или перетащите файл, чтобы загрузить документ.
              </v-card-title>

              <v-card-subtitle class="text-wrap">
                Поддерживаемый формат: docx
                <br>
                Вы можете загрузить только тот документ, который вы ранее создали с помощью сервиса
              </v-card-subtitle>
            </v-card-text>

            <input
              type="file"
              accept=".docx"
              class="d-none"
              @change="setFile(($event.target as HTMLInputElement).files?.[0])"
            />
          </v-card>

          <template v-if="file">
            <v-divider />

            <v-card-actions class="pa-4">
              <TemplatesFileCard
                :title="file.name"
                :subtitle="fileSize"
                class="flex-grow-1"
              />

              <v-btn
                color="primary"
                variant="outlined"
                :loading="extracting"
                @click="submit"
              >
                Читать поля
              </v-btn>
            </v-card-actions>
          </template>
        </v-card>
      </v-col>

      <v-col v-if="extracted && file" ref="fillFormSection" cols="12">
        <TemplatesFillForm
          :file="file"
          :external-data="variables"
          :external-values="initialValues"
          :external-loop-values="initialLoopValues"
          :external-doc-name="docName"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
