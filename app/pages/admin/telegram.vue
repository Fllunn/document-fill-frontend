<script setup lang="ts">
import { useAdminTelegram } from '~/composables/Admin/useAdminTelegram'

const TELEGRAM_BOT_NAME = '@doctemp_bot'

definePageMeta({
  middleware: 'admin',
})

const { linked, code, loading, loadingUnlink, fetchStatus, generateCode, unlinkTelegram } = useAdminTelegram()

const linkDialogOpen = ref(false)
const unlinkDialogOpen = ref(false)
const copied = ref(false)

await fetchStatus()

const linkCommand = computed(() => `/link ${code.value}`)

const handleLinkClick = async () => {
  await generateCode()
  if (code.value) linkDialogOpen.value = true
}

const handleLinkConfirm = async () => {
  await fetchStatus()
  linkDialogOpen.value = false
}

const handleUnlink = async () => {
  await unlinkTelegram()
  unlinkDialogOpen.value = false
}

const copyCode = async () => {
  if (!code.value) return
  await navigator.clipboard.writeText(linkCommand.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <v-container>
    <v-row>

      <v-col cols="12">
        <div v-if="loading" class="d-flex justify-center">
          <v-progress-circular indeterminate color="primary" />
        </div>

        <CabinetSettingsActionItem
          v-else-if="linked"
          icon="mdi-check-circle"
          title="Telegram подключен"
          :description="`${TELEGRAM_BOT_NAME}`"
          action-text="Отвязать"
          @action="unlinkDialogOpen = true"
        />

        <CabinetSettingsActionItem
          v-else
          icon="mdi-send-circle-outline"
          title="Привязать Telegram"
          :description="TELEGRAM_BOT_NAME"
          action-text="Привязать"
          @action="handleLinkClick"
        />
      </v-col>
    </v-row>
  </v-container>

  <CabinetSettingsDialog
    v-model="linkDialogOpen"
    title="Привязка Telegram"
    :description="`Отправьте команду боту ${TELEGRAM_BOT_NAME}. Код действителен 5 минут`"
    submit-text="Понятно"
    @submit="handleLinkConfirm"
  >
    <v-row class="py-2 d-flex align-center justify-center">
      <v-sheet
        class="px-3 py-2"
        color="surface-variant"
        rounded="lg"
      >
        {{ linkCommand }}
      </v-sheet>
      <v-btn
        :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
        :color="copied ? 'success' : undefined"
        variant="text"
        @click="copyCode"
      />
    </v-row>
  </CabinetSettingsDialog>

  <CabinetSettingsDialog
    v-model="unlinkDialogOpen"
    title="Отвязать Telegram?"
    description="Telegram будет отвязан"
    submit-text="Отвязать"
    :loading="loadingUnlink"
    @submit="handleUnlink"
  />
</template>
