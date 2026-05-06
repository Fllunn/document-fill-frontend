<script setup lang="ts">
export type ButtonConfig = {
  icon: string
  color?: string
  confirmText?: string
  confirmLabel?: string
}

type Props = {
  title: string
  subtitle?: string
  prependIcon?: string
  actionButton?: ButtonConfig
  deleteButton?: ButtonConfig
}

const props = defineProps<Props>()
const emit = defineEmits<{ action: []; delete: [] }>()

const buttons = computed(() => [
  props.actionButton ? { config: props.actionButton, event: 'action' as const } : null,
  props.deleteButton ? { config: props.deleteButton, event: 'delete' as const } : null,
].filter((b): b is NonNullable<typeof b> => b !== null))

const menuOpen = ref<Record<string, boolean>>({ action: false, delete: false })

function handleEmit(event: 'action' | 'delete') {
  if (event === 'action') emit('action')
  else emit('delete')
}
</script>

<template>
  <v-card variant="outlined" rounded="lg">
    <v-list-item
      :prepend-icon="prependIcon ?? 'mdi-file-word-outline'"
      :title="title"
      :subtitle="subtitle"
      density="compact"
    >
      <template #append>
        <template v-for="btn in buttons" :key="btn.event">
          <v-menu v-if="btn.config.confirmText" v-model="menuOpen[btn.event]" :close-on-content-click="false">
            <template #activator="{ props: menuProps }">
              <v-btn v-bind="menuProps" :icon="btn.config.icon" :color="btn.config.color" variant="text" size="small" />
            </template>
            <v-card>
              <v-card-text class="pb-0">{{ btn.config.confirmText }}</v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn size="small" @click="menuOpen[btn.event] = false">Отмена</v-btn>
                <v-btn size="small" :color="btn.config.color" @click="handleEmit(btn.event); menuOpen[btn.event] = false">
                  {{ btn.config.confirmLabel ?? 'Подтвердить' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>

          <v-btn v-else :icon="btn.config.icon" :color="btn.config.color" variant="text" size="small" @click="handleEmit(btn.event)" />
        </template>
      </template>
    </v-list-item>
  </v-card>
</template>
