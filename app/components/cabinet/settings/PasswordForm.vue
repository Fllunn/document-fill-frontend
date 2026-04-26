<script setup lang="ts">
const oldPassword = ref('')
const newPassword = ref('')
const repeatPassword = ref('')
</script>

<template>
  <v-form>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="oldPassword"
          label="Текущий пароль"
          type="password"
          variant="outlined"
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="newPassword"
          label="Новый пароль"
          type="password"
          variant="outlined"
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="repeatPassword"
          label="Повторите новый пароль"
          type="password"
          variant="outlined"
        />
      </v-col>

      <v-col cols="12">
        <v-btn color="primary">
          Изменить пароль
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
