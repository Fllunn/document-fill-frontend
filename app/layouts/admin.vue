<script setup lang="ts">
import { APP_NAME } from '~/constants/app.constants'

const route = useRoute()
const auth = useAuth()
const isLogoutDialogOpen = ref(false)
const loading = ref(false)

const breadcrumbTranslations: Record<string, string> = {
  admin: 'Админка',
}

const userFirstLetter = computed(() => {
  if (!auth.user?.name) return ''
  return auth.user.name.charAt(0).toUpperCase()
})

const breadcrumbs = computed(() => {
  const segments = route.path.split('/').filter(Boolean)

  const items = segments.map((segment, index) => ({
    title: breadcrumbTranslations[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1),
    to: '/' + segments.slice(0, index + 1).join('/'),
    disabled: index === segments.length - 1,
  }))

  return [{ title: 'Главная', to: '/', disabled: route.path === '/' }, ...items]
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
  <v-app>
    <v-app-bar flat border>
      <v-container class="d-flex align-center">
        <NuxtLink to="/" class="text-decoration-none text-high-emphasis">
          <div class="font-weight-bold text-h6">{{ APP_NAME }}</div>
        </NuxtLink>

        <v-spacer></v-spacer>

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
                  @click="isLogoutDialogOpen = true"
                  rounded="xl"
                >
                  <v-list-item-title>Выйти</v-list-item-title>
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

          <v-btn to="/admin" variant="flat" color="primary" prepend-icon="mdi-account-tie">
            Панель управления
          </v-btn>
        </div>

        <div class="d-flex d-sm-none align-center">
          <v-menu location="bottom end">
            <template #activator="{ props }">
              <v-btn v-bind="props" icon="mdi-menu" variant="text"></v-btn>
            </template>

            <v-list rounded="xl">
              <v-divider class="my-1"></v-divider>

              <template v-if="userFirstLetter">
                <v-list-item to="/cabinet/settings" prepend-icon="mdi-cog-outline" rounded="xl">
                  <v-list-item-title>Настройки</v-list-item-title>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item
                  prepend-icon="mdi-logout"
                  base-color="error"
                  @click="isLogoutDialogOpen = true"
                  rounded="xl"
                >
                  <v-list-item-title>Выйти</v-list-item-title>
                </v-list-item>
              </template>

              <template v-else>
                <v-list-item to="/login" prepend-icon="mdi-login" rounded="xl">
                  <v-list-item-title>Войти</v-list-item-title>
                </v-list-item>

                <v-list-item to="/register" prepend-icon="mdi-account-plus" rounded="xl">
                  <v-list-item-title>Регистрация</v-list-item-title>
                </v-list-item>
              </template>

              <v-divider class="my-1"></v-divider>

              <v-list-item to="/admin" prepend-icon="mdi-account-tie" rounded="xl">
                <v-list-item-title>Панель управления</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container v-if="route.path.startsWith('/admin')">
        <v-row>
          <v-col cols="12">
            <v-breadcrumbs :items="breadcrumbs" class="text-h4 font-weight-bold pa-0">
              <template #divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
              </template>
              <template #item="{ item }">
                <v-breadcrumbs-item :to="item.to" :disabled="item.disabled" class="text-decoration-none">
                  {{ item.title }}
                </v-breadcrumbs-item>
              </template>
            </v-breadcrumbs>
          </v-col>
        </v-row>
      </v-container>

      <slot />
    </v-main>

    <CabinetSettingsDialog
      v-model="isLogoutDialogOpen"
      title="Выход из аккаунта"
      description="Вы уверены, что хотите выйти из аккаунта?"
      submit-text="Выйти"
      :loading="loading"
      @submit="logout"
    />

    <Footer />
  </v-app>
</template>
