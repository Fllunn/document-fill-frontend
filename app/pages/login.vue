<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import isEmail from 'validator/lib/isEmail'

const router = useRouter()
const auth = useAuth()

type LoginForm = {
  email: string
  password: string
}

const { meta, handleSubmit } = useForm<LoginForm>({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: {
    email: (value: string) => {
      if (!value) return 'Введите почту'

      if (!isEmail(value)) return 'Введите корректную почту'

      if (value.length > 300) return 'Почта должна содержать не более 300 символов'

      return true
    },

    password: (value: string) => {
      if (!value) return 'Введите пароль'

      if (value.length < 8) return 'Пароль должен содержать не менее 8 символов'

      if (value.length > 50) return 'Пароль должен содержать не более 50 символов'

      return true
    },
  },
})

const email = useField<string>('email')
const password = useField<string>('password')

const isShowPassword = ref(false)
const loading = ref(false)

const login = handleSubmit(async (values) => {
  loading.value = true

  try {
    const isLoggedIn = await auth.login({
      email: values.email,
      password: values.password,
    })

    if (isLoggedIn) {
      if (auth.user?.roles?.includes('admin')) {
        await router.push('/admin')
      } else {
        await router.push('/cabinet')
      }
    }
  } finally {
    loading.value = false
  }
})

</script>

<template>
  <v-container class="align-start">
    <v-col cols="12" xs="12" md="6" lg="4" class="mt-4 ma-auto">
      <v-card class="d-flex flex-column justify-center align-center text-center rounded-lg w-100 pl-6 pr-6 pt-4 pb-6">
        <h2>Вход</h2>

        <v-form class="mt-6 w-100" @submit.prevent="login">
          
          <!-- Почта -->
          <v-text-field
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            label="Почта"
            placeholder="ivan@gmail.com"
            variant="outlined"
            prepend-inner-icon="mdi-email-outline"
          />

          <!-- Пароль -->
          <v-text-field
            v-model="password.value.value"
            :error-messages="password.errorMessage.value"
            :append-inner-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="isShowPassword ? 'text' : 'password'"
            label="Пароль"
            placeholder="Введите пароль"
            variant="outlined"
            prepend-inner-icon="mdi-lock-outline"
            @click:append-inner="isShowPassword = !isShowPassword"
          />

          <v-btn
            type="submit"
            color="accent"
            class="mt-4 w-100"
            :disabled="!meta.valid"
            :loading="loading"
          >
            Войти
          </v-btn>
        </v-form>

        <v-card-text class="text-subtitle-1 w-100 mt-4 pa-0">

          Нет аккаунта?
          <NuxtLink
            to="/register"
            class="font-weight-bold text-primary text-decoration-none"
          >
            Зарегистрироваться
          </NuxtLink>

        </v-card-text>
      </v-card>
    </v-col>
  </v-container>
</template>