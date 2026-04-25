<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Настройки</h1>
      </v-col>

      <v-col cols="12" md="3">
        <CabinetSettingsNavigation />
      </v-col>

      <v-col cols="12" md="9">
        <slot />
      </v-col>
    </v-row>
  </v-container>
</template>
