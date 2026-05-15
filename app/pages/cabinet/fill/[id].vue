<script setup lang="ts">
import TemplatesApi from '~/api/TemplatesApi'
import type { ITemplate } from '~/types/template.interface'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const templateId = route.params.id as string

const template = ref<ITemplate | null>(null)

onMounted(async () => {
  try {
    template.value = await TemplatesApi.getOne(templateId)
  } catch {
    await navigateTo('/cabinet')
  }
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Заполнение полей {{ template?.name }}</h1>
      </v-col>
    </v-row>
  </v-container>
</template>
