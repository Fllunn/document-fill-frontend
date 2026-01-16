import TemplatesApi from "../../api/TemplatesApi";
import type { ITemplate } from "~/types/template.interface";

export function useUploadTemplate() {
  const state = useState<ITemplate | null>('templates', () => null)

  async function createFromFile(file: File, isSystem: boolean) {
    try {
      const res = await TemplatesApi.createFromFile(file, isSystem)

      if (res) {
        state.value = res
      }

      return true
    } catch (error) {
      console.error('Error uploading template:', error)
      
      return false
    }
  }

  return {
    state,
    createFromFile
  }
}