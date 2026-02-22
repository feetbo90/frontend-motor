import type { User } from '@/types/auth-login.type'
import AuthView from '@/views/AuthView.vue'
import CashFlowView from '@/views/CashFlowView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ExportView from '@/views/ExportView.vue'
import ImportView from '@/views/ImportView.vue'
import LoadComponentsView from '@/views/LoadComponentsView.vue'
import ProductionComponentView from '@/views/ProductionComponentView.vue'
import ProfitLostView from '@/views/ProfitLostView.vue'
import ResidualValueReserveView from '@/views/ResidualValueReserveView.vue'
import ResourcesView from '@/views/ResourcesView.vue'
import UnitOfMeasurementView from '@/views/UnitOfMeasurementView.vue'
import LaporanView from '@/views/LaporanView.vue'
import { createRouter, createWebHistory } from 'vue-router'

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
    path: '/auth/:mode?',
    name: 'auth',
    component: AuthView,
  },
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { title: 'Dashboard', requiresAuth: true, allowedRoles: ['UNIT', 'CABANG', 'PUSAT'] }
  },
  {
    path: '/komponen-produksi',
    name: 'komponen-produksi',
    component: ProductionComponentView,
    meta: { title: 'Komponen Produksi', requiresAuth: true, allowedRoles: ['UNIT'] }
  },
  {
    path: '/komponen-beban',
    name: 'komponen-beban',
    component: LoadComponentsView,
    meta: { title: 'Komponen Beban', requiresAuth: true, allowedRoles: ['CABANG', 'UNIT'] }
  },
  {
    path: '/laba-rugi',
    name: 'laba-rugi',
    component: ProfitLostView,
    meta: { title: 'Laba / Rugi / Surplus Devisit', requiresAuth: true, allowedRoles: ['CABANG'] }
  },
  {
    path: '/cadangan-nilai-sisa',
    name: 'cadangan-nilai-sisa',
    component: ResidualValueReserveView,
    meta: { title: 'Cadangan & Nilai Sisa ACC Penyusutan', requiresAuth: true, allowedRoles: ['CABANG'] }
  },
  {
    path: '/sumber-daya',
    name: 'sumber-daya',
    component: ResourcesView,
    meta: { title: 'Sumber Daya', requiresAuth: true, allowedRoles: ['UNIT', 'CABANG'] }
  },
  {
    path: '/kas-keuangan',
    name: 'kas-keuangan',
    component: CashFlowView,
    meta: { title: 'Kas & Keuangan', requiresAuth: true, allowedRoles: ['CABANG'] }
  },
  {
    path: '/satuan-pengukuran',
    name: 'satuan-pengukuran',
    component: UnitOfMeasurementView,
    meta: { title: 'Satuan Pengukuran', requiresAuth: true, allowedRoles: ['UNIT', 'CABANG','PUSAT'] }
  },
  // {
  //   path: '/range-satuan-pengukuran',
  //   name: 'range-satuan-pengukuran',
  //   component: RangeUnitOfMeasurementView,
  //   meta: { title: 'Range Satuan Pengukuran', requiresAuth: true, allowedRoles: ['UNIT', 'CABANG','PUSAT'] }
  // },
  {
    path: '/export',
    name: 'export',
    component: ExportView,
    meta: { title: 'Data Ekspor', requiresAuth: true, allowedRoles: ['PUSAT', 'UNIT'] }
  },
  {
    path: '/import',
    name: 'import',
    component: ImportView,
    meta: { title: 'Data Impor', requiresAuth: true, allowedRoles: ['PUSAT', 'CABANG'] }
  },
  {
    path: '/laporan',
    name: 'laporan',
    component: LaporanView,
    meta: { title: 'Laporan', requiresAuth: true, allowedRoles: ['UNIT', 'CABANG', 'PUSAT'] }
  },
  // {
  //   path: '/laporan-range',
  //   name: 'laporan-range',
  //   component: LaporanRangeView,
  //   meta: { title: 'Laporan Range', requiresAuth: true, allowedRoles: ['UNIT', 'CABANG', 'PUSAT'] }
  // }
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
      const user: User = JSON.parse(userData)
      return user.entity_type && user.entity_type !== null ? user.entity_type : 'Pusat';
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
    next('/auth/login')
     return 
  }
  if (to.path.startsWith('/auth') && isAuthenticated) {
    // Redirect ke dashboard jika sudah login tapi mencoba akses halaman login
    next('/')
    return 
  }
  if (requiresAuth && isAuthenticated) {
    // Cek role-based access
    const allowedRoles = to.meta.allowedRoles
    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
      // Redirect ke dashboard jika role tidak diizinkan
      console.warn(`Access denied: User role '${userRole}' not allowed for route '${to.path}'`)
      next('/')
      return 
    }
  }
  next()
})

// Helper function untuk mendapatkan allowed roles dari route path
const getRouteAllowedRoles = (path: string): string[] | null => {
  const route = routes.find(r => r.path === path)
  return route?.meta?.allowedRoles || null
}

// Export helper functions untuk digunakan di komponen lain
export { getRouteAllowedRoles, getUserRole }

export default router