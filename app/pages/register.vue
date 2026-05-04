<script setup lang="ts">

definePageMeta({
  middleware: 'login',
})

import { useField, useForm } from 'vee-validate'

const router = useRouter()
const auth = useAuth()

type RegistrationForm = {
  name: string
  email: string
  password: string
  agreement: boolean
}

const { emailRule, passwordRule, nameRule, agreementRule } = useValidationRules()

const { meta, handleSubmit } = useForm<RegistrationForm>({
  initialValues: {
    name: '',
    email: '',
    password: '',
    agreement: false,
  },
  validationSchema: {
    name: nameRule,
    email: emailRule,
    password: passwordRule,
    agreement: agreementRule,
  },
})

const name = useField<string>('name')
const email = useField<string>('email')
const password = useField<string>('password')
const agreement = useField<boolean>('agreement')

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

    <v-col cols="12" xs="12" sm="10" md="7" lg="5" class="mt-4 ma-auto" >
      <v-card class="d-flex flex-column justify-center align-center text-center w-100 pa-6 rounded-xl">

        <h2>Начните создавать документы</h2>
        <h3>Все необходимое для работы с шаблонами</h3>
        
        <v-img src="/icons/pen-with-copybook.svg" width="63" height="59"/>

        <v-card-title>Начните создавать документы</v-card-title>
        <v-card-subtitle>Все необходимое для работы с шаблонами</v-card-subtitle>

        <v-form class="mt-6 w-100" @submit.prevent="submit">
          
          <!-- Имя -->
          <UiTextField
            v-model="name.value.value"
            :error-messages="name.errorMessage.value"
            label="Имя"
            placeholder="Иван"
            prepend-inner-icon="mdi-account-circle-outline"
            autofocus
          />

          <!-- Почта -->
          <UiTextField
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
            label="Почта"
            type="email"
            placeholder="ivan@gmail.com"
            prepend-inner-icon="mdi-email-outline"
            :autofocus="false"
          />

          <!-- Пароль -->
          <UiPasswordField
            v-model="password.value.value"
            :error-messages="password.errorMessage.value"
            label="Пароль"
            placeholder="Введите пароль"
          />

          <v-checkbox
            v-model="agreement.value.value"
            :error-messages="agreement.errorMessage.value"
            class="text-left"
          >
            <template #label>
              <span>
                Я согласен с
                <NuxtLink
                  to="/documents/privacy-policy"
                  class="text-primary text-decoration-none"
                  @click.stop
                >
                  политикой конфиденциальности
                </NuxtLink>
                и
                <NuxtLink
                  to="/documents/terms-of-use"
                  class="text-primary text-decoration-none"
                  @click.stop
                >
                  пользовательским соглашением
                </NuxtLink>
              </span>
            </template>
          </v-checkbox>

          <v-btn
            type="submit"
            color="primary"
            class="mt-4 w-100"
            :disabled="!meta.valid"
            :loading="loading"
          >
            Зарегистрироваться
          </v-btn>

        </v-form>

        <v-card-text class="text-subtitle-1 w-100 mt-4 pa-0">

          Уже есть аккаунт?
          <NuxtLink
            to="/login"
            class="font-weight-bold text-primary text-decoration-none"
          >
            Войти
          </NuxtLink>

        </v-card-text>
      </v-card>
    </v-col>
  </v-container>
</template>
