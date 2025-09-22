import CashFlowView from '@/views/CashFlowView.vue'
import DashboardView from '@/views/DashboardView.vue'
import LoadComponentsView from '@/views/LoadComponentsView.vue'
import LoginView from '@/views/LoginView.vue'
import ProductionComponentView from '@/views/ProductionComponentView.vue'
import ProfitLostView from '@/views/ProfitLostView.vue'
import ResidualValueReserveView from '@/views/ResidualValueReserveView.vue'
import ResourcesView from '@/views/ResourcesView.vue'
import UnitOfMeasurementView from '@/views/UnitOfMeasurementView.vue'
import ExportImportView from '@/views/ExportImportView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Type definition untuk route meta
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    requiresAuth?: boolean
    breadcrumb?: string
    allowedRoles?: string[]
  }
}

const routes = [
  { 
    path: '/login', 
    name: 'login', 
    component: LoginView,
    meta: { title: 'Login', requiresAuth: false }
  },
  { 
    path: '/', 
    name: 'dashboard', 
    component: DashboardView,
    meta: { title: 'Dashboard', requiresAuth: true, allowedRoles: ['unit', 'cabang', 'pusat'] }
  },
  { 
    path: '/komponen-produksi', 
    name: 'komponen-produksi', 
    component: ProductionComponentView,
    meta: { title: 'Komponen Produksi', requiresAuth: true, allowedRoles: ['unit'] }
  },
  { 
    path: '/komponen-beban', 
    name: 'komponen-beban', 
    component: LoadComponentsView,
    meta: { title: 'Komponen Beban', requiresAuth: true, allowedRoles: ['cabang','unit'] }
  },
  { 
    path: '/laba-rugi', 
    name: 'laba-rugi', 
    component: ProfitLostView,
    meta: { title: 'Laba / Rugi / Surplus Devisit', requiresAuth: true, allowedRoles: ['cabang'] }
  },
  { 
    path: '/cadangan-nilai-sisa', 
    name: 'cadangan-nilai-sisa', 
    component: ResidualValueReserveView,
    meta: { title: 'Cadangan & Nilai Sisa ACC Penyusutan', requiresAuth: true, allowedRoles: ['cabang'] }
  },
  { 
    path: '/sumber-daya', 
    name: 'sumber-daya', 
    component: ResourcesView,
    meta: { title: 'Sumber Daya', requiresAuth: true, allowedRoles: ['unit','cabang'] }
  },
  { 
    path: '/kas-keuangan', 
    name: 'kas-keuangan', 
    component: CashFlowView,
    meta: { title: 'Kas & Keuangan', requiresAuth: true, allowedRoles: ['cabang'] }
  },
  { 
    path: '/satuan-pengukuran', 
    name: 'satuan-pengukuran', 
    component: UnitOfMeasurementView,
    meta: { title: 'Satuan Pengukuran', requiresAuth: true, allowedRoles: ['pusat'] }
  },
  { 
    path: '/export-import', 
    name: 'export-import', 
    component: ExportImportView,
    meta: { title: 'Export / Import', requiresAuth: true, allowedRoles: ['pusat','cabang','unit'] }
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

// Helper function untuk mendapatkan user role
const getUserRole = (): string | null => {
  const userData = localStorage.getItem('user_data')
  if (userData) {
    try {
      const user = JSON.parse(userData)
      return user?.role || null
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }
  return null
}

// Navigation guard untuk authentication dan role-based access
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = localStorage.getItem('auth_token') !== null
  const userRole = getUserRole()

  if (requiresAuth && !isAuthenticated) {
    // Redirect ke halaman login jika memerlukan auth tapi belum login
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    // Redirect ke dashboard jika sudah login tapi mencoba akses halaman login
    next('/')
  } else if (requiresAuth && isAuthenticated) {
    // Cek role-based access
    const allowedRoles = to.meta.allowedRoles
    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
      // Redirect ke dashboard jika role tidak diizinkan
      console.warn(`Access denied: User role '${userRole}' not allowed for route '${to.path}'`)
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

// Helper function untuk mendapatkan allowed roles dari route path
const getRouteAllowedRoles = (path: string): string[] | null => {
  const route = routes.find(r => r.path === path)
  return route?.meta?.allowedRoles || null
}

// Export helper functions untuk digunakan di komponen lain
export { getUserRole, getRouteAllowedRoles }

export default router