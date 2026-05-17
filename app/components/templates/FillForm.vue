<script setup lang="ts">
import { useVariablesTemplate } from '~/composables/Templates/useVariablesTemplate'

type Props = {
  templateId: string
}

const props = defineProps<Props>()

const { state, getVariables } = useVariablesTemplate()

const values = ref<Record<string, string>>({})

onMounted(async () => {
  await getVariables(props.templateId)

  for (const [category, vars] of Object.entries(state.value.data)) {
    for (const variable of vars) {
      values.value[`${category}.${variable}`] = ''
    }
  }
})
</script>

<template>
  <v-row>
    <v-col v-if="state.loading" cols="12" class="d-flex justify-center">
      <v-progress-circular indeterminate />
    </v-col>

    <template v-else>
      <template v-for="(vars, category, index) in state.data" :key="category">
        <v-col cols="12" class="pb-0 pt-0" :class="{ 'mt-n4': index > 0 }">
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
    </template>
  </v-row>
</template>
