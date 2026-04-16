<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()
const auth = useAuth()

const emailFromQuery = ref(route.query.email as string || '')
const nameFromQuery = ref(route.query.name as string || '')

const { meta, handleSubmit } = useForm<{
  name: string,
  email: string,
  password:string,
  agreement: boolean
}>({
  initialValues: {
  name: nameFromQuery.value,
  email: emailFromQuery.value,
  password: '',
  agreement: false
},
validationSchema:{
  name: (value:string) => {
    if (!value) return 'Введите имя'
    if (value.length < 2) return 'Имя должно содержать не менее 2 символов'
    if (value.length > 50) return 'Имя должно содержать не более 50 символов'
    return true;
  },
  email: (value:string) => {
    if (!value) return 'Введите почту'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Введите корректную почту'

    if (value.length > 300) return 'Почта должна содержать не более 300 символов'

    return true
  },
  password: (value:string) => {
    if (!value) return 'Введите пароль'
    if (value.length < 8) return 'Пароль должен содержать не менее 8 символов'
    if (value.length > 50) return 'Пароль должен содержать не более 50 символов'
    return true
  },
  agreement: (value:boolean) => {
    if (!value) return 'Вы должны принять соглашение на обработку данных'
    return true
  }
},
})

let name = useField<string>('name')
let email = useField<string>('email')
let password = useField<string>('password')
let agreement = useField<boolean>('agreement')

let show_password = ref(false)
let loading = ref(false)

const submit = handleSubmit(async (values) => {
loading.value = true
 const finalValues: any ={
  ...values,
  email: email.value.value,
 }
 try {
  const res = await auth.register(finalValues)

  if (res) {
    router.push('/cabinet')
  }
} catch (error) {
    console.log("error registration", error);
  } finally {
    loading.value = false
  }
})

onMounted(() => {
  if (emailFromQuery.value) {
    email.setValue(emailFromQuery.value)
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
        
        <v-form class="mt-6 w-100">
          

          <v-text-field label="Имя" placeholder="Игорь" variant="outlined" :rules="[rules.required]"/>

          <v-text-field label="Email" type="email" placeholder="igor@mail.com" variant="outlined" :rules="[rules.required]"/>

          <v-text-field label="Пароль"
          variant="outlined" 
           :rules="[rules.password]" 
           :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
           @click:append-inner="visible = !visible"
           :type="visible ? 'text' : 'password'"
           prepend-inner-icon="mdi-lock-outline"
           />

          <v-checkbox>
            <template>
            </template>
          </v-checkbox>

          <v-btn type="submit">
            Зарегистрироваться
          </v-btn>

        </v-form>

        
      </v-card>
    </v-col>
  </v-container>
</template>