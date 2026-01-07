import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/styles/main.scss'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    ['@nuxtjs/google-fonts', {
      families: {
        Montserrat: [100, 200, 300, 400, 500, 600, 700, 800, 900]
      }
    }],
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
