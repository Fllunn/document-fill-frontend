<script setup lang="ts">

definePageMeta({
  middleware: 'login',
})

import { useField, useForm } from 'vee-validate'

const router = useRouter()
const auth = useAuth()

type LoginForm = {
  email: string
  password: string
}

const { emailRule, passwordRule } = useValidationRules()

const { meta, handleSubmit } = useForm<LoginForm>({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: {
    email: emailRule,
    password: passwordRule,
  },
})

const email = useField<string>('email')
const password = useField<string>('password')

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
          <UiTextField
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            label="Почта"
            type="email"
            placeholder="ivan@gmail.com"
            prepend-inner-icon="mdi-email-outline"
          />

          <!-- Пароль -->
          <UiPasswordField
            v-model="password.value.value"
            :error-messages="password.errorMessage.value"
            label="Пароль"
            placeholder="Введите пароль"
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
