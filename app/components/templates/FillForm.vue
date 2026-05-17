<script setup lang="ts">
import { useVariablesTemplate } from '~/composables/Templates/useVariablesTemplate'
import { useDocumentCreate } from '~/composables/Documents/useDocumentCreate'

type Props = {
  templateId: string
}

const props = defineProps<Props>()

const { state, getVariables } = useVariablesTemplate()
const { loading: generating, create } = useDocumentCreate()

const values = ref<Record<string, string>>({})
const loopValues = ref<Record<string, Record<string, string>[]>>({})
const docName = ref('')

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
  await getVariables(props.templateId)

  for (const [category, vars] of Object.entries(state.value.data)) {
    if (category.endsWith('[]')) {
      loopValues.value[category] = [Object.fromEntries(vars.map(v => [v, '']))]
    } else {
      for (const variable of vars) {
        values.value[`${category}.${variable}`] = ''
      }
    }
  }
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

function generate() {
  create(props.templateId, buildValues(), docName.value || undefined)
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
          <UiTextField
            :model-value="values[`${category}.${variable}`] ?? ''"
            :label="variable"
            @update:model-value="values[`${category}.${variable}`] = $event"
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
                    :model-value="row[variable] ?? ''"
                    :label="variable"
                    @update:model-value="row[variable] = $event"
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
          <v-col cols="12" sm="7">
            <UiTextField v-model="docName" label="Название документа" hide-details />
          </v-col>
          <v-col cols="12" sm="5" class="d-flex align-center">
            <v-btn color="primary" :loading="generating" block @click="generate">
              Создать документ
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </template>
  </v-row>
</template>
