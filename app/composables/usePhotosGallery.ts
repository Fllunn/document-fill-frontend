import { usePhotosApi } from "~/api/PhotosApi"
import type { IUpdatePhoto } from "~/types/photos/update-photo.interface"
import { toast } from "vue3-toastify"

export function usePhotosGallery() {
  const photos = ref<any[]>([])
  const loading = ref(false)
  const api = usePhotosApi()

  async function fetchPhotos() {
    loading.value = true

    try {
      photos.value = await api.getAll()
    } catch (e) {
      toast('Ошибка загрузки фотографий', { type: 'error' })
    } finally {
      loading.value = false
    }
  }

  async function deletePhoto(photoId: string) {
    try {
      await api.delete(photoId)
      photos.value = photos.value.filter(photo => photo.id !== photoId)
      toast('Фотография удалена', { type: 'success' })
      return true
    } catch (e) {
      toast('Ошибка удаления фотографии', { type: 'error' })
      return false
    }
  }

  async function updatePhotoName(photoId: string, name: string) {
    try {
      const data: IUpdatePhoto = { name }
      await api.update(photoId, data)

      const photo = photos.value.find(photo => photo.id === photoId)
      if (photo) {
        photo.name = name
      }
      toast('Название фотографии обновлено', { type: 'success' })
    } catch (e) {
      toast('Ошибка обновления названия фотографии', { type: 'error' })
    }
  }

  function addPhoto(photo: any) {
    photos.value.unshift(photo)
  }

  return {
    photos,
    loading,
    fetchPhotos,
    deletePhoto,
    updatePhotoName,
    addPhoto,
  }
}