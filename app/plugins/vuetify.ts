import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import colors from 'vuetify/util/colors'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


export default defineNuxtPlugin((nuxtApp) => {
	const vuetify = createVuetify({
		components,
		directives,
		theme: {
			themes: {
				light: {
					dark: false,
					colors: {
						primary: "#1e8d99", // #1e8d99
						secondary: "#894eff", // #894eff
					}
				},
				dark: {
					dark: true,
					colors: {
						primary: "#1e8d99", // #1e8d99
						secondary: "#894eff", // #894eff
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
