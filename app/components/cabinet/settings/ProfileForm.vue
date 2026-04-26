<script setup lang="ts">
const name = ref('')
const email = ref('')
</script>

<template>
  <v-form>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="name"
          label="Имя"
          variant="outlined"
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          variant="outlined"
        />
      </v-col>

      <v-col cols="12">
        <v-btn color="primary">
          Сохранить
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
