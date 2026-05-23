<script setup lang="ts">
type Props = {
  modelValue: string
  errorMessages?: string | string[]
  label: string
  placeholder?: string
  type?: string
  prependInnerIcon?: string
  maxlength?: number
}

const props = withDefaults(defineProps<Props>(), {
  errorMessages: '',
  placeholder: '',
  type: 'text',
  prependInnerIcon: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'enter': []
  'arrow-left': []
  'arrow-right': []
  'arrow-up': []
  'arrow-down': []
}>()

const textField = ref()

const limitError = computed(() =>
  props.maxlength && props.modelValue.length >= props.maxlength
    ? `Нельзя ввести больше ${props.maxlength} символов`
    : ''
)

const displayErrors = computed(() => limitError.value || props.errorMessages)

function getInputEl(): HTMLInputElement | null {
  return textField.value?.$el?.querySelector('input') ?? null
}

function applyMaxlength() {
  const input = getInputEl()
  if (input && props.maxlength) {
    input.maxLength = props.maxlength
  }
}

onMounted(applyMaxlength)

watch(() => props.maxlength, applyMaxlength)

function handleInput(val: string) {
  if (props.maxlength && val.length > props.maxlength) {
    emit('update:modelValue', val.slice(0, props.maxlength))
  } else {
    emit('update:modelValue', val)
  }
}

function handleArrowLeft(event: KeyboardEvent) {
  const input = getInputEl()
  if (!input) {
    return
  }
  if (input.selectionStart === 0 && input.selectionEnd === 0) {
    event.preventDefault()
    emit('arrow-left')
  }
}

function handleArrowRight(event: KeyboardEvent) {
  const input = getInputEl()
  if (!input) {
    return
  }
  const len = input.value.length
  if (input.selectionStart === len && input.selectionEnd === len) {
    event.preventDefault()
    emit('arrow-right')
  }
}

defineExpose({
  focus: () => textField.value?.focus(),
  focusEnd: () => {
    const input = getInputEl()
    input?.focus()
    if (input) {
      input.setSelectionRange(input.value.length, input.value.length)
    }
  },
  getInput: (): HTMLInputElement | null => getInputEl()
})
</script>

<template>
  <v-text-field
    ref="textField"
    :model-value="modelValue"
    :error-messages="displayErrors"
    :label="label"
    :placeholder="placeholder"
    :type="type"
    :prepend-inner-icon="prependInnerIcon"
    variant="outlined"
    class="mb-2"
    @update:model-value="handleInput"
    @keydown.enter.prevent="emit('enter')"
    @keydown.left="handleArrowLeft"
    @keydown.right="handleArrowRight"
    @keydown.up.prevent="emit('arrow-up')"
    @keydown.down.prevent="emit('arrow-down')"
    autofocus
  >
    <template v-if="$slots['append-inner']" #append-inner>
      <slot name="append-inner" />
    </template>
  </v-text-field>
</template>
