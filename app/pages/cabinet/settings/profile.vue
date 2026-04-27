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

  <v-dialog v-model="isNameDialogOpen" max-width="clamp(320px, 90vw, 512px)">
    <v-card>
      <v-card-title>
        Изменить имя
      </v-card-title>

      <v-card-text>
        <CabinetSettingsProfileForm />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
