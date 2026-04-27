<script setup lang="ts">
type Props = {
  modelValue: string
  errorMessages?: string | string[]
  label: string
  placeholder?: string
  type?: string
  prependInnerIcon?: string
}

withDefaults(defineProps<Props>(), {
  errorMessages: '',
  placeholder: '',
  type: 'text',
  prependInnerIcon: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <v-text-field
    :model-value="modelValue"
    :error-messages="errorMessages"
    :label="label"
    :placeholder="placeholder"
    :type="type"
    :prepend-inner-icon="prependInnerIcon"
    variant="outlined"
    class="mb-2"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
