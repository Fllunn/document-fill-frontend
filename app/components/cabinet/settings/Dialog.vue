<script setup lang="ts">
type Props = {
  modelValue: boolean
  title: string
  description?: string
  submitText?: string
  loading?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  description: '',
  submitText: 'Сохранить',
  loading: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: []
}>()

function close(): void {
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    width="clamp(320px, 90vw, 512px)"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-form @submit.prevent="emit('submit')">
      <v-card>
        <v-card-title class="pa-4">
          <v-row no-gutters align="center">
            <v-col cols="2" />

            <v-col cols="8" class="text-center text-wrap">
              {{ title }}
            </v-col>

            <v-col cols="2" class="d-flex justify-end">
              <v-btn
                icon="mdi-close"
                variant="text"
                size="small"
                type="button"
                @click="close"
              />
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-subtitle
          v-if="description"
          class="text-center text-wrap"
        >
          {{ description }}
        </v-card-subtitle>

        <v-card-text class="pb-0 text-center">
          <slot />
        </v-card-text>

        <v-card-actions
          class="justify-center mb-2"
        >
          <v-btn
            variant="text"
            type="button"
            @click="close"
          >
            Отмена
          </v-btn>

          <v-btn
            color="primary"
            type="submit"
            :loading="loading"
            :disabled="disabled"
          >
            {{ submitText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
