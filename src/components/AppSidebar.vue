<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2>
        <i class="fas fa-chart-line"></i>
        CV. Pandu Motor
      </h2>
    </div>

    <div class="period-filter">
      <h4>Filter Periode</h4>
      <div class="filter-year-month">
        <div class="filter-group">
          <FormSelect id="year" label="Tahun" v-model="selectedYear" placeholder="Pilih Tahun" :options="years" :allowEmpty="true" />
        </div>
        <div class="filter-group">
          <FormSelect id="month" label="Bulan" v-model="selectedMonth" placeholder="Pilih Bulan" :options="months" :allowEmpty="true" />
        </div>
      </div>

      <div class="filter-group">
        <label>Cabang:</label>
        <select v-model="selectedCabang" class="form-select">
          <option value="">Pilih Cabang</option>
          <option v-for="cabang in cabangs" :key="cabang" :value="cabang">{{ cabang }}</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Unit:</label>
        <select v-model="selectedUnit" class="form-select">
          <option value="">Pilih Unit</option>
          <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
        </select>
      </div>
      
      <button @click="resetFilters" class="reset-button" type="button">
        <i class="fas fa-redo"></i>
        Reset Filter
      </button>
    </div>

    <nav class="sidebar-nav">
      <ul>
        <!-- Dashboard - Available for all roles -->
        <li>
          <router-link to="/" class="nav-link" :class="{ active: $route.name === 'dashboard' }">
            <i class="fas fa-tachometer-alt"></i>
            Dashboard
          </router-link>
        </li>

        <!-- Komponen Produksi - Only for Unit role -->
        <li v-if="canAccessRoute('/komponen-produksi')">
          <router-link to="/komponen-produksi" class="nav-link"
            :class="{ active: $route.name === 'komponen-produksi' }">
            <i class="fas fa-industry"></i>
            Komponen Produksi
          </router-link>
        </li>

        <!-- Komponen Beban - Only for Cabang role -->
        <li v-if="canAccessRoute('/komponen-beban')">
          <router-link to="/komponen-beban" class="nav-link" :class="{ active: $route.name === 'komponen-beban' }">
            <i class="fas fa-credit-card"></i>
            Komponen Beban
          </router-link>
        </li>

        <!-- Laba / Rugi - Only for Pusat role -->
        <li v-if="canAccessRoute('/laba-rugi')">
          <router-link to="/laba-rugi" class="nav-link" :class="{ active: $route.name === 'laba-rugi' }">
            <i class="fas fa-chart-pie"></i>
            Laba / Rugi / Surplus Devisit
          </router-link>
        </li>

        <!-- Cadangan & Nilai Sisa - Only for Pusat role -->
        <li v-if="canAccessRoute('/cadangan-nilai-sisa')">
          <router-link to="/cadangan-nilai-sisa" class="nav-link"
            :class="{ active: $route.name === 'cadangan-nilai-sisa' }">
            <i class="fas fa-piggy-bank"></i>
            Cadangan & Nilai Sisa ACC Penyusutan
          </router-link>
        </li>

        <!-- Sumber Daya - Only for Pusat role -->
        <li v-if="canAccessRoute('/sumber-daya')">
          <router-link to="/sumber-daya" class="nav-link" :class="{ active: $route.name === 'sumber-daya' }">
            <i class="fas fa-users"></i>
            Sumber Daya
          </router-link>
        </li>

        <!-- Kas & Keuangan - Only for Pusat role -->
        <li v-if="canAccessRoute('/kas-keuangan')">
          <router-link to="/kas-keuangan" class="nav-link" :class="{ active: $route.name === 'kas-keuangan' }">
            <i class="fas fa-wallet"></i>
            Kas & Keuangan
          </router-link>
        </li>

        <!-- Satuan Pengukuran - Only for Pusat role -->
        <li v-if="canAccessRoute('/satuan-pengukuran')">
          <router-link to="/satuan-pengukuran" class="nav-link"
            :class="{ active: $route.name === 'satuan-pengukuran' }">
            <i class="fas fa-ruler-combined"></i>
            Satuan Pengukuran
          </router-link>
        </li>

        <!-- Export with access -->
        <li v-if="canAccessRoute('/export')">
          <router-link to="/export" class="nav-link" :class="{ active: $route.name === 'export' }">
            <i class="fas fa-file-export"></i>
            Ekspor
          </router-link>
        </li>
        <!-- Import with access -->
        <li v-if="canAccessRoute('/import')">
          <router-link to="/import" class="nav-link" :class="{ active: $route.name === 'import' }">
            <i class="fas fa-file-import"></i>
            Impor
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { selectedCabang, selectedMonth, selectedYear, selectedUnit } from '@/stores/globalState'
import { useRole } from '@/composables/useRole'
import { useDate } from '@/composables/useDate'
import { getRouteAllowedRoles } from '@/router'
import FormSelect from './FormSelect.vue'
import { getCabangs } from '@/services/entitiesService'
import { useAuthStore } from '@/stores/auth'
import type { Entities } from '@/types/entities.type'

