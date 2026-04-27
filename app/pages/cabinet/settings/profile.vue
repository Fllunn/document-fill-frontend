<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuth()

const isNameDialogOpen = ref(false)

</script>

<template>
  <v-row>
    <v-col cols="12">
      <CabinetSettingsActionItem
        icon="mdi-account-edit-outline"
        title="Имя"
        :description="`Ваше имя: ${ auth.user?.name }. Вы можете его изменить`"
        action-text="Изменить"
        @action="isNameDialogOpen = true"
      />
    </v-col>

    <v-col cols="12">
      <CabinetSettingsActionItem
        icon="mdi-email-edit-outline"
        title="Почта"
        :description="`Ваш аккаунт привязан к почте ${auth.user?.email}`"
        action-text="Изменить"
      />
    </v-col>
  </v-row>

  <CabinetSettingsDialog
    v-model="isNameDialogOpen"
    title="Изменить имя"
  >
    <CabinetSettingsProfileForm />
  </CabinetSettingsDialog>
</template>
