<script setup lang="ts">
import { useVariablesTemplate } from '~/composables/Templates/useVariablesTemplate'
import { useDocumentCreate } from '~/composables/Documents/useDocumentCreate'
import { useDocumentUpdate } from '~/composables/Documents/useDocumentUpdate'
import { useFieldNavigation } from '~/composables/Templates/useFieldNavigation'
import type { VariablesState } from '~/types/state/template.interface'

type Props = {
  templateId?: string
  file?: File
  externalData?: VariablesState['data']
  externalValues?: Record<string, string>
  externalLoopValues?: Record<string, Record<string, string>[]>
  externalDocName?: string
}

const props = defineProps<Props>()

const { state, getVariables } = useVariablesTemplate()
const { loading: creating, create } = useDocumentCreate()
const { loading: updating, update } = useDocumentUpdate()

const generating = computed(() => creating.value || updating.value)

const values = ref<Record<string, string>>({})
const loopValues = ref<Record<string, Record<string, string>[]>>({})
const docName = ref(props.externalDocName ?? '')

const simpleCategories = computed(() =>
  Object.fromEntries(
    Object.entries(state.value.data).filter(([cat]) => !cat.endsWith('[]'))
  )
)

const loopCategories = computed(() =>
  Object.fromEntries(
    Object.entries(state.value.data).filter(([cat]) => cat.endsWith('[]'))
  )
)

onMounted(async () => {
  if (props.externalData) {
    state.value.data = props.externalData
    values.value = props.externalValues ? { ...props.externalValues } : {}
    loopValues.value = props.externalLoopValues ? { ...props.externalLoopValues } : {}

    if (!props.externalValues) {
      for (const [category, vars] of Object.entries(state.value.data)) {
        if (!category.endsWith('[]')) {
          for (const variable of vars) {
            values.value[`${category}.${variable}`] = ''
          }
        }
      }
    }

    if (!props.externalLoopValues) {
      for (const [category, vars] of Object.entries(state.value.data)) {
        if (category.endsWith('[]')) {
          loopValues.value[category] = [Object.fromEntries(vars.map(v => [v, '']))]
        }
      }
    }
  } else {
    await getVariables(props.templateId!)

    for (const [category, vars] of Object.entries(state.value.data)) {
      if (category.endsWith('[]')) {
        loopValues.value[category] = [Object.fromEntries(vars.map(v => [v, '']))]
      } else {
        for (const variable of vars) {
          values.value[`${category}.${variable}`] = ''
        }
      }
    }
  }
})

watch(() => props.externalDocName, (val) => {
  if (val !== undefined) docName.value = val
})

function addRow(category: string) {
  const vars = state.value.data[category] ?? []
  loopValues.value[category]!.push(Object.fromEntries(vars.map(v => [v, ''])))
}

function removeRow(category: string, index: number) {
  loopValues.value[category]!.splice(index, 1)
}

function buildValues(): Record<string, any> {
  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(values.value)) {
    result[key.startsWith('Разное.') ? key.slice(7) : key] = value
  }

  for (const [category, rows] of Object.entries(loopValues.value)) {
    result[category.slice(0, -2)] = rows
  }

  return result
}

const activeFormat = ref<'docx' | 'pdf' | null>(null)

async function generate(format: 'docx' | 'pdf') {
  activeFormat.value = format
  if (props.file) {
    await update(props.file, buildValues(), docName.value || undefined, format)
  } else {
    await create(props.templateId!, buildValues(), docName.value || undefined, format)
  }
  activeFormat.value = null
}

const {
  simpleFieldRefs,
  loopFieldRefs,
  onSimpleEnter,
  onLoopEnter,
  onArrowLeft,
  onArrowRight,
  onSimpleArrowUp,
  onSimpleArrowDown,
  onLoopArrowUp,
  onLoopArrowDown,
} = useFieldNavigation(simpleCategories, loopCategories, loopValues, addRow)
</script>

