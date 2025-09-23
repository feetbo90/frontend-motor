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
        <label>Tahun:</label>
        <select v-model="selectedYear" class="form-select">
          <option disabled value="">Pilih Tahun</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Bulan:</label>
        <select v-model="selectedMonth" class="form-select">
          <option disabled value="">Pilih Bulan</option>
          <option v-for="(month, index) in months" :key="index" :value="index + 1">
            {{ month }}
          </option>
        </select>
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
          <router-link to="/komponen-produksi" class="nav-link" :class="{ active: $route.name === 'komponen-produksi' }">
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
          <router-link to="/cadangan-nilai-sisa" class="nav-link" :class="{ active: $route.name === 'cadangan-nilai-sisa' }">
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
          <router-link to="/satuan-pengukuran" class="nav-link" :class="{ active: $route.name === 'satuan-pengukuran' }">
            <i class="fas fa-ruler-combined"></i>
            Satuan Pengukuran
          </router-link>
        </li>
        
        <!-- Export / Import - For all roles with access -->
        <li v-if="canAccessRoute('/export-import')">
          <router-link to="/export-import" class="nav-link" :class="{ active: $route.name === 'export-import' }">
            <i class="fas fa-file-export"></i>
            Ekspor / Impor
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { selectedCabang, selectedMonth, selectedYear, selectedUnit } from '@/stores/globalState'
import { useRole } from '@/composables/useRole'
import { useDate } from '@/composables/useDate'
import { getRouteAllowedRoles } from '@/router'

// Role-based navigation
const { hasRole } = useRole()

// Helper function to check if user can access specific route
const canAccessRoute = (path: string): boolean => {
  const allowedRoles = getRouteAllowedRoles(path)
  if (!allowedRoles) return false
  
  return allowedRoles.some(role => hasRole(role))
}

// Use date composable
const { monthOptions, getYearOptions } = useDate()
const years = getYearOptions(5).map(option => option.value)
const months = monthOptions.map(option => option.label)

const cabangs = [
  'Cabang Kisaran', 'Cabang Aek Kanopan', 'Cabang Petatal'
]

const units = [
  'Unit A', 'Unit B', 'Unit C'
]

</script>

<style scoped>
.filter-year-month{
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
  width: 280px;
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
  text-align:left;
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
  padding-bottom:32px;
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
</style>