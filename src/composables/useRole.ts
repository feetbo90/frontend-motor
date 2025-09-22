import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useRole() {
  const authStore = useAuthStore()

  // Get current user role
  const userRole = computed(() => {
    return authStore.user.value?.role || null
  })

  // Check if user has specific role
  const hasRole = (role: string): boolean => {
    return userRole.value === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: string[]): boolean => {
    return userRole.value ? roles.includes(userRole.value) : false
  }

  // Check if user can access route based on role
  const canAccessRoute = (allowedRoles: string[]): boolean => {
    return userRole.value ? allowedRoles.includes(userRole.value) : false
  }

  // Check if user can access specific path
  const canAccessPath = (path: string): boolean => {
    const role = userRole.value
    if (!role) return false

    const routeMap: Record<string, string[]> = {
      '/': ['unit', 'cabang', 'pusat'],
      '/komponen-produksi': ['unit'],
      '/komponen-beban': ['cabang'],
      '/laba-rugi': ['pusat'],
      '/cadangan-nilai-sisa': ['pusat'],
      '/sumber-daya': ['pusat'],
      '/kas-keuangan': ['pusat'],
      '/satuan-pengukuran': ['pusat']
    }

    const allowedRoles = routeMap[path]
    return allowedRoles ? allowedRoles.includes(role) : false
  }

  // Get available routes for current user role
  const getAvailableRoutes = () => {
    const role = userRole.value
    if (!role) return []

    const routeMap: Record<string, string[]> = {
      unit: ['/', '/komponen-produksi'],
      cabang: ['/', '/komponen-beban'],
      pusat: ['/', '/laba-rugi', '/cadangan-nilai-sisa', '/sumber-daya', '/kas-keuangan', '/satuan-pengukuran']
    }

    return routeMap[role] || []
  }

  return {
    userRole,
    hasRole,
    hasAnyRole,
    canAccessRoute,
    canAccessPath,
    getAvailableRoutes
  }
}
