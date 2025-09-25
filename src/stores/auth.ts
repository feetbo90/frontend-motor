import type { User } from '@/types/auth-login.type'
import { ref, computed, readonly } from 'vue'

// State
const isAuthenticated = ref(false)
const user = ref<User | null>(null)
const token = ref<string | null>(localStorage.getItem('auth_token'))

// Getters
export const useAuthStore = () => {
  const isLoggedIn = computed(() => isAuthenticated.value && user.value !== null)

  // Actions
  const login = (userData: User & { token?: string; refreshToken?: string }) => {
    isAuthenticated.value = true
    user.value = userData
    // Simpan token ke localStorage
    if (userData.token) {
      token.value = userData.token
      localStorage.setItem('auth_token', userData.token)
    }
    localStorage.setItem('user_data', JSON.stringify(userData))
    if (userData.refreshToken) {
      localStorage.setItem('refresh_token', userData.refreshToken)
    }
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    token.value = null
    
    // Hapus data dari localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('refresh_token')
  }

  const checkAuth = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user_data')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      isAuthenticated.value = true
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      localStorage.setItem('user_data', JSON.stringify(user.value))
    }
  }
  const updateToken = (newToken: Partial<string>) => {
      token.value = newToken
      localStorage.setItem('auth_token', newToken)
  }

  return {
    // State
    isAuthenticated: readonly(isAuthenticated),
    user: readonly(user),
    token: readonly(token),
    
    // Getters
    isLoggedIn,
    
    // Actions
    login,
    logout,
    checkAuth,
    updateUser,
    updateToken
  }
}

// Initialize auth state on app start
export const initializeAuth = () => {
  const authStore = useAuthStore()
  authStore.checkAuth()
}
