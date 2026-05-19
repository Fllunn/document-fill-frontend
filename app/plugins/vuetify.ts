import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((nuxtApp) => {
	const vuetify = createVuetify({
		theme: {
			themes: {
				light: {
					dark: false,
					colors: {
						primary: "#4E36FF",
						secondary: "#ff0000",
					}
				},
				dark: {
					dark: true,
					colors: {
						primary: "#4E36FF",
						secondary: "#ff0000",
					}
				},
			},
		},
		defaults: {
			VBtn: {
        rounded: 'xl',
				style: 'text-transform: none; letter-spacing: normal',
			},
      VCard: {
        rounded: 'lg',
      },
      VTextField: {
        rounded: 'xl',
      },
			global: {
				ripple: false,
			},
		},
		ssr: { clientWidth: 1280 },
	})

	nuxtApp.vueApp.use(vuetify)
})
