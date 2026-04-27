<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import type { IUpdateUser } from '~/types/auth/update-user.interface'
import { useField, useForm } from 'vee-validate'
import { toast } from 'vue3-toastify'

const auth = useAuth()

const isNameDialogOpen = ref(false)
const isEmailDialogOpen = ref(false)
const email = ref(auth.user?.email ?? '')
const loading = ref(false)

type NameForm = {
  name: string
}

const { nameRule } = useValidationRules()

const { meta, handleSubmit } = useForm<NameForm>({
  initialValues: {
    name: auth.user?.name ?? '',
  },
  validationSchema: {
    name: nameRule,
  },
})

const name = useField<string>('name')

async function updateProfile(data: IUpdateUser): Promise<boolean> {
  loading.value = true

  try {
    return await auth.updateUser(data)
  } finally {
    loading.value = false
  }
}

const updateName = handleSubmit(async (values) => {
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

async function updateEmail(): Promise<void> {
  if (!auth.user?.name) {
    return
  }

  const isUpdated = await updateProfile({
    name: auth.user.name,
    email: email.value,
  })

  if (isUpdated) {
    isEmailDialogOpen.value = false
    toast(`Почта успешно изменена на ${email.value}`, { type: 'success' })
  }
}
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
      />
    </v-col>
  </v-row>

  <CabinetSettingsDialog
    v-model="isNameDialogOpen"
    title="Смена имени"
    submit-text="Сохранить"
    :loading="loading"
    :disabled="!meta.valid"
    @submit="updateName"
  >
    <UiTextField
      v-model="name.value.value"
      :error-messages="name.errorMessage.value"
      label="Имя"
      placeholder="Введите новое имя"
      prepend-inner-icon="mdi-account-circle-outline"
    />
  </CabinetSettingsDialog>
</template>
