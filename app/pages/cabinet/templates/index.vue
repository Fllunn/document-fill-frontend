<script setup lang="ts">

import TemplateVariablesEditor from '~/components/templates/TemplateVariablesEditor.vue';

definePageMeta({ middleware: 'auth' })
const auth = useAuth();

</script>

<template>
  <v-btn @click="auth.logout">Выйти</v-btn>
  <TemplateVariablesEditor />
</template>