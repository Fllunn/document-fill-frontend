<script setup lang="ts">
import { toast } from 'vue3-toastify'
import { useFieldActions } from '~/composables/Templates/useFieldActions'
import type { ImageValue } from '~/types/image.interface'
import { IMAGE_SINGLE_MAX_BYTES, IMAGE_TOTAL_MAX_BYTES } from '~/constants/app.constants'

type SourceField = {
  key: string
  label: string
  value: string
}

type Props = {
  modelValue: string | ImageValue
  currentImageBytes?: number
  fieldKey?: string
  sourceFields?: SourceField[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string | ImageValue]
  'set-image-name': [name: string]
}>()

const { declenseFio, numberToWords, insertDate } = useFieldActions()
const { isAdmin } = useRole()

const menu = ref(false)

function commonPrefixLen(a: string, b: string): number {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  return i
}

const currentLabel = computed(() => props.fieldKey?.split('.').at(-1) ?? '')

const sortedSourceFields = computed(() => {
  if (!props.sourceFields?.length) return []
  return [...props.sourceFields].sort((a, b) => {
    const da = commonPrefixLen(currentLabel.value, a.label)
    const db = commonPrefixLen(currentLabel.value, b.label)
    if (db !== da) return db - da
    return a.label.localeCompare(b.label, 'ru')
  })
})

function copyFromField(field: SourceField) {
  emit('update:modelValue', field.value)
  menu.value = false
}

function apply(result: string | false, errorMessage: string) {
  if (result === false) {
    toast(errorMessage, { type: 'error' })
    return
  }
  emit('update:modelValue', result)
  menu.value = false
  toast('Применено', { type: 'success' })
}

const fioItems = [
  { label: 'Родительный (кого?)', case: 'genitive' },
  { label: 'Дательный (кому?)', case: 'dative' },
  { label: 'Винительный (кого?)', case: 'accusative' },
  { label: 'Творительный (кем?)', case: 'instrumental' },
  { label: 'Предложный (о ком?)', case: 'prepositional' },
] as const

const dateItems = [
  { label: 'Сегодня (ДД.ММ.ГГГГ)', format: 'full' },
  { label: 'Сегодня, день', format: 'day' },
  { label: 'Сегодня, месяц', format: 'month' },
  { label: 'Сегодня, год', format: 'year' },
] as const

const ALLOWED_FORMATS = computed(() =>
  isAdmin.value
    ? ['image/png', 'image/jpeg', 'image/svg+xml']
    : ['image/png', 'image/jpeg']
)

const acceptAttr = computed(() =>
  isAdmin.value
    ? 'image/png,image/jpeg,image/jpg,image/svg+xml'
    : 'image/png,image/jpeg,image/jpg'
)

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result as string
      resolve(result.substring(result.indexOf(',') + 1))
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function getDimensions(source: string, format: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image()

    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })

    img.onerror = () => resolve({ width: 0, height: 0 })
    
    img.src = `data:${format};base64,${source}`
  })
}

async function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  const format = file.type === 'image/jpg' ? 'image/jpeg' : file.type

  if (!ALLOWED_FORMATS.value.includes(format)) {
    toast.error(
      isAdmin.value
        ? 'Недопустимый формат. Разрешены: PNG, JPEG, SVG'
        : 'Недопустимый формат. Разрешены: PNG, JPG'
    )
    return
  }

  if (file.size > IMAGE_SINGLE_MAX_BYTES) {
    toast.error(`Размер изображения превышает ${IMAGE_SINGLE_MAX_BYTES / 1024} КБ`)
    return
  }

  const existingBytes = props.currentImageBytes ?? 0
  if (existingBytes + file.size > IMAGE_TOTAL_MAX_BYTES) {
    toast.error(`Суммарный размер всех изображений должен быть меньше ${IMAGE_TOTAL_MAX_BYTES / (1024 * 1024)} МБ`)
    return
  }

  const source = await toBase64(file)
  const { width, height } = await getDimensions(source, format)

  emit('update:modelValue', { _type: 'image', source, format, width, height })
  emit('set-image-name', file.name)
  menu.value = false
}
</script>

<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="end">
    <template #activator="{ props: menuProps }">
      <v-icon
        v-bind="menuProps"
        icon="mdi-menu"
        size="18"
        class="cursor-pointer text-medium-emphasis"
      />
    </template>

    <v-list density="compact" min-width="220">
      <v-list-group value="fio">
        <template #activator="{ props: groupProps }">
          <v-list-item v-bind="groupProps" prepend-icon="mdi-account-edit" title="Склонить ФИО" />
        </template>

        <v-list-item
          v-for="item in fioItems"
          :key="item.case"
          :title="item.label"
          class="pl-8"
          @click="apply(declenseFio(props.modelValue as string, item.case), 'Введите ФИО')"
        />
      </v-list-group>

      <v-list-item
        prepend-icon="mdi-numeric"
        title="Число прописью"
        @click="apply(numberToWords(props.modelValue as string), 'Введите число')"
      />

      <v-list-group value="date">
        <template #activator="{ props: groupProps }">
          <v-list-item v-bind="groupProps" prepend-icon="mdi-calendar" title="Вставить дату" />
        </template>

        <v-list-item
          v-for="item in dateItems"
          :key="item.format"
          :title="item.label"
          class="pl-8"
          @click="apply(insertDate(item.format), '')"
        />
      </v-list-group>

      <v-list-item prepend-icon="mdi-image" style="position: relative; overflow: hidden;">
        <template #title>Вставить фото</template>
        <input
          type="file"
          :accept="acceptAttr"
          style="position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;"
          @change="handleFileSelect"
        />
      </v-list-item>

      <template v-if="sortedSourceFields.length">
        <v-divider />
        <v-list-group value="copy-from">
          <template #activator="{ props: groupProps }">
            <v-list-item v-bind="groupProps" prepend-icon="mdi-content-copy" title="Скопировать из поля" />
          </template>

          <div style="max-height: 200px; overflow-y: auto;">
            <v-list-item
              v-for="field in sortedSourceFields"
              :key="field.key"
              :title="field.label"
              :subtitle="field.value || '—'"
              class="pl-8"
              @click="copyFromField(field)"
            />
          </div>
        </v-list-group>
      </template>
    </v-list>
  </v-menu>
</template>
