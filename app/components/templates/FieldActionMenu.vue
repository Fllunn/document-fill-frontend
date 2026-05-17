<script setup lang="ts">
import { toast } from 'vue3-toastify'
import { useFieldActions } from '~/composables/Templates/useFieldActions'

type Props = {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { declenseFio, numberToWords, insertDate } = useFieldActions()

const menu = ref(false)

function apply(result: string | false, errorMessage: string) {
  if (result === false) {
    toast(errorMessage, { type: 'error' })
    return
  }
  emit('update:modelValue', result)
  menu.value = false
  toast('Применено', { type: 'success' })
}

const fioItems = [
  { label: 'Родительный (кого?)', case: 'genitive' },
  { label: 'Дательный (кому?)', case: 'dative' },
  { label: 'Винительный (кого?)', case: 'accusative' },
  { label: 'Творительный (кем?)', case: 'instrumental' },
  { label: 'Предложный (о ком?)', case: 'prepositional' },
] as const

const dateItems = [
  { label: 'Сегодня (ДД.ММ.ГГГГ)', format: 'full' },
  { label: 'Сегодня, день', format: 'day' },
  { label: 'Сегодня, месяц', format: 'month' },
  { label: 'Сегодня, год', format: 'year' },
] as const
</script>

<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="end">
    <template #activator="{ props: menuProps }">
      <v-icon
        v-bind="menuProps"
        icon="mdi-menu"
        size="18"
        class="cursor-pointer text-medium-emphasis"
      />
    </template>

    <v-list density="compact" min-width="220">
      <v-list-group value="fio">
        <template #activator="{ props: groupProps }">
          <v-list-item v-bind="groupProps" prepend-icon="mdi-account-edit" title="Склонить ФИО" />
        </template>

        <v-list-item
          v-for="item in fioItems"
          :key="item.case"
          :title="item.label"
          class="pl-8"
          @click="apply(declenseFio(props.modelValue, item.case), 'Введите ФИО')"
        />
      </v-list-group>

      <v-list-item
        prepend-icon="mdi-numeric"
        title="Число прописью"
        @click="apply(numberToWords(props.modelValue), 'Введите число')"
      />

      <v-list-group value="date">
        <template #activator="{ props: groupProps }">
          <v-list-item v-bind="groupProps" prepend-icon="mdi-calendar" title="Вставить дату" />
        </template>

        <v-list-item
          v-for="item in dateItems"
          :key="item.format"
          :title="item.label"
          class="pl-8"
          @click="apply(insertDate(item.format), '')"
        />
      </v-list-group>
    </v-list>
  </v-menu>
</template>
