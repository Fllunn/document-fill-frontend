<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>

<template>
  <v-row>
    <v-col cols="12">
      <CabinetSettingsActionItem
        icon="mdi-lock-outline"
        title="Пароль"
        description="Изменение пароля для входа в аккаунт"
        action-text="Изменить"
      />
    </v-col>

    <v-col cols="12">
      <CabinetSettingsActionItem
        icon="mdi-shield-check-outline"
        title="Двухфакторная аутентификация"
        description="Дополнительная защита аккаунта при входе"
        action-text="Настроить"
      />
    </v-col>
  </v-row>
</template>