// Role-based navigation
const { hasRole } = useRole()

// Auth store
const authStore = useAuthStore()
const user = computed(() => authStore.user.value)

// Helper function to check if user can access specific route
const canAccessRoute = (path: string): boolean => {
  const allowedRoles = getRouteAllowedRoles(path)
  if (!allowedRoles) return false

  return allowedRoles.some(role => hasRole(role))
}

// Use date composable
const { monthOptions: months, getYearOptions } = useDate()
const years = getYearOptions(5) // Current year ± 5 years

const allCabangsData = ref<Entities[]>([])
const cabangs = ref<string[]>([])
const cabangsData = ref<Entities[]>([])

// Computed property untuk filter cabang berdasarkan user.entity_id
const filteredCabangs = computed(() => {
  const currentUser = user.value
  if (!currentUser || !allCabangsData.value.length) {
    return []
  }

  // Jika user adalah PUSAT, tampilkan semua cabang
  if (currentUser.entity_type === 'PUSAT' || !currentUser.entity_type) {
    return allCabangsData.value
  }

  // Jika user adalah CABANG, tampilkan hanya cabang dengan id yang sama dengan user.entity_id
  if (currentUser.entity_type === 'CABANG') {
    return allCabangsData.value.filter(
      (cabang: Entities) => cabang.id === String(currentUser.entity_id)
    )
  }

  // Jika user adalah UNIT, cari cabang parent dari unit tersebut
  if (currentUser.entity_type === 'UNIT') {
    // Cari cabang yang memiliki unit dengan id yang sama dengan user.entity_id
    return allCabangsData.value.filter((cabang: Entities) => {
      return cabang.units?.some((unit: Entities) => unit.id === String(currentUser.entity_id))
    })
  }

  return []
})

// Watch filteredCabangs untuk update cabangs dan cabangsData
watch(filteredCabangs, (filtered) => {
  cabangsData.value = filtered
  cabangs.value = filtered.map((cabang: Entities) => cabang.name)
}, { immediate: true })

// Computed property untuk units berdasarkan selectedCabang
const units = computed(() => {
  if (!selectedCabang.value) {
    return []
  }
  
  // Cari cabang yang dipilih dari data cabangs
  const selectedCabangData = cabangsData.value.find(
    (cabang: Entities) => cabang.name === selectedCabang.value
  )
  
  // Jika cabang ditemukan dan memiliki units, return nama units
  if (selectedCabangData && selectedCabangData.units) {
    return selectedCabangData.units.map((unit: Entities) => unit.name)
  }
  
  return []
})

// Watch selectedCabang untuk reset selectedUnit ketika cabang berubah
watch(selectedCabang, () => {
  selectedUnit.value = ''
})

// Fetch cabangs from API
const fetchCabangs = async () => {
  try {
    const response = await getCabangs()
    if (response && response.data) {
      allCabangsData.value = response.data
      // filteredCabangs computed akan otomatis update cabangs dan cabangsData
    }
  } catch (error) {
    console.error('Error fetching cabangs:', error)
    // Fallback to empty array on error
    allCabangsData.value = []
    cabangs.value = []
    cabangsData.value = []
  }
}

// Fungsi untuk reset semua filter
const resetFilters = () => {
  selectedYear.value = ''
  selectedMonth.value = ''
  selectedCabang.value = ''
  selectedUnit.value = ''
}

onMounted(() => {
  fetchCabangs()
})

</script>

<style scoped>
.filter-year-month {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1.5rem;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 300px;
  flex-shrink: 0;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  overflow-y: auto;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

/* Hide scrollbar for webkit browsers */
.sidebar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for Firefox */
.sidebar {
  scrollbar-width: none;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.period-filter {
  text-align: left;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.period-filter h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 500;
}

.filter-group {
  margin-bottom: 1rem;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  opacity: 0.9;
}

.form-select {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.875rem;
}

.form-select:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.2);
}

.form-select option {
  background: #4a5568;
  color: white;
}

.sidebar-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  padding-bottom: 32px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-left-color: #ffd700;
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-left-color: #ffd700;
  font-weight: 500;
}

.nav-link i {
  width: 18px;
  text-align: center;
}

:deep(.form-select) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  padding: 0.75rem 1rem;
  border: none !important;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

:deep(.form-label) {
  color: white !important;
}

:deep(.form-select) {
  color: #fafafa;
  /* warna placeholder awal */
}

/* Saat user sudah memilih (value != ""), ubah warna teks */
:deep(.form-select:not([value=""])) {
  color: white;
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.reset-button {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.reset-button:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

.reset-button:active {
  transform: translateY(0);
}

.reset-button i {
  font-size: 0.875rem;
}
</style>