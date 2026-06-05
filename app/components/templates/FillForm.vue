<script setup lang="ts">
import { toast } from 'vue3-toastify'
import { useVariablesTemplate } from '~/composables/Templates/useVariablesTemplate'
import { useTemplateNames } from '~/composables/Templates/useTemplateNames'
import { useDocumentCreate } from '~/composables/Documents/useDocumentCreate'
import { useDocumentUpdate } from '~/composables/Documents/useDocumentUpdate'
import { useFieldNavigation } from '~/composables/Templates/useFieldNavigation'
import { useFormulaEval } from '~/composables/Templates/useFormulaEval'
import type { VariablesState } from '~/types/state/template.interface'
import type { ImageValue } from '~/types/image.interface'
import { isImageValue } from '~/types/image.interface'
import {
  TABLE_ROWS_LIMIT,
  TABLE_COUNT_LIMIT,
  TOTAL_VALUES_MAX_LENGTH,
  VALUE_STRING_MAX_LENGTH,
  DOCUMENT_NAME_MAX_LENGTH,
} from '~/constants/app.constants'

type Props = {
  templateId?: string
  file?: File
  externalData?: VariablesState['data']
  externalValues?: Record<string, string>
  externalLoopValues?: Record<string, Record<string, string>[]>
  externalDocName?: string
}

const props = defineProps<Props>()

const { isAdmin } = useRole()
const { documentNameRule } = useValidationRules()
const { state, getVariables } = useVariablesTemplate()
const { patterns: savedPatterns, load: loadPatterns, remove: removePattern } = useTemplateNames()
const { loading: creating, create } = useDocumentCreate()
const { loading: updating, update } = useDocumentUpdate()

const generating = computed(() => creating.value || updating.value)

const currentImageBytes = computed(() => {
  let total = 0
  for (const val of Object.values(values.value)) {
    if (isImageValue(val)) total += val.source.length * 0.75
  }
  for (const rows of Object.values(loopValues.value)) {
    for (const row of rows) {
      for (const val of Object.values(row)) {
        if (isImageValue(val)) total += val.source.length * 0.75
      }
    }
  }
  return total
})

const values = ref<Record<string, string | ImageValue>>({})
const loopValues = ref<Record<string, Record<string, string | ImageValue>[]>>({})
const imageNames = ref<Record<string, string>>({})
const namePattern = ref(props.externalDocName ?? '')
const namePatternCombobox = ref()

const simpleCategories = computed(() =>
  Object.fromEntries(
    Object.entries(state.value.data)
      .filter(([cat]) => !cat.endsWith('[]'))
      .sort(([a], [b]) => a.localeCompare(b, 'ru'))
      .map(([cat, vars]) => [cat, [...vars].sort((a, b) => a.localeCompare(b, 'ru'))])
  )
)

const loopCategories = computed(() =>
  Object.fromEntries(
    Object.entries(state.value.data).filter(([cat]) => cat.endsWith('[]'))
  )
)

const simpleTextFields = computed(() => {
  const result: Array<{ key: string; label: string; value: string }> = []
  for (const [cat, vars] of Object.entries(simpleCategories.value)) {
    for (const variable of vars) {
      const key = `${cat}.${variable}`
      const val = values.value[key]
      if (typeof val === 'string') {
        result.push({ key, label: variable, value: val })
      }
    }
  }
  return result
})

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

  if (props.templateId) {
    await loadPatterns(props.templateId)
  }

})

watch(() => props.externalDocName, (val) => {
  if (val !== undefined) namePattern.value = val
})

watch(namePattern, (val) => {
  if (val && val.length > DOCUMENT_NAME_MAX_LENGTH)
    namePattern.value = val.slice(0, DOCUMENT_NAME_MAX_LENGTH)
})

const namePreview = computed(() => {
  const pattern = namePattern.value?.trim()
  if (!pattern || !/\{[^}]+\}/.test(pattern)) return ''
  return resolvePattern(pattern, buildFlatValues())
})

watch(namePatternCombobox, (combobox) => {
  if (!combobox) return
  nextTick(() => {
    const input = combobox.$el?.querySelector('input')
    if (input) input.maxLength = DOCUMENT_NAME_MAX_LENGTH
  })
})

