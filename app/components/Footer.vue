<script setup lang="ts">
const currentYear = new Date().getFullYear()

const footerLinks = [
  { text: 'Политика конфиденциальности', to: '/privacy-policy' },
  { text: 'Инструкция', to: '/guide' },
  { text: 'О системе', to: '/about' },
  { text: 'Техподдержка', to: '/support' },
]

const socialLinks = [
  { icon: 'mdi-telegram', href: '#' },
  { icon: 'mdi-vk', href: '#' },
  { icon: 'mdi-youtube', href: '#' },
]
</script>

<template>
  <v-footer class="border-t-sm">
    <v-container>
      <v-row align="center" class="py-4">
        <v-col cols="12" md="4" class="text-center text-md-left">
          <NuxtLink to="/" class="text-h5 font-weight-bold text-decoration-none text-grey-darken-1">
            DocumentFill
          </NuxtLink>
        </v-col>

        <v-col cols="12" md="8" class="hidden-sm-and-down text-md-right">
          <v-btn v-for="link in footerLinks" :key="link.text" :to="link.to" variant="text" class="mx-1" rounded="lg">
            {{ link.text }}
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-2"></v-divider>

      <v-row align="center" class="py-2">
        <v-col cols="12" md="8" class="text-center text-md-left text-body-2 text-medium-emphasis">
          © {{ currentYear }} DocumentFill — Все права защищены.
        </v-col>

        <v-col cols="12" md="4" class="text-center text-md-right">
          <v-btn v-for="social in socialLinks" :key="social.icon" :href="social.href" target="_blank" class="mx-1" icon
            variant="text" size="small">
            <v-icon :icon="social.icon"></v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>
