import isEmail from 'validator/lib/isEmail'

export const useValidationRules = () => {
  const emailRule = (value: string) => {
    if (!value) return 'Введите почту'

    if (!isEmail(value)) return 'Введите корректную почту'

    if (value.length > 300) return 'Почта должна быть не длиннее 300 символов'

    return true
  }

  const passwordRule = (value: string) => {
    if (!value) return 'Введите пароль'

    if (value.length < 8) return 'Пароль должен быть не менее 8 символов'

    if (value.length > 50) return 'Пароль должен быть не длиннее 50 символов'

    return true
  }

  const nameRule = (value: string) => {
    if (!value) return 'Введите имя'

    if (value.length < 2) return 'Имя должно содержать не менее 2 символов'

    if (value.length > 50) return 'Имя должно содержать не более 50 символов'

    return true
  }

  const agreementRule = (value: boolean) => {
    if (!value) return 'Вы должны принять соглашение на обработку данных'

    return true
  }

  const deleteUserRule = (value: boolean) => {
    if (!value) return 'Вы должны подтвердить удаление аккаунта'

    return true
  }

  return {
    emailRule,
    passwordRule,
    nameRule,
    agreementRule,
    deleteUserRule,
  }
}