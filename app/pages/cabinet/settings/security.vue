<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>

<template>
  <v-row>
    <v-col cols="12">
      <CabinetSettingsActionItem
        icon="mdi-key-outline"
        title="Пароль"
        description="Пароль это ключ к вашей учетной записи. Никому его не сообщайте. При необходимости Вы можете изменить его"
        action-text="Изменить"
      />
    </v-col>
  </v-row>
</template>