function addRow(category: string) {
  if (!isAdmin.value && (loopValues.value[category] ?? []).length >= TABLE_ROWS_LIMIT) {
    toast.error(`Максимум ${TABLE_ROWS_LIMIT} строк в таблице`)
    return
  }
  const vars = state.value.data[category] ?? []
  loopValues.value[category]!.push(Object.fromEntries(vars.map(v => [v, ''])))
}

function removeRow(category: string, index: number) {
  loopValues.value[category]!.splice(index, 1)
}

function getImageSrc(val: string | ImageValue | undefined): string {
  if (!isImageValue(val)) return ''
  return `data:${val.format};base64,${val.source}`
}

function clearImageValue(key: string) {
  values.value[key] = ''
  delete imageNames.value[key]
}

function createImageRef(el: any) {
  return {
    focus: () => {},
    focusEnd: () => {},
    getInput: (): HTMLElement | null => el?.$el ?? null,
  }
}

function clearLoopImageValue(category: string, rowIndex: number, variable: string) {
  loopValues.value[category]![rowIndex]![variable] = ''
  delete imageNames.value[`${category}.${rowIndex}.${variable}`]
}

function buildValues(): Record<string, any> {
  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(values.value)) {
    const resolved = typeof value === 'string' ? resolveFormula(value) : value
    result[key.startsWith('Разное.') ? key.slice(7) : key] = resolved
  }

  for (const [category, rows] of Object.entries(loopValues.value)) {
    result[category] = rows.map(row =>
      Object.fromEntries(
        Object.entries(row).map(([k, v]) => [
          k,
          typeof v === 'string' ? resolveFormula(v) : v,
        ])
      )
    )
  }

  return result
}

function buildRawValues(): Record<string, any> | undefined {
  const result: Record<string, any> = {}
  let hasFormulas = false

  for (const [key, value] of Object.entries(values.value)) {
    if (typeof value === 'string' && isFormula(value)) {
      result[key.startsWith('Разное.') ? key.slice(7) : key] = value
      hasFormulas = true
    }
  }

  for (const [category, rows] of Object.entries(loopValues.value)) {
    const rawRows: Record<string, string>[] = []
    let tableHasFormulas = false
    for (const row of rows) {
      const rawRow: Record<string, string> = {}
      for (const [k, v] of Object.entries(row)) {
        if (typeof v === 'string' && isFormula(v)) {
          rawRow[k] = v
          tableHasFormulas = true
          hasFormulas = true
        }
      }
      rawRows.push(rawRow)
    }
    if (tableHasFormulas) result[category] = rawRows
  }

  return hasFormulas ? result : undefined
}

function buildFlatValues(): Record<string, string> {
  const flat: Record<string, string> = {}
  for (const [key, value] of Object.entries(values.value)) {
    if (typeof value === 'string') {
      const flatKey = key.startsWith('Разное.') ? key.slice(7) : key
      flat[flatKey] = isFormula(value) ? resolveFormula(value) : value
    }
  }
  return flat
}

function resolvePattern(pattern: string, flat: Record<string, string>): string {
  return pattern.replace(/\{([^}]+)\}/g, (_, key) => flat[key] ?? `{${key}}`)
}

function validatePattern(pattern: string, flat: Record<string, string>): { unknown: string[], empty: string[] } {
  const unknown = new Set<string>()
  const empty = new Set<string>()
  pattern.replace(/\{([^}]+)\}/g, (_, key) => {
    if (!(key in flat)) unknown.add(key)
    else if (!flat[key]) empty.add(key)
    return ''
  })
  return { unknown: [...unknown], empty: [...empty] }
}

const activeFormat = ref<'docx' | 'pdf' | null>(null)

