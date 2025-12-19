import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import { useRouter } from 'vue-router'

const user = ref(null)
const loading = ref(false)

export function useAuth() {
  const router = useRouter()
  const isAuthenticated = computed(() => !!user.value)

  const signIn = async (email, password) => {
    loading.value = true
    try {
      const data = await authService.signIn(email, password)
      user.value = data.user
      router.push('/admin')
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      user.value = null
      router.push('/admin/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      user.value = currentUser
    } catch (error) {
      user.value = null
    }
  }

  const initAuth = () => {
    authService.onAuthStateChange((event, session) => {
      user.value = session?.user || null
    })
  }

  return {
    user,
    loading,
    isAuthenticated,
    signIn,
    signOut,
    checkAuth,
    initAuth
  }
}