<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
</script>

<template>
  <v-card>
    <v-card-title>
      Данные аккаунта
    </v-card-title>

    <v-card-text>
      <CabinetSettingsProfileForm />
    </v-card-text>
  </v-card>
</template>
