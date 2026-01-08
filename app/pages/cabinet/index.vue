<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuth();

</script>

<template>
  <v-container>
    <v-row>
      
      <v-col cols="12">
        <h1>Шаблоны</h1>
      </v-col>

      <v-col cols="12">
        <TemplatesTemplateUploadForm />
      </v-col>

    </v-row>
  </v-container>
</template>