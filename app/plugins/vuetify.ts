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
						secondary: "#894eff",
					}
				},
				dark: {
					dark: true,
					colors: {
						primary: "#4E36FF",
						secondary: "#894eff",
					}
				},
			},
		},
		defaults: {
			VBtn: {
				style: 'text-transform: none; letter-spacing: normal',
			},
			global: {
				ripple: false,
			},
		},
		ssr: true,
	})

	nuxtApp.vueApp.use(vuetify)
})
