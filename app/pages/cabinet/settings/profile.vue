<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import type { IUpdateUser } from '~/types/auth/update-user.interface'
import { useField, useForm } from 'vee-validate'
import { toast } from 'vue3-toastify'

const auth = useAuth()

const isNameDialogOpen = ref(false)
const isEmailDialogOpen = ref(false)
const loading = ref(false)

type NameForm = {
  name: string
}

type EmailForm = {
  email: string
}

const { nameRule, emailRule } = useValidationRules()

const {
  meta: nameMeta,
  handleSubmit: handleNameSubmit,
  resetForm: resetNameForm,
} = useForm<NameForm>({
  initialValues: {
    name: '',
  },
  validationSchema: {
    name: nameRule,
  },
})

const name = useField<string>('name')

const {
  meta: emailMeta,
  handleSubmit: handleEmailSubmit,
  resetForm: resetEmailForm,
} = useForm<EmailForm>({
  initialValues: {
    email: '',
  },
  validationSchema: {
    email: emailRule,
  },
})

const email = useField<string>('email')

watch(isNameDialogOpen, (isOpen) => {
  if (!isOpen) {
    resetNameForm()
  }
})

watch(isEmailDialogOpen, (isOpen) => {
  if (!isOpen) {
    resetEmailForm()
  }
})

async function updateProfile(data: IUpdateUser): Promise<boolean> {
  loading.value = true

  try {
    return await auth.updateUser(data)
  } finally {
    loading.value = false
  }
}

const updateName = handleNameSubmit(async (values) => {
  if (!auth.user?.email) {
    return
  }

  const isUpdated = await updateProfile({
    name: values.name,
    email: auth.user.email,
  })

  if (isUpdated) {
    isNameDialogOpen.value = false
    toast(`Имя успешно изменено на ${values.name}`, { type: 'success' })
  }
})

const updateEmail = handleEmailSubmit(async (values) => {
  if (!auth.user?.name) {
    return
  }

  const isUpdated = await updateProfile({
    name: auth.user.name,
    email: values.email,
  })

  if (isUpdated) {
    isEmailDialogOpen.value = false
    toast(`Почта успешно изменена на ${values.email}`, { type: 'success' })
  }
})
</script>

<template>
  <v-row>
    <v-col cols="12">
      <CabinetSettingsActionItem
        icon="mdi-account-edit-outline"
        title="Имя"
        :description="`Ваше имя: ${ auth.user?.name }. Вы можете его изменить`"
        action-text="Изменить"
        @action="isNameDialogOpen = true"
      />
    </v-col>

    <v-col cols="12">
      <CabinetSettingsActionItem
        icon="mdi-email-edit-outline"
        title="Почта"
        :description="`Ваш аккаунт привязан к почте ${auth.user?.email}`"
        action-text="Изменить"
        @action="isEmailDialogOpen = true"
      />
    </v-col>
  </v-row>

  <CabinetSettingsDialog
    v-model="isNameDialogOpen"
    title="Смена имени"
    submit-text="Сохранить"
    :loading="loading"
    :disabled="!nameMeta.valid"
    @submit="updateName"
  >
    <UiTextField
      v-model="name.value.value"
      :error-messages="name.errorMessage.value"
      label="Имя"
      :placeholder="auth.user?.name ?? 'Введите новое имя'"
      prepend-inner-icon="mdi-account-circle-outline"
    />
  </CabinetSettingsDialog>

  <CabinetSettingsDialog
    v-model="isEmailDialogOpen"
    title="Смена почты"
    description="Будьте внимательны: при смене почты вам нужно будет использовать новую почту для входа в аккаунт"
    submit-text="Сохранить"
    :loading="loading"
    :disabled="!emailMeta.valid"
    @submit="updateEmail"
  >
    <UiTextField
      v-model="email.value.value"
      :error-messages="email.errorMessage.value"
      label="Почта"
      type="email"
      :placeholder="auth.user?.email ?? 'Введите новую почту'"
      prepend-inner-icon="mdi-email-outline"
    />
  </CabinetSettingsDialog>
</template>
