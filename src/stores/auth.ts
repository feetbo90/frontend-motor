import { ref, computed, readonly } from 'vue'

interface User {
  email: string
  name: string
  role: string
  avatar?: string
}

interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

// State
const isAuthenticated = ref(false)
const user = ref<User | null>(null)
const token = ref<string | null>(localStorage.getItem('auth_token'))

// Getters
export const useAuthStore = () => {
  const isLoggedIn = computed(() => isAuthenticated.value && user.value !== null)

  // Actions
  const login = (userData: User) => {
    isAuthenticated.value = true
    user.value = userData
    
    // Simpan token ke localStorage
    const authToken = 'mock_token_' + Date.now()
    token.value = authToken
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('user_data', JSON.stringify(userData))
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    token.value = null
    
    // Hapus data dari localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
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
    updateUser
  }
}

// Initialize auth state on app start
export const initializeAuth = () => {
  const authStore = useAuthStore()
  authStore.checkAuth()
}
