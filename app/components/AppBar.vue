<script setup lang="ts">
import { APP_NAME } from '~/constants/app.constants'

const { isAdmin } = useRole()

const navLinks = computed(() => {
  const links = [
    { title: 'Шаблоны', to: '/cabinet', icon: 'mdi-file-document-outline' },
    { title: 'Мои документы', to: '/cabinet/document', icon: 'mdi-folder-outline' },
  ]

  if (isAdmin.value) {
    links.push({ title: 'Панель управления', to: '/admin', icon: 'mdi-account-tie' })
  }

  return links
})

const route = useRoute()

function handleLogoClick(e: MouseEvent) {
  if (route.path === '/') {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const auth = useAuth()
const isLogoutDialogOpen = ref(false)
const loading = ref(false)

const userFirstLetter = computed(() => {
  if (!auth.user?.name) return ''
  return auth.user.name.charAt(0).toUpperCase()
})

async function logout(): Promise<void> {
  loading.value = true
  try {
    await auth.logout()
  } finally {
    loading.value = false
    isLogoutDialogOpen.value = false
  }
}
</script>

<template>
  <v-app-bar flat color="transparent" class="app-bar-blur">
    <v-container class="d-flex align-center">
      <NuxtLink to="/" class="text-decoration-none text-high-emphasis" @click="handleLogoClick">
        <div class="font-weight-bold text-h6">{{ APP_NAME }}</div>
      </NuxtLink>

      <v-spacer></v-spacer>

      <div class="d-none d-sm-flex align-center">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-decoration-none text-high-emphasis mx-3"
        >
          {{ link.title }}
        </NuxtLink>
        <NuxtLink v-if="!userFirstLetter" to="/help" class="text-decoration-none text-high-emphasis mx-3">
          Помощь
        </NuxtLink>
      </div>

      <v-spacer></v-spacer>

      <div class="d-none d-sm-flex align-center">
        <template v-if="userFirstLetter">
          <v-menu location="bottom end">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" class="pl-0 mr-4">
                <template #prepend>
                  <v-avatar size="36" color="grey-lighten-3" class="border">
                    {{ userFirstLetter }}
                  </v-avatar>
                </template>
                <v-icon icon="mdi-chevron-down" />
              </v-btn>
            </template>

            <v-list rounded="xl">
              <v-list-item to="/cabinet/settings" prepend-icon="mdi-cog-outline" rounded="xl">
                <v-list-item-title>Настройки</v-list-item-title>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item
                prepend-icon="mdi-logout"
                base-color="error"
                rounded="xl"
                @click="isLogoutDialogOpen = true"
              >
                <v-list-item-title>Выйти</v-list-item-title>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item to="/help" prepend-icon="mdi-help" rounded="xl">
                <v-list-item-title>Помощь</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <template v-else>
          <v-btn to="/login" variant="outlined" class="mr-2" :active="false">
            Войти
          </v-btn>
          <v-btn to="/register" variant="flat" color="primary" class="mr-4">
            Регистрация
          </v-btn>
        </template>
      </div>

      <div class="d-flex d-sm-none align-center">
        <v-menu location="bottom end">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="mdi-menu" variant="text"></v-btn>
          </template>

          <v-list rounded="xl">
            <template v-if="navLinks?.length">
              <v-list-item
                v-for="link in navLinks"
                :key="link.to"
                :to="link.to"
                :prepend-icon="link.icon"
                rounded="xl"
              >
                <v-list-item-title>{{ link.title }}</v-list-item-title>
              </v-list-item>

              <v-divider class="my-1"></v-divider>
            </template>

            <template v-if="userFirstLetter">
              <v-list-item to="/cabinet/settings" prepend-icon="mdi-cog-outline" rounded="xl">
                <v-list-item-title>Настройки</v-list-item-title>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item
                prepend-icon="mdi-logout"
                base-color="error"
                rounded="xl"
                @click="isLogoutDialogOpen = true"
              >
                <v-list-item-title>Выйти</v-list-item-title>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item to="/help" prepend-icon="mdi-help" rounded="xl">
                <v-list-item-title>Помощь</v-list-item-title>
              </v-list-item>
            </template>

            <template v-else>
              <v-list-item to="/login" prepend-icon="mdi-login" rounded="xl">
                <v-list-item-title>Войти</v-list-item-title>
              </v-list-item>
              <v-list-item to="/register" prepend-icon="mdi-account-plus" rounded="xl">
                <v-list-item-title>Регистрация</v-list-item-title>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item to="/help" prepend-icon="mdi-help" rounded="xl">
                <v-list-item-title>Помощь</v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </div>
    </v-container>
  </v-app-bar>

  <CabinetSettingsDialog
    v-model="isLogoutDialogOpen"
    title="Выход из аккаунта"
    description="Вы уверены, что хотите выйти из аккаунта?"
    submit-text="Выйти"
    :loading="loading"
    @submit="logout"
  />
</template>

<style scoped>
.app-bar-blur {
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  background-color: rgba(255, 255, 255, 0.75) !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12) !important;
}
</style>

