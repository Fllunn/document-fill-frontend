<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

import { useField, useForm } from 'vee-validate'
import { toast } from 'vue3-toastify'

const auth = useAuth()

type PasswordForm = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const isPasswordDialogOpen = ref(false)
const loading = ref(false)

const { passwordRule } = useValidationRules()

const {
  meta: passwordMeta,
  handleSubmit: handlePasswordSubmit,
  resetForm: resetPasswordForm,
} = useForm<PasswordForm>({
  initialValues: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
  validationSchema: {
    oldPassword: passwordRule,
    newPassword: passwordRule,
    confirmPassword: (value: string) => {
      if (!value) return 'Повторите новый пароль'

      if (value !== newPassword.value.value) return 'Пароли не совпадают'

      return true
    }
  },
})

const oldPassword = useField<string>('oldPassword')
const newPassword = useField<string>('newPassword')
const confirmPassword = useField<string>('confirmPassword')

watch(isPasswordDialogOpen, (isOpen) => {
  if (!isOpen) {
    resetPasswordForm()
  }
})

const updatePassword = handlePasswordSubmit(async (values) => {
  loading.value = true

  try {
    const isChangePassword = await auth.changePassword({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    })

    if (!isChangePassword) {
      return
    }

    isPasswordDialogOpen.value = false
    
    toast('Пароль успешно изменен', { type: 'success' })
  } finally {
    loading.value = false
  }
})

</script>

<template>
  <v-row>
    <v-col cols="12">
      <CabinetSettingsActionItem
        icon="mdi-key-outline"
        title="Пароль"
        description="Пароль это ключ к вашей учетной записи. Никому его не сообщайте. При необходимости Вы можете изменить его"
        action-text="Изменить"
        @action="isPasswordDialogOpen = true"
      />
    </v-col>
  </v-row>

  <CabinetSettingsDialog
    v-model="isPasswordDialogOpen"
    title="Смена пароля"
    description="Убедитесь, что ваш новый пароль надежный и не используется на других сайтах"
    submit-text="Сохранить"
    :loading="loading"
    :disabled="!passwordMeta.valid"
    @submit="updatePassword"
  >
    <UiPasswordField
      v-model="oldPassword.value.value"
      :error-messages="oldPassword.errorMessage.value"
      label="Текущий пароль"
      placeholder="Введите текущий пароль"
      prepend-inner-icon="mdi-key-outline"
    />
    <UiPasswordField
      v-model="newPassword.value.value"
      :error-messages="newPassword.errorMessage.value"
      label="Новый пароль"
      placeholder="Введите новый пароль"
      prepend-inner-icon="mdi-key-outline"
    />
    <UiPasswordField
      v-model="confirmPassword.value.value"
      :error-messages="confirmPassword.errorMessage.value"
      label="Подтверждение нового пароля"
      placeholder="Подтвердите новый пароль"
      prepend-inner-icon="mdi-key-outline"
    />
  </CabinetSettingsDialog>
</template>
