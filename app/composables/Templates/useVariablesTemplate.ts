import TemplatesApi from "../../api/TemplatesApi";
import type { ITemplate } from "~/types/template.interface";
import type { VariablesState } from "~/types/state/template.interface";

export function useVariablesTemplate() {
  const state = useState<VariablesState>('template-variables', () => ({
    data: {} as Record<string, string[]>,
    loading: false,
    error: null
  }))

  async function getVariables(templateId: string) {
    state.value.loading = true // loading started
    state.value.error = null // reset previous errors

    try {
      const res = await TemplatesApi.getVariables(templateId)

      if (res) {
        state.value.data = res
      }

      return true
    } catch (error) {
      console.error('Error get variables:', error)
      state.value.error = 'Failed to load variables'

      return false
    } finally {
      state.value.loading = false // loading ended
    }
  }

  return {
    state,
    getVariables
  }
}