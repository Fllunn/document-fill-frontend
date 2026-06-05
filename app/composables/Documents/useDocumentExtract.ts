import { useDocumentApi } from '~/api/DocumentApi'
import type { VariablesState } from '~/types/state/template.interface'
import { toast } from 'vue3-toastify'

export const useDocumentExtract = () => {
  const api = useDocumentApi()
  const loading = ref(false)

  const variables = ref<VariablesState['data']>({})
  const initialValues = ref<Record<string, string>>({})
  const initialLoopValues = ref<Record<string, Record<string, string>[]>>({})
  const docName = ref('')

  async function extract(file: File): Promise<boolean> {
    loading.value = true
    try {
      const res = await api.extract(file)
      if (!res) return false

      docName.value = res.name

      const data: VariablesState['data'] = {}
      const vals: Record<string, string> = {}
      const loopVals: Record<string, Record<string, string>[]> = {}

      for (const [key, value] of Object.entries(res.values)) {
        if (Array.isArray(value)) {
          const category = key.endsWith('[]') ? key : `${key}[]`
          const vars = Object.keys(value[0] ?? {})

          data[category] = vars
          loopVals[category] = value.map(row =>
            Object.fromEntries(vars.map(v => [v, (row as Record<string, string>)[v] ?? '']))
          )
        } else if (key.includes('.')) {
          const dotIndex = key.indexOf('.')
          const category = key.slice(0, dotIndex)
          const variable = key.slice(dotIndex + 1)

          if (!data[category]) data[category] = []
          data[category].push(variable)
          vals[key] = (value as string) ?? ''
        } else {
          if (!data['Разное']) data['Разное'] = []
          data['Разное'].push(key)
          vals[`Разное.${key}`] = (value as string) ?? ''
        }
      }

      if (res.rawValues) {
        for (const [key, value] of Object.entries(res.rawValues)) {
          if (Array.isArray(value)) {
            const category = key.endsWith('[]') ? key : `${key}[]`
            const rows = loopVals[category]
            if (rows) {
              for (let i = 0; i < value.length; i++) {
                const rawRow = value[i] as Record<string, string> | undefined
                if (rawRow && rows[i]) {
                  for (const [field, formula] of Object.entries(rawRow)) {
                    if (formula) rows[i]![field] = formula
                  }
                }
              }
            }
          } else if (key.includes('.')) {
            if (key in vals) vals[key] = value as string
          } else {
            if (`Разное.${key}` in vals) vals[`Разное.${key}`] = value as string
          }
        }
      }

      variables.value = data
      initialValues.value = vals
      initialLoopValues.value = loopVals

      return true
    } catch {
      return false
    } finally {
      loading.value = false
    }
  }

  return { loading, extract, variables, initialValues, initialLoopValues, docName }
}
