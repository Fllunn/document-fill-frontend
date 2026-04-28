<script setup lang="ts">

const auth = useAuth()


const userFirstLetter = computed(() => {
  if (!auth.user?.name) {
    return ''
  }

  return auth.user.name.charAt(0).toUpperCase()
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

        <template v-if="userFirstLetter">
          <v-btn to="/cabinet" icon variant="text">
            <v-avatar size="48" color="grey-lighten-3">
              {{ userFirstLetter }}
            </v-avatar>
          </v-btn>
        </template>
        
        <template v-else>
          <v-btn to="/login" variant="outlined" class="mr-2" :active="false">
            Войти
          </v-btn>

          <v-btn to="/register" variant="flat" color="primary">
            Регистрация
          </v-btn>
        </template>

        
      </v-container>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <Footer />
  </v-app>
</template>