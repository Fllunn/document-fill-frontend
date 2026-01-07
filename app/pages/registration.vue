<script setup lang="ts">
import { useField, useForm } from 'vee-validate';

const router = useRouter()
const route = useRoute()
const auth = useAuth()

const emailFromQuery = ref(route.query.email as string || '');
const nameFromQuery = ref(route.query.name as string || '');

const { meta, handleSubmit } = useForm<{
  name: string,
  email: string,
  password: string,
  agreement: boolean,
}>({
  initialValues: {
    name: nameFromQuery.value,
    email: emailFromQuery.value,
    password: '',
    agreement: false,
  },
  validationSchema: {
    name(value: string) {
      if (!value) return 'Введите ФИО'
      if (value.length < 4) return 'Слишком короткое ФИО'
      if (value.length > 200) return 'Слишком длинное ФИО'
      return true
    },
    email(value: string) {
      if (!value) return 'Введите почту'
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value))
        return 'Некорректный формат почты'
      return true
    },
    password(value: string) {
      if (!value) return 'Введите пароль'
      if (value.length < 8) return 'Пароль должен быть не менее 8 символов'
      if (value.length > 30) return 'Пароль должен быть не более 30 символов'
      return true
    },
    agreement(value: boolean) {
      if (value !== true) return 'Необходимо ваше согласие на обработку данных'
      return true
    },
  },
})

let name = useField<string>('name')
let email = useField<string>('email')
let password = useField<string>('password')
let agreement = useField<boolean>('agreement')

let show_password = ref(false)
let loading = ref(false)

const submit = handleSubmit(async values => {
  loading.value = true
  const finalValues: any = {
    ...values,
    email: email.value.value,
  };
  try {
    const res = await auth.registration(finalValues)

    if (res) {
      router.push('/cabinet')
    }
  } catch (error){
    console.log("error registration : ", error);
  } finally {
    loading.value = false
  }
})

onMounted(() => {
  if (emailFromQuery.value) {
    email.setValue(emailFromQuery.value);
  }
})

</script>

<template>
  <v-container>
    <BackButton />

    <v-col cols="12" xs="12" sm="10" md="7" lg="5" class="mt-4 ma-auto">
      <v-card class="d-flex flex-column 
        justify-center align-center 
        text-center w-100 pa-6 rounded-lg">

        <h2>Регистрация</h2>
        
        <v-form class="mt-6 w-100" @submit.prevent="submit">
          <v-text-field label="Имя" placeholder="Андрей" v-model="name.value.value"
            :error-messages="name.errors.value" variant="outlined" density="compact" class="w-100" />

          <v-text-field label="Email" type="email" placeholder="andrey@mail.com" v-model="email.value.value"
            :error-messages="email.errors.value" variant="outlined" density="compact" class="w-100 mt-1" />

          <v-text-field label="Пароль" v-model="password.value.value"
            :append-inner-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show_password = !show_password" :type="show_password ? 'text' : 'password'"
            :error-messages="password.errorMessage.value" variant="outlined" density="compact" class="w-100 mt-1" />

          <v-checkbox v-model="agreement.value.value" :error-messages="agreement.errorMessage.value" class="mt-2">
            <template v-slot:label>
              <div class="text-caption text-left">
                Я согласен
                <a href="https://clck.ru/3RBh9B" target="_blank"
                  @click.stop class="text-primary">
                  с политикой конфиденциальности и обработки персональных данных
                </a>
                <!-- <a href="/documents/Согласие_на_обработку_персональных_данных" target="_blank"
                  @click.stop class="text-primary">
                  с политикой конфиденциальности и обработки персональных данных
                </a> -->
              </div>
            </template>
          </v-checkbox>

          <v-btn type="submit" :disabled="!meta.valid" :loading="loading" color="accent" class="mt-2" block>
            Зарегистрироваться
          </v-btn>
        </v-form>

        <div class="text-subtitle-1 w-100 mt-4">
          Уже есть аккаунт?
          <NuxtLink to="/login" class="font-weight-bold text-primary text-decoration-none">
            Войти
          </NuxtLink>
        </div>
      </v-card>
    </v-col>
  </v-container>
</template>