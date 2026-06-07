<script setup lang="ts">
import Typed from 'typed.js'
import { onMounted, onBeforeUnmount, ref } from 'vue'

const props = defineProps<{
  strings: string[]
  tag?: string
  typeSpeed?: number
  backSpeed?: number
  loop?: boolean
}>()

const emit = defineEmits<{ complete: [] }>()

const el = ref<HTMLElement | null>(null)
const container = ref<HTMLElement | null>(null)
let typed: Typed | null = null
let observer: IntersectionObserver | null = null

const DEFAULT_DURATION_MS = 750

function startTyped() {
  const totalChars = props.strings.join('').length
  const typeSpeed = props.typeSpeed ?? Math.round(DEFAULT_DURATION_MS / totalChars)

  typed = new Typed(el.value!, {
    strings: props.strings,
    typeSpeed,
    backSpeed: props.backSpeed ?? 30,
    loop: props.loop ?? true,
    onComplete(self) {
      self.cursor.remove()
      emit('complete')
    },
  })
}

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      observer!.disconnect()
      startTyped()
    }
  }, { threshold: 0.1 })

  observer.observe(container.value!)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  typed?.destroy()
})
</script>

<template>
  <component :is="tag ?? 'span'" ref="container">
    <span ref="el"></span>
  </component>
</template>
