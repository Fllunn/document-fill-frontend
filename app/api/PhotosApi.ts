import type { ICreatePhoto } from "~/types/photos/create-photo.interface"
import type { IUpdatePhoto } from "~/types/photos/update-photo.interface"

export const usePhotosApi = () => {
  const { $apiFetch } = useNuxtApp()

  return {
    upload(file: File, photo: ICreatePhoto) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', photo.name)

      return $apiFetch<ICreatePhoto>('/photos/upload', { method: 'POST', body: formData })
    },

    getOne(photoId: string) {
      return $apiFetch(`/photos/${photoId}`, { method: 'GET' })
    },

    getAll() {
      return $apiFetch<any[]>('/photos', { method: 'GET' })
    },

    update(photoId: string, photo: IUpdatePhoto) {
      const { $apiFetch } = useNuxtApp()
      return $apiFetch(`/photos/${photoId}`, { method: 'PATCH', body: photo })
    },

    delete(photoId: string) {
      return $apiFetch(`/photos/${photoId}`, { method: 'DELETE' })
    }

  }
}
