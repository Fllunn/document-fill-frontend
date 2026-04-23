<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import isEmail from 'validator/lib/isEmail'

const router = useRouter()
const auth = useAuth()

type RegistrationForm = {
  name: string
  email: string
  password: string
  agreement: boolean
}

const { meta, handleSubmit } = useForm<RegistrationForm>({
  initialValues: {
    name: '',
    email: '',
    password: '',
    agreement: false,
  },
  validationSchema: {
    name: (value: string) => {
      if (!value) return 'Введите имя'

      if (value.length < 2) return 'Имя должно содержать не менее 2 символов'

      if (value.length > 50) return 'Имя должно содержать не более 50 символов'

      return true
    },

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

    agreement: (value: boolean) => {
      if (!value) return 'Вы должны принять соглашение на обработку данных'

      return true
    },
  },
})

const name = useField<string>('name')
const email = useField<string>('email')
const password = useField<string>('password')
const agreement = useField<boolean>('agreement')

const isShowPassword = ref(false)
const loading = ref(false)

const submit = handleSubmit(async (values) => {
  loading.value = true

  try {
    const isRegistered = await auth.register({
      name: values.name,
      email: values.email,
      password: values.password,
    })

    if (isRegistered) {
      await router.push('/cabinet')
    }
  } finally {
    loading.value = false
  }
})

</script>

<template>
  <v-container>
    <BackButton />

    <v-col cols="12" xs="12" sm="10" md="7" lg="5" class="mt-4 ma-auto">
      <v-card class="d-flex flex-column justify-center align-center text-center w-100 pa-6 rounded-lg">

        <h2>Начните создавать документы</h2>
        <h3>Все необходимое для работы с шаблонами</h3>
        
        <v-form class="mt-6 w-100" @submit.prevent="submit">
          
          <!-- Имя -->
          <v-text-field
            v-model="name.value.value"
            :error-messages="name.errorMessage.value"
            label="Имя"
            placeholder="Иван"
            variant="outlined"
            prepend-inner-icon="mdi-emoticon-dead"
          />

          <!-- Почта -->
          <v-text-field
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            label="Почта"
            type="email"
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

          <v-checkbox
            v-model="agreement.value.value"
            :error-messages="agreement.errorMessage.value"
            label="Я согласен на обработку и хранение своих персональных данных"
          />

          <v-btn
            type="submit"
            color="accent"
            class="mt-4 w-100"
            :disabled="!meta.valid"
            :loading="loading"
          >
            Зарегистрироваться
          </v-btn>

        </v-form>
        
      </v-card>
    </v-col>
  </v-container>
</template>