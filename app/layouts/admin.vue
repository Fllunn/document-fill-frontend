<script setup lang="ts">
const route = useRoute()

const breadcrumbTranslations: Record<string, string> = {
  admin: 'Админка',
}

const breadcrumbs = computed(() => {
  const segments = route.path.split('/').filter(Boolean)

  const items = segments.map((segment, index) => ({
    title: breadcrumbTranslations[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1),
    to: '/' + segments.slice(0, index + 1).join('/'),
    disabled: index === segments.length - 1,
  }))

  return [{ title: 'Главная', to: '/', disabled: route.path === '/' }, ...items]
})
</script>

<template>
  <v-app>
    <AppBar />

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

    <Footer />
  </v-app>
</template>