async function generate(format: 'docx' | 'pdf') {
  const pattern = namePattern.value.trim()

  const flat = buildFlatValues()

  if (pattern) {
    const { unknown, empty } = validatePattern(pattern, flat)
    if (unknown.length) {
      toast.error(`Этих полей нет в шаблоне: ${unknown.join(', ')}`)
      return
    }
    if (empty.length) {
      toast.error(`Заполните переменные, чтобы сохранить файл: ${empty.join(', ')}`)
      return
    }
  }

  const allImageSources: string[] = []

  for (const val of Object.values(values.value)) {
    if (isImageValue(val)) allImageSources.push(val.source)
  }

  for (const rows of Object.values(loopValues.value)) {
    for (const row of rows) {
      for (const val of Object.values(row)) {
        if (isImageValue(val)) allImageSources.push(val.source)
      }
    }
  }

  const totalApproxBytes = allImageSources.reduce((s, src) => s + src.length * 0.75, 0)

  if (!isAdmin.value && totalApproxBytes > 1024 * 1024) {
    toast.error('Суммарный размер изображений превышает 1 МБ')
    return
  }

  const resolvedName = pattern ? resolvePattern(pattern, flat).slice(0, DOCUMENT_NAME_MAX_LENGTH) : undefined
  const hasVariables = /\{[^}]+\}/.test(pattern)
  const patternToSend = pattern && hasVariables ? pattern : undefined

  if (!isAdmin.value) {
    if (Object.keys(loopValues.value).length > TABLE_COUNT_LIMIT) {
      toast.error(`Максимум ${TABLE_COUNT_LIMIT} таблиц`)
      return
    }

    for (const [cat, rows] of Object.entries(loopValues.value)) {
      if (rows.length > TABLE_ROWS_LIMIT) {
        toast.error(`Таблица "${cat.slice(0, -2)}": максимум ${TABLE_ROWS_LIMIT} строк`)
        return
      }
    }

    let totalChars = 0
    for (const val of Object.values(values.value)) {
      if (typeof val === 'string') totalChars += val.length
    }
    for (const rows of Object.values(loopValues.value)) {
      for (const row of rows) {
        for (const val of Object.values(row)) {
          if (typeof val === 'string') totalChars += val.length
        }
      }
    }
    if (totalChars > TOTAL_VALUES_MAX_LENGTH) {
      toast.error(`Слишком много данных для генерации документа. Пожалуйста, попробуйте уменьшить длину текстовых значений или количество изображений`)
      return
    }
  }

  activeFormat.value = format

  const rawValues = buildRawValues()

  if (props.file) {
    await update(props.file, buildValues(), rawValues, resolvedName, format)
  } else {
    const success = await create(props.templateId!, buildValues(), rawValues, resolvedName, format, patternToSend)
    if (success && props.templateId) {
      await loadPatterns(props.templateId)
    }
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

const { isFormula, evalFormula, resolveFormula } = useFormulaEval(loopValues, values)

function formulaHint(val: string | ImageValue | undefined): string | undefined {
  if (!isFormula(val)) return undefined
  const { value, error } = evalFormula(val)
  return error ? `Ошибка: ${error}` : `Значение: ${value}`
}
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
          <template v-if="isImageValue(values[`${String(category)}.${variable}`])">
            <v-card
              :ref="(el) => { const k = `${String(category)}.${variable}`; if (el) simpleFieldRefs.set(k, createImageRef(el)); else simpleFieldRefs.delete(k) }"
              variant="outlined"
              class="pa-2"
            >
              <div class="text-caption text-medium-emphasis mb-1">{{ variable }}</div>
              <div class="d-flex align-center gap-2">
                <v-img
                  :src="getImageSrc(values[`${String(category)}.${variable}`])"
                  width="40"
                  height="40"
                  cover
                  draggable="false"
                  class="rounded flex-grow-0"
                />
                <span class="text-body-2 flex-grow-1 text-truncate">
                  {{ imageNames[`${String(category)}.${variable}`] }}
                </span>
                <v-btn
                  icon="mdi-close"
                  size="x-small"
                  variant="text"
                  @click="clearImageValue(`${String(category)}.${variable}`)"
                />
              </div>
            </v-card>
          </template>
          <template v-else>
            <UiTextField
              :ref="(el) => { const k = `${String(category)}.${variable}`; if (el) simpleFieldRefs.set(k, el as any); else simpleFieldRefs.delete(k) }"
              :model-value="(values[`${category}.${variable}`] as string) ?? ''"
              :label="variable"
              :autofocus="false"
              :maxlength="isAdmin ? undefined : VALUE_STRING_MAX_LENGTH"
              :hint="formulaHint(values[`${String(category)}.${variable}`])"
              @update:model-value="values[`${category}.${variable}`] = $event"
              @enter="onSimpleEnter(String(category), variable)"
              @arrow-left="onArrowLeft(`${String(category)}.${variable}`)"
              @arrow-right="onArrowRight(`${String(category)}.${variable}`)"
              @arrow-up="onSimpleArrowUp(String(category), variable)"
              @arrow-down="onSimpleArrowDown(String(category), variable)"
            >
              <template #append-inner>
                <TemplatesFieldActionMenu
                  :model-value="(values[`${category}.${variable}`] as string) ?? ''"
                  :current-image-bytes="currentImageBytes"
                  :field-key="`${String(category)}.${variable}`"
                  :source-fields="simpleTextFields.filter(f => f.key !== `${String(category)}.${variable}`)"
                  @update:model-value="values[`${category}.${variable}`] = $event"
                  @set-image-name="imageNames[`${String(category)}.${variable}`] = $event"
                />
              </template>
            </UiTextField>
          </template>
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
                  <template v-if="isImageValue(row[variable])">
                    <v-card
                      :ref="(el) => { const k = `${String(category)}.${rowIndex}.${variable}`; if (el) loopFieldRefs.set(k, createImageRef(el)); else loopFieldRefs.delete(k) }"
                      variant="outlined"
                      class="pa-2"
                    >
                      <div class="text-caption text-medium-emphasis mb-1">{{ variable }}</div>
                      <div class="d-flex align-center gap-2">
                        <v-img
                          :src="getImageSrc(row[variable])"
                          width="40"
                          height="40"
                          cover
                          class="rounded flex-grow-0"
                        />
                        <span class="text-body-2 flex-grow-1 text-truncate">
                          {{ imageNames[`${String(category)}.${rowIndex}.${variable}`] }}
                        </span>
                        <v-btn
                          icon="mdi-close"
                          size="x-small"
                          variant="text"
                          @click="clearLoopImageValue(String(category), rowIndex, variable)"
                        />
                      </div>
                    </v-card>
                  </template>
                  <template v-else>
                    <UiTextField
                      :ref="(el) => { const k = `${String(category)}.${rowIndex}.${variable}`; if (el) loopFieldRefs.set(k, el as any); else loopFieldRefs.delete(k) }"
                      :model-value="(row[variable] as string) ?? ''"
                      :label="variable"
                      :autofocus="false"
                      :maxlength="isAdmin ? undefined : VALUE_STRING_MAX_LENGTH"
                      :hint="formulaHint(row[variable])"
                      @update:model-value="row[variable] = $event"
                      @enter="onLoopEnter(String(category), rowIndex, variable)"
                      @arrow-left="onArrowLeft(`${String(category)}.${rowIndex}.${variable}`)"
                      @arrow-right="onArrowRight(`${String(category)}.${rowIndex}.${variable}`)"
                      @arrow-up="onLoopArrowUp(String(category), rowIndex, variable)"
                      @arrow-down="onLoopArrowDown(String(category), rowIndex, variable)"
                    >
                      <template #append-inner>
                        <TemplatesFieldActionMenu
                          :model-value="(row[variable] as string) ?? ''"
                          :current-image-bytes="currentImageBytes"
                          :field-key="`${String(category)}.${rowIndex}.${variable}`"
                          :source-fields="simpleTextFields"
                          @update:model-value="row[variable] = $event"
                          @set-image-name="imageNames[`${String(category)}.${rowIndex}.${variable}`] = $event"
                        />
                      </template>
                    </UiTextField>
                  </template>
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
          <span class="text-medium-emphasis mt-1 py-2">
              Вы можете использовать поля шаблона для названия документа, например {ФИО}
            </span>
          <v-col cols="12">
            <v-combobox
              ref="namePatternCombobox"
              v-model="namePattern"
              :items="savedPatterns"
              :rules="[documentNameRule]"
              :hint="namePreview ? `Значение: ${namePreview}` : ''"
              persistent-hint
              label="Название документа"
              variant="outlined"
              clearable
            >
              <template #item="{ item, props: itemProps }">
                <v-list-item v-bind="itemProps" :title="item.raw">
                  <template #append>
                    <v-btn
                      icon="mdi-close"
                      size="x-small"
                      variant="text"
                      @click.stop="removePattern(templateId!, item.raw)"
                    />
                  </template>
                </v-list-item>
              </template>
            </v-combobox>
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
                variant="elevated"
                class="ml-2"
                :loading="generating && activeFormat === 'pdf'"
                color="primary"
                :disabled="generating"
                @click="generate('pdf')"
              >
                Скачать PDF
              </v-btn>
            </div>
            <span class="text-medium-emphasis mt-1 py-2">
              Формат DOCX (word) позволяет изменять документ в дальнейшем<br>Вы можете скачать PDF, но его нельзя будет отредактировать
            </span>
          </v-col>
        </v-row>
      </v-col>
    </template>
  </v-row>
</template>