<template>
  <v-row>
    <v-col v-if="state.loading" cols="12" class="d-flex justify-center">
      <v-progress-circular indeterminate />
    </v-col>

    <template v-else>
      <template v-for="(vars, category, catIndex) in simpleCategories" :key="category">
        <v-col cols="12" class="pb-0" :class="{ 'pt-0 mt-n4': catIndex > 0 }">
          <v-card-title class="px-0 pb-3">{{ category }}</v-card-title>
        </v-col>

        <v-col v-for="variable in vars" :key="variable" cols="12" sm="6" md="4" class="pt-0 pb-1">
          <UiTextField
            :ref="(el) => { const k = `${String(category)}.${variable}`; if (el) simpleFieldRefs.set(k, el as any); else simpleFieldRefs.delete(k) }"
            :model-value="values[`${category}.${variable}`] ?? ''"
            :label="variable"
            :autofocus="false"
            @update:model-value="values[`${category}.${variable}`] = $event"
            @enter="onSimpleEnter(String(category), variable)"
            @arrow-left="onArrowLeft(`${String(category)}.${variable}`)"
            @arrow-right="onArrowRight(`${String(category)}.${variable}`)"
            @arrow-up="onSimpleArrowUp(String(category), variable)"
            @arrow-down="onSimpleArrowDown(String(category), variable)"
          >
            <template #append-inner>
              <TemplatesFieldActionMenu
                :model-value="values[`${category}.${variable}`] ?? ''"
                @update:model-value="values[`${category}.${variable}`] = $event"
              />
            </template>
          </UiTextField>
        </v-col>
      </template>

      <template v-for="(vars, category) in loopCategories" :key="category">
        <v-col cols="12" class="pb-0">
          <v-card-title class="px-0 pb-3">{{ String(category).slice(0, -2) }}</v-card-title>
        </v-col>

        <v-col cols="12" class="pt-0 pb-1">
          <v-card variant="outlined" class="pa-3">
            <div
              v-for="(row, rowIndex) in loopValues[String(category)] ?? []"
              :key="rowIndex"
            >
              <v-row align="center">
                <v-col cols="auto">
                  <span class="px-2 text-medium-emphasis">Строка {{ rowIndex + 1 }}</span>
                </v-col>
                <v-spacer />
                <v-col cols="auto">
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="error"
                    size="small"
                    :disabled="(loopValues[String(category)] ?? []).length === 1"
                    @click="removeRow(String(category), rowIndex)"
                  />
                </v-col>
              </v-row>

              <v-row dense>
                <v-col
                  v-for="variable in vars"
                  :key="variable"
                  cols="12"
                  sm="6"
                  md="4"
                  class="pb-1"
                >
                  <UiTextField
                    :ref="(el) => { const k = `${String(category)}.${rowIndex}.${variable}`; if (el) loopFieldRefs.set(k, el as any); else loopFieldRefs.delete(k) }"
                    :model-value="row[variable] ?? ''"
                    :label="variable"
                    :autofocus="false"
                    @update:model-value="row[variable] = $event"
                    @enter="onLoopEnter(String(category), rowIndex, variable)"
                    @arrow-left="onArrowLeft(`${String(category)}.${rowIndex}.${variable}`)"
                    @arrow-right="onArrowRight(`${String(category)}.${rowIndex}.${variable}`)"
                    @arrow-up="onLoopArrowUp(String(category), rowIndex, variable)"
                    @arrow-down="onLoopArrowDown(String(category), rowIndex, variable)"
                  >
                    <template #append-inner>
                      <TemplatesFieldActionMenu
                        :model-value="row[variable] ?? ''"
                        @update:model-value="row[variable] = $event"
                      />
                    </template>
                  </UiTextField>
                </v-col>
              </v-row>
            </div>

            <v-btn
              variant="text"
              color="primary"
              prepend-icon="mdi-plus"
              class="mt-2"
              @click="addRow(String(category))"
            >
              Добавить строку
            </v-btn>
          </v-card>
        </v-col>
      </template>

      <v-col cols="12" class="pt-4 d-flex justify-center">
        <v-row justify="center" align="center" style="max-width: 700px; width: 100%">
          <v-col cols="12">
            <UiTextField v-model="docName" label="Название документа" hide-details :autofocus="false" />
          </v-col>
          <v-col cols="12" class="d-flex flex-column align-center">
            <div class="d-flex align-center">
              <v-btn
                color="primary"
                variant="elevated"

                :loading="generating && activeFormat === 'docx'"
                :disabled="generating"
                @click="generate('docx')"
              >
                Скачать DOCX
              </v-btn>
              <v-btn
                icon
                variant="text"
                size="small"
                class="ml-1"
                :disabled="generating"
              >
                <v-icon>mdi-chevron-down</v-icon>
                <v-menu activator="parent" location="bottom end">
                  <v-list>
                    <v-list-item @click="generate('pdf')">
                      <v-list-item-title>Скачать PDF</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn>
            </div>
            <span class="text-medium-emphasis mt-1 py-2">
              Формат DOCX (word) позволяет изменять документ в дальнейшем<br>Вы также можете скачать PDF, но его нельзя будет отредактировать
            </span>
          </v-col>
        </v-row>
      </v-col>
    </template>
  </v-row>
</template>
