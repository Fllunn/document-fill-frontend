<script setup lang="ts">
export type ButtonConfig = {
  icon: string
  color?: string
  tooltip?: string
  confirmText?: string
  confirmLabel?: string
  loading?: boolean
}

type Props = {
  title: string
  subtitle?: string
  prependIcon?: string
  actionButton?: ButtonConfig
  fillButton?: ButtonConfig
  renameButton?: ButtonConfig
  deleteButton?: ButtonConfig
}

const props = defineProps<Props>()
const emit = defineEmits<{ action: []; fill: []; rename: []; delete: [] }>()

const buttons = computed(() => [
  props.fillButton ? { config: props.fillButton, event: 'fill' as const } : null,
  props.actionButton ? { config: props.actionButton, event: 'action' as const } : null,
  props.renameButton ? { config: props.renameButton, event: 'rename' as const } : null,
  props.deleteButton ? { config: props.deleteButton, event: 'delete' as const } : null,
].filter((b): b is NonNullable<typeof b> => b !== null))

const menuOpen = ref<Record<string, boolean>>({ action: false, fill: false, rename: false, delete: false })

function handleEmit(event: 'action' | 'fill' | 'rename' | 'delete') {
  if (event === 'action') emit('action')
  else if (event === 'fill') emit('fill')
  else if (event === 'rename') emit('rename')
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
              <v-tooltip :text="btn.config.tooltip" :disabled="!btn.config.tooltip" location="top">
                <template #activator="{ props: tooltipProps }">
                  <v-btn v-bind="{ ...menuProps, ...tooltipProps }" :icon="btn.config.icon" :color="btn.config.color" :loading="btn.config.loading" variant="text" size="small" />
                </template>
              </v-tooltip>
            </template>
            <v-card>
              <v-card-text class="pb-0">{{ btn.config.confirmText }}</v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn size="small" :disabled="btn.config.loading" @click="menuOpen[btn.event] = false">Отмена</v-btn>
                <v-btn size="small" :color="btn.config.color" @click="handleEmit(btn.event); menuOpen[btn.event] = false">
                  {{ btn.config.confirmLabel ?? 'Подтвердить' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>

          <v-tooltip v-else :text="btn.config.tooltip" :disabled="!btn.config.tooltip" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-btn v-bind="tooltipProps" :icon="btn.config.icon" :color="btn.config.color" :loading="btn.config.loading" variant="text" size="small" @click="handleEmit(btn.event)" />
            </template>
          </v-tooltip>
        </template>
      </template>
    </v-list-item>
  </v-card>
</template>
