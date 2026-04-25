import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/styles/fonts.css', '~/assets/styles/main.scss', 'vuetify/styles'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3033',
    }
  },
  modules: [
    "@pinia/nuxt",
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
    build: {
    transpile: ['vuetify'],
  },
    vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  postcss: {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
},
})
