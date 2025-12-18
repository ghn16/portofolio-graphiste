import { ref } from 'vue'
import { storageService } from '@/services/storageService'

export function useStorage() {
  const uploading = ref(false)
  const uploadProgress = ref(0)
  const error = ref(null)

  const uploadImage = async (file, workId) => {
    uploading.value = true
    error.value = null
    uploadProgress.value = 0

    try {
      const result = await storageService.uploadImage(file, workId)
      uploadProgress.value = 100
      return { success: true, data: result }
    } catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    } finally {
      uploading.value = false
    }
  }

  const deleteImage = async (path) => {
    try {
      await storageService.deleteImage(path)
      return { success: true }
    } catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    }
  }

  const addImageToWork = async (workId, imageUrl, storagePath, altText = '', isCover = false) => {
    try {
      const result = await storageService.addImageToWork(
        workId,
        imageUrl,
        storagePath,
        altText,
        isCover
      )
      return { success: true, data: result }
    } catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    }
  }

  const removeImageFromWork = async (imageId, storagePath) => {
    try {
      await storageService.removeImageFromWork(imageId, storagePath)
      return { success: true }
    } catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    }
  }

  return {
    uploading,
    uploadProgress,
    error,
    uploadImage,
    deleteImage,
    addImageToWork,
    removeImageFromWork
  }
}