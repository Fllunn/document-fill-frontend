<script setup lang="ts">
type Props = {
  modelValue: string
  errorMessages?: string | string[]
  label: string
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  errorMessages: '',
  placeholder: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isShowPassword = ref(false)
</script>

<template>
  <v-text-field
    :model-value="modelValue"
    :error-messages="errorMessages"
    :append-inner-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
    :type="isShowPassword ? 'text' : 'password'"
    :label="label"
    :placeholder="placeholder"
    variant="outlined"
    class="mb-2"
    prepend-inner-icon="mdi-lock-outline"
    @update:model-value="emit('update:modelValue', $event)"
    @click:append-inner="isShowPassword = !isShowPassword"
  />
</template>
