<script setup lang="ts">

const auth = useAuth()
const isLogoutDialogOpen = ref(false)
const loading = ref(false)

const userFirstLetter = computed(() => {
  if (!auth.user?.name) {
    return ''
  }

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

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'F1') {
    e.preventDefault()
    window.open('/help/index.htm', '_blank')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

</script>

<template>
  <v-app>
    <v-app-bar flat border>
      <v-container class="d-flex align-center">
        <NuxtLink to="/" class="text-decoration-none text-high-emphasis">
          <div class="font-weight-bold text-h6">DocumentFill</div>
        </NuxtLink>

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
                <v-list-item to="/cabinet" prepend-icon="mdi-home-outline" rounded="xl">
                  <v-list-item-title>Личный кабинет</v-list-item-title>
                </v-list-item>

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

          <v-btn href="/help/index.htm" target="_blank" variant="flat" color="primary">
            Помощь
          </v-btn>
        </div>

        <div class="d-flex d-sm-none align-center">
          <v-menu location="bottom end">
            <template #activator="{ props }">
              <v-btn v-bind="props" icon="mdi-menu" variant="text"></v-btn>
            </template>

            <v-list rounded="xl">
              <template v-if="userFirstLetter">
                <v-list-item to="/cabinet" prepend-icon="mdi-home-outline" rounded="xl">
                  <v-list-item-title>Личный кабинет</v-list-item-title>
                </v-list-item>

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

              <v-list-item href="/help/index.htm" target="_blank" prepend-icon="mdi-help" rounded="xl">
                <v-list-item-title>Помощь</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
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