<script setup lang="ts">
// import { useTheme } from "vuetify"

// const theme = useTheme()
const router = useRouter()
// const savedTheme = useCookie('theme')
const userStore = useAuth();

let drawer = ref(false);
let dialog = ref(false);

// if (['light', 'dark'].includes(String(savedTheme.value))) {
//   theme.global.name.value = String(savedTheme.value);
// }


// function toggleTheme() {
//   theme.global.name.value = theme.global.current.value.dark ? "light" : "dark"
//   savedTheme.value = theme.global.name.value
// }

async function logOut() {
  dialog.value = false;
  await userStore.logout();
}
</script>

<template>
  <v-app>
    <v-app-bar flat border>
      <v-container class="d-flex align-center">
        <NuxtLink to="/" class="text-decoration-none text-high-emphasis">
          <div class="font-weight-bold text-h6">DocumentFill</div>
        </NuxtLink>

        <v-spacer></v-spacer>

        <div class="d-flex align-center">
          <div class="d-flex align-center cursor-pointer" @click="router.push('/cabinet')">
            ЛК
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <Footer />
  </v-app>
</template>