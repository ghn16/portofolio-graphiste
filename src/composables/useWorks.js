import { ref, computed } from 'vue'
import { worksService } from '@/services/worksService'

export function useWorks(isAdmin = false) {
  const works = ref([])
  const currentWork = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const publishedWorks = computed(() => {
    return works.value.filter(w => w.status === 'published')
  })

  const draftWorks = computed(() => {
    return works.value.filter(w => w.status === 'draft')
  })

  const fetchWorks = async (categoryId = null) => {
    loading.value = true
    error.value = null
    try {
      if (isAdmin) {
        works.value = await worksService.getAll()
      } else {
        works.value = await worksService.getPublished(categoryId)
      }
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const fetchWorkBySlug = async (slug) => {
    loading.value = true
    error.value = null
    try {
      currentWork.value = await worksService.getBySlug(slug)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const fetchWorkById = async (id) => {
    loading.value = true
    error.value = null
    try {
      currentWork.value = await worksService.getById(id)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const createWork = async (workData) => {
    loading.value = true
    error.value = null
    try {
      const newWork = await worksService.create(workData)
      works.value.unshift(newWork)
      return { success: true, data: newWork }
    } catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    } finally {
      loading.value = false
    }
  }

  const updateWork = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      const updated = await worksService.update(id, updates)
      const index = works.value.findIndex(w => w.id === id)
      if (index !== -1) {
        works.value[index] = updated
      }
      return { success: true, data: updated }
    } catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    } finally {
      loading.value = false
    }
  }

  const deleteWork = async (id) => {
    loading.value = true
    error.value = null
    try {
      await worksService.delete(id)
      works.value = works.value.filter(w => w.id !== id)
      return { success: true }
    } catch (e) {
      error.value = e.message
      return { success: false, error: e.message }
    } finally {
      loading.value = false
    }
  }

  return {
    works,
    currentWork,
    publishedWorks,
    draftWorks,
    loading,
    error,
    fetchWorks,
    fetchWorkBySlug,
    fetchWorkById,
    createWork,
    updateWork,
    deleteWork
  }
}
