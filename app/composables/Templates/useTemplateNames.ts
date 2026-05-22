import TemplatesApi from '~/api/TemplatesApi'

export function useTemplateNames() {
  const patterns = ref<string[]>([])

  async function load(templateId: string) {
    try {
      patterns.value = await TemplatesApi.getNames(templateId)
    } catch {
      patterns.value = []
    }
  }

  async function remove(templateId: string, pattern: string) {
    try {
      await TemplatesApi.removeSavedName(templateId, pattern)
      patterns.value = patterns.value.filter(p => p !== pattern)
    } catch {
    }
  }

  return { patterns, load, remove }
}
