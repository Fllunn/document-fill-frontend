<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const userStore = useAuth();

let drawer = ref(false);
let dialog = ref(false);

const breadcrumbTranslations: { [key: string]: string } = {
  "admin": "Админка",
};

const navigationItems: any[] = [
  { title: 'Панель управления', path: '/admin', icon: 'mdi-account-tie' },
];

const getTitle = (segment: string): string => {
  return breadcrumbTranslations[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
};

const breadcrumbs = computed(() => {
  const pathSegments = route.path.split('/').filter(segment => segment);

  const items = pathSegments.map((segment, index) => {
    const to = '/' + pathSegments.slice(0, index + 1).join('/');
    return {
      title: getTitle(segment),
      to: to,
      disabled: index === pathSegments.length - 1,
    };
  });

  return [
    {
      title: 'Главная',
      to: '/',
      disabled: route.path === '/',
    },
    ...items,
  ];
});

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

        <div class="hidden-sm-and-down d-flex align-center">
          <v-btn v-for="item in navigationItems" :key="item.path" :to="item.path" variant="text" class="mx-1"
            :prepend-icon="item.icon">
            {{ item.title }}
          </v-btn>

          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" class="ml-2">
                <v-avatar size="32" class="mr-2 border">
                  <span v-if="userStore.user?.name">{{ userStore.user.name[0] }}</span>
                </v-avatar>
                {{ userStore.user?.name }}
                <v-icon icon="mdi-chevron-down"></v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item to="/cabinet" prepend-icon="mdi-home-outline">
                <v-list-item-title>Личный кабинет</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="dialog = true" prepend-icon="mdi-logout" base-color="error">
                <v-list-item-title>Выйти</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" location="right" temporary>
      <v-list>
        <v-list-item :title="userStore.user?.name" :subtitle="userStore.user?.email">
          <template v-slot:prepend>
            <v-avatar class="border">
              <span v-if="userStore.user?.name">{{ userStore.user.name[0] }}</span>
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav>
        <v-list-item v-for="item in navigationItems" :key="item.path" :to="item.path" :prepend-icon="item.icon"
          :title="item.title"></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="red" variant="tonal" prepend-icon="mdi-logout" @click="dialog = true">
            Выйти
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-container v-if="route.path.startsWith('/admin')">
        <v-row>
          <v-col cols="12">
            <v-breadcrumbs :items="breadcrumbs" class="text-h4 font-weight-bold pa-0">
              <template v-slot:divider>
                <v-icon icon="mdi-chevron-right"></v-icon>
              </template>
              <template v-slot:item="{ item }">
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

    <v-dialog v-model="dialog" max-width="400">
      <v-card title="Выйти из аккаунта?" text="Вы уверены, что хотите завершить текущую сессию?">
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn text="Отмена" @click="dialog = false"></v-btn>
          <v-btn text="Да, выйти" color="primary" @click="logOut"></v-btn>
        </template>
      </v-card>
    </v-dialog>

    <Footer />
  </v-app>
</template>