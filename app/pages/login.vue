<script setup lang="ts">
import { useField, useForm } from 'vee-validate';

const router = useRouter()
const auth = useAuth()

const { meta, handleSubmit, handleReset } = useForm({
  validationSchema: {
    password(value: string) {
      if (value?.length >= 8) return true;
      return 'Пароль должен содержать не менее 8 символов';
    },
    email(value: string) {
      if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)) return true;
      return 'Введите корректный email';
    },
  },
})

const email = useField('email');
const password = useField('password');

let isShowPassword = ref(false);
let loading = ref(false);

const login = handleSubmit(async values => {
  loading.value = true;

  let res = await auth.login(values.email, values.password);

  loading.value = false;
  if (res?.status?.value === 'success') {
    const user = auth.user;
    if(user?.roles?.includes('admin')){
      router.push("/admin");
    } else {
      router.push("/cabinet");
    }
  }
})

</script>

<template>
  <v-container class="align-start">
    <v-col cols="12" xs="12" md="6" lg="4" class="mt-4 ma-auto">
      <v-card class="d-flex flex-column justify-center align-center text-center rounded-lg w-100 pl-6 pr-6 pt-4 pb-6">
        <h2>Вход</h2>

        <v-form @submit.prevent="login" class="d-flex mt-3 flex-column align-center justify-center w-100">
          <v-text-field label="Email" type="email"
          placeholder="example@yandex.ru"
          v-model="email.value.value"
          :error-messages="email.errorMessage.value"
          variant="outlined" density="compact" class="w-100" />

          <v-text-field label="Пароль" v-model="password.value.value"
          :append-inner-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="isShowPassword = !isShowPassword"
          :type="isShowPassword ? 'text' : 'password'"
          :error-messages="password.errorMessage.value" variant="outlined" density="compact" class="w-100 mt-2" />

          <v-btn type="submit" :disabled="!meta.valid" color="accent" class="mt-4 w-100" :loading="loading">
            Войти
          </v-btn>
        </v-form>

        <!-- <v-btn text class="mt-4 w-100" @click="router.push('/registration')">
          Создать аккаунт
        </v-btn> -->
        <div class="text-subtitle-1 w-100 mt-4">
          Нет аккаунта?
          <NuxtLink to="/registration" class="font-weight-bold text-primary text-decoration-none">
            Зарегистрироваться
          </NuxtLink>
        </div>
      </v-card>
    </v-col>
  </v-container>
</template>