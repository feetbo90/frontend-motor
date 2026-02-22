<template>
  <div class="sidebar" :class="{ 'filter-open': isFilterOpen }">
    <div class="sidebar-header">
      <div class="header-content">
        <div class="logo-wrapper">
          <i class="fas fa-chart-line"></i>
        </div>
        <h2>CV. Pandu Motor</h2>
        <p class="header-subtitle">Management System</p>
      </div>
      <div class="header-filter">
        <div class="period-filter" :class="{ collapsed: !isFilterOpen }">
          <button
            class="filter-header"
            type="button"
            @click="toggleFilters"
            :aria-expanded="isFilterOpen"
          >
            <div class="filter-heading">
              <i class="fas fa-filter"></i>
              <div>
                <h4>Filter Periode</h4>
                <p>Sesuaikan data laporan</p>
              </div>
            </div>
            <i class="fas" :class="isFilterOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </button>

          <transition name="collapse">
            <div v-show="isFilterOpen" class="filter-content">
              <!-- Filter Tahun - Tampilkan untuk semua halaman -->
              <div class="filter-group">
                <FormSelect
                  id="year"
                  label="Tahun"
                  v-model="selectedYear"
                  placeholder="Pilih Tahun"
                  :options="years"
                  :allowEmpty="true"
                />
              </div>
              
              <!-- Filter Bulan - Sembunyikan di halaman range-satuan-pengukuran -->
              <div v-if="!isRangeSatuanPengukuran" class="filter-group">
                <FormSelect
                  id="month"
                  label="Bulan"
                  v-model="selectedMonth"
                  placeholder="Pilih Bulan"
                  :options="months"
                  :allowEmpty="true"
                />
              </div>
              <div v-else class="filter-info">
                <p class="info-text">
                  <i class="fas fa-info-circle"></i>
                  Gunakan filter range bulan di halaman untuk memilih periode
                </p>
              </div>

              <div class="filter-group">
                <FormSelect
                  id="cabang"
                  label="Cabang"
                  v-model="selectedCabang"
                  placeholder="Pilih Cabang"
                  :options="cabangOptions"
                  :allowEmpty="true"
                />
              </div>

              <div class="filter-group">
                <FormSelect
                  id="unit"
                  label="Unit"
                  v-model="selectedUnit"
                  placeholder="Pilih Unit"
                  :options="unitOptions"
                  :allowEmpty="true"
                  :disabled="!selectedCabang"
                />
              </div>

              <button @click="resetFilters" class="reset-button" type="button">
                <i class="fas fa-redo"></i>
                <span>Reset Filter</span>
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <div class="sidebar-content">
      <nav class="sidebar-nav">
        <!-- <div class="nav-header">
        <i class="fas fa-bars"></i>
        <span>Menu Navigasi</span>
      </div> -->
        <ul>
          <!-- Dashboard - Available for all roles -->
          <li>
            <router-link to="/" class="nav-link" :class="{ active: $route.name === 'dashboard' }">
              <i class="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </router-link>
          </li>

          <!-- Komponen Produksi - Only for Unit role -->
          <li v-if="canAccessRoute('/komponen-produksi')">
            <router-link
              to="/komponen-produksi"
              class="nav-link"
              :class="{ active: $route.name === 'komponen-produksi' }"
            >
              <i class="fas fa-industry"></i>
              <span>Komponen Produksi</span>
            </router-link>
          </li>

          <!-- Komponen Beban - Only for Cabang role -->
          <li v-if="canAccessRoute('/komponen-beban')">
            <router-link
              to="/komponen-beban"
              class="nav-link"
              :class="{ active: $route.name === 'komponen-beban' }"
            >
              <i class="fas fa-credit-card"></i>
              <span>Komponen Beban</span>
            </router-link>
          </li>

          <!-- Laba / Rugi - Only for Pusat role -->
          <li v-if="canAccessRoute('/laba-rugi')">
            <router-link
              to="/laba-rugi"
              class="nav-link"
              :class="{ active: $route.name === 'laba-rugi' }"
            >
              <i class="fas fa-chart-pie"></i>
              <span>Laba / Rugi / Surplus Devisit</span>
            </router-link>
          </li>

          <!-- Cadangan & Nilai Sisa - Only for Pusat role -->
          <li v-if="canAccessRoute('/cadangan-nilai-sisa')">
            <router-link
              to="/cadangan-nilai-sisa"
              class="nav-link"
              :class="{ active: $route.name === 'cadangan-nilai-sisa' }"
            >
              <i class="fas fa-piggy-bank"></i>
              <span>Cadangan & Nilai Sisa ACC Penyusutan</span>
            </router-link>
          </li>

          <!-- Sumber Daya - Only for Pusat role -->
          <li v-if="canAccessRoute('/sumber-daya')">
            <router-link
              to="/sumber-daya"
              class="nav-link"
              :class="{ active: $route.name === 'sumber-daya' }"
            >
              <i class="fas fa-users"></i>
              <span>Sumber Daya</span>
            </router-link>
          </li>

          <!-- Kas & Keuangan - Only for Pusat role -->
          <li v-if="canAccessRoute('/kas-keuangan')">
            <router-link
              to="/kas-keuangan"
              class="nav-link"
              :class="{ active: $route.name === 'kas-keuangan' }"
            >
              <i class="fas fa-wallet"></i>
              <span>Kas & Keuangan</span>
            </router-link>
          </li>

          <!-- Satuan Pengukuran - Sub Menu (header sejajar dengan nav-link lain) -->
          <li v-if="canAccessRoute('/satuan-pengukuran') || canAccessRoute('/range-satuan-pengukuran') || canAccessRoute('/laporan')">
            <div class="nav-submenu" :class="{ 'is-open': openSubmenus['satuan-pengukuran'] }">
              <button
                type="button"
                class="nav-submenu-header nav-link-style"
                :class="{ active: isSatuanSubmenuActive }"
                @click="toggleSubmenu('satuan-pengukuran')"
                :aria-expanded="openSubmenus['satuan-pengukuran']"
              >
                <i class="fas fa-ruler-combined"></i>
                <span>Satuan Pengukuran</span>
                <i class="fas fa-chevron-down nav-submenu-arrow" :class="{ rotated: openSubmenus['satuan-pengukuran'] }"></i>
              </button>
              <transition name="submenu">
                <div v-show="openSubmenus['satuan-pengukuran']" class="nav-submenu-body">
                  <ul class="nav-submenu-list">
                    <li v-if="canAccessRoute('/satuan-pengukuran')">
                      <router-link
                        to="/satuan-pengukuran"
                        class="nav-submenu-link"
                        :class="{ active: $route.name === 'satuan-pengukuran' || $route.name === 'range-satuan-pengukuran' }"
                      >
                        <span class="nav-submenu-link-dot"></span>
                        <span>Satuan Pengukuran</span>
                      </router-link>
                    </li>
                    <li v-if="canAccessRoute('/laporan')">
                      <router-link
                        to="/laporan"
                        class="nav-submenu-link"
                        :class="{ active: $route.name === 'laporan' || $route.name === 'laporan-range' }"
                      >
                        <span class="nav-submenu-link-dot"></span>
                        <span>Laporan</span>
                      </router-link>
                    </li>
                  </ul>
                </div>
              </transition>
            </div>
          </li>

            <!-- Import with access -->
            <li v-if="canAccessRoute('/import')">
            <router-link
              to="/import"
              class="nav-link"
              :class="{ active: $route.name === 'import' }"
            >
              <i class="fas fa-file-import"></i>
              <span>Impor</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import {
  selectedCabang,
  selectedMonth,
  selectedYear,
  selectedUnit,
  selectedEntityId,
} from "@/stores/globalState";
import { useRole } from "@/composables/useRole";
import { useDate } from "@/composables/useDate";
import { getRouteAllowedRoles } from "@/router";
import FormSelect from "./FormSelect.vue";
import { getCabangs } from "@/services/entitiesService";
import { useAuthStore } from "@/stores/auth";
import type { Entities } from "@/types/entities.type";

// Router
const route = useRoute();

// Role-based navigation
const { hasRole } = useRole();

// Auth store
const authStore = useAuthStore();
const user = computed(() => authStore.user.value);

// Check if current route is range-satuan-pengukuran or laporan-range
const isRangeSatuanPengukuran = computed(() => {
  return route.name === 'range-satuan-pengukuran' || route.name === 'laporan-range';
});

// Submenu "Satuan Pengukuran" header active state
const isSatuanSubmenuActive = computed(() => {
  const name = route.name as string;
  return ['satuan-pengukuran', 'range-satuan-pengukuran', 'laporan', 'laporan-range'].includes(name);
});

// Helper function to check if user can access specific route
const canAccessRoute = (path: string): boolean => {
  const allowedRoles = getRouteAllowedRoles(path);
  if (!allowedRoles) return false;

  return allowedRoles.some((role) => hasRole(role));
};

// Use date composable
const { monthOptions: months, getYearOptions } = useDate();
const years = getYearOptions(5); // Current year ± 5 years

const allCabangsData = ref<Entities[]>([]);
const cabangs = ref<string[]>([]);
const cabangsData = ref<Entities[]>([]);
const isFilterOpen = ref(false);

// Sub menu state
const openSubmenus = ref<Record<string, boolean>>({
  'satuan-pengukuran': false,
  'laporan': false,
});

// Toggle sub menu
const toggleSubmenu = (menuKey: string) => {
  openSubmenus.value[menuKey] = !openSubmenus.value[menuKey];
};

// Auto-open submenu if current route matches
watch(
  () => route.name,
  (routeName) => {
    if (routeName === 'satuan-pengukuran' || routeName === 'range-satuan-pengukuran') {
      openSubmenus.value['satuan-pengukuran'] = true;
    }
    if (routeName === 'laporan' || routeName === 'laporan-range') {
      openSubmenus.value['laporan'] = true;
    }
  },
  { immediate: true }
);

// Computed property untuk filter cabang berdasarkan user.entity_id
const filteredCabangs = computed(() => {
  const currentUser = user.value;
  if (!currentUser || !allCabangsData.value.length) {
    return [];
  }

  // Jika user adalah PUSAT, tampilkan semua cabang
  if (currentUser.entity_type === "PUSAT" || !currentUser.entity_type) {
    return allCabangsData.value;
  }

  // Jika user adalah CABANG, tampilkan hanya cabang dengan id yang sama dengan user.entity_id
  if (currentUser.entity_type === "CABANG") {
    return allCabangsData.value.filter(
      (cabang: Entities) => cabang.id === String(currentUser.entity_id),
    );
  }

  // Jika user adalah UNIT, cari cabang parent dari unit tersebut
  if (currentUser.entity_type === "UNIT") {
    // Cari cabang yang memiliki unit dengan id yang sama dengan user.entity_id
    return allCabangsData.value.filter((cabang: Entities) => {
      return cabang.units?.some((unit: Entities) => unit.id === String(currentUser.entity_id));
    });
  }

  return [];
});

// Watch filteredCabangs untuk update cabangs dan cabangsData
watch(
  filteredCabangs,
  (filtered) => {
    cabangsData.value = filtered;
    cabangs.value = filtered.map((cabang: Entities) => cabang.name);
  },
  { immediate: true },
);

// Computed property untuk units berdasarkan selectedCabang
const units = computed(() => {
  if (!selectedCabang.value) {
    return [];
  }

  // Cari cabang yang dipilih dari data cabangs
  const selectedCabangData = cabangsData.value.find(
    (cabang: Entities) => cabang.name === selectedCabang.value,
  );

  // Jika cabang ditemukan dan memiliki units, return nama units
  if (selectedCabangData && selectedCabangData.units) {
    return selectedCabangData.units.map((unit: Entities) => unit.name);
  }

  return [];
});

// Computed property untuk cabang options (format untuk FormSelect)
const cabangOptions = computed(() => {
  return cabangs.value.map((cabang) => ({
    value: cabang,
    label: cabang,
  }));
});

// Computed property untuk unit options (format untuk FormSelect)
const unitOptions = computed(() => {
  return units.value.map((unit) => ({
    value: unit,
    label: unit,
  }));
});

// Watch selectedCabang untuk reset selectedUnit ketika cabang berubah
watch(selectedCabang, () => {
  selectedEntityId.value = Number(
    cabangsData.value.find((cabang) => cabang.name === selectedCabang.value)?.id || undefined,
  );
  selectedUnit.value = "";
  if (selectedCabang.value === "") {
    selectedEntityId.value = undefined;
  }
});

watch(selectedUnit, () => {
  if (selectedUnit.value === "" && selectedCabang.value !== "") {
    selectedEntityId.value = Number(
      cabangsData.value.find((cabang) => cabang.name === selectedCabang.value)?.id || undefined,
    );
  } else {
    const selected = cabangsData.value.find(
      (cabang: Entities) => cabang.name === selectedCabang.value,
    );
    if (selected?.units) {
      selectedEntityId.value = Number(
        selected.units.find((unit: Entities) => unit.name === selectedUnit.value)?.id || undefined,
      );
    }
  }
});

// Fetch cabangs from API
const fetchCabangs = async () => {
  try {
    const response = await getCabangs();
    if (response && response.data) {
      allCabangsData.value = response.data;
      // filteredCabangs computed akan otomatis update cabangs dan cabangsData
    }
  } catch (error) {
    console.error("Error fetching cabangs:", error);
    // Fallback to empty array on error
    allCabangsData.value = [];
    cabangs.value = [];
    cabangsData.value = [];
  }
};

// Fungsi untuk reset semua filter
const resetFilters = () => {
  selectedYear.value = "";
  // Hanya reset bulan jika bukan di halaman range-satuan-pengukuran
  if (!isRangeSatuanPengukuran.value) {
    selectedMonth.value = "";
  }
  selectedCabang.value = "";
  selectedUnit.value = "";
};

onMounted(() => {
  fetchCabangs();
});

const toggleFilters = () => {
  isFilterOpen.value = !isFilterOpen.value;
};
</script>

<style scoped>
.filter-year-month {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-bottom: 1rem;
}

.filter-info {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.info-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1.4;
}

.info-text i {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  width: 300px;
  flex-shrink: 0;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 4px 0 30px rgba(0, 0, 0, 0.15);
  padding-top: 0;
}

.sidebar-content {
  margin-top: 0;
  /* padding: 1rem 1.25rem 2.5rem; */
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.75rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 20;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  overflow: visible;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.logo-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.logo-wrapper:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.logo-wrapper i {
  font-size: 1.75rem;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  color: white;
}

.header-subtitle {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.header-filter {
  width: 100%;
}

.period-filter {
  text-align: left;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition:
    border-color 0.25s ease,
    background 0.25s ease;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  overflow: hidden;
}

.period-filter.collapsed {
  border-color: rgba(255, 255, 255, 0.12);
}

.filter-header {
  width: 100%;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: inherit;
  cursor: pointer;
  transition: background 0.25s ease;
}

.filter-header:focus,
.filter-header:focus-visible {
  outline: none;
  box-shadow: none;
}

.filter-header:hover {
  background: rgba(255, 255, 255, 0.12);
}

.filter-heading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: flex-start;
  text-align: left;
}

.filter-heading h4 {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.98);
}

.filter-heading p {
  margin: 0.15rem 0 0;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.filter-heading i {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.92);
}

.period-filter > .filter-header .fa-chevron-up,
.period-filter > .filter-header .fa-chevron-down {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.85);
  transition: transform 0.25s ease;
}

.filter-content {
  padding: 1.25rem 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-group {
  animation: fadeInUp 0.3s ease-out;
}

.filter-group:last-of-type {
  margin-bottom: 0.5rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.collapse-enter-active,
.collapse-leave-active {
  transition:
    height 0.25s ease,
    opacity 0.25s ease;
}

.collapse-enter-from,
.collapse-leave-to {
  height: 0;
  opacity: 0;
  overflow: hidden;
}

.sidebar-nav {
  margin: 0;
  padding: 0;
}

.nav-header {
  padding: 1rem 1.5rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.5rem;
}

.nav-header i {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  opacity: 0.8;
}

.nav-header span {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.sidebar-nav ul {
  list-style: none;
  margin: 0;
  padding: 1rem 0;
  padding-bottom: 2rem;
}

.sidebar-nav li {
  margin: 0.35rem 0.75rem;
}

/* Jarak setelah submenu (Satuan Pengukuran) dengan menu berikutnya (Impor) lebih rapat */
.sidebar-nav li:has(.nav-submenu) + li {
  margin-top: 0.2rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.25rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 3px solid transparent;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.nav-link span {
  flex: 1;
}

.nav-link::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: linear-gradient(180deg, #ffd700, #ffed4e);
  transform: scaleY(0);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: bottom;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
  transform: translateX(4px);
  border-left-color: rgba(255, 215, 0, 0.6);
}

.nav-link:hover::before {
  transform: scaleY(1);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.18);
  color: white;
  border-left-color: #ffd700;
  font-weight: 600;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.nav-link.active::before {
  transform: scaleY(1);
}

.nav-link i {
  width: 20px;
  text-align: center;
  font-size: 1.0625rem;
  opacity: 0.9;
  transition: all 0.25s ease;
}

.nav-link:hover i,
.nav-link.active i {
  opacity: 1;
  transform: scale(1.1);
}

:deep(.form-select) {
  background-color: rgba(255, 255, 255, 0.12) !important;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  color: rgba(255, 255, 255, 0.9);
}

:deep(.form-select:hover) {
  background-color: rgba(255, 255, 255, 0.18) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
}

:deep(.form-select:focus) {
  outline: none;
  background-color: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1) !important;
}

:deep(.form-label) {
  color: rgba(255, 255, 255, 0.95) !important;
  font-weight: 600 !important;
  font-size: 0.8125rem !important;
  margin-bottom: 0.5rem !important;
}

:deep(.form-select option) {
  background: #4a5568;
  color: white;
}

.reset-button {
  width: 100%;
  padding: 0.875rem 1rem;
  margin-top: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;
}

.reset-button span {
  flex: 1;
}

.reset-button::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition:
    width 0.4s ease,
    height 0.4s ease;
}

.reset-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.35);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.reset-button:hover::before {
  width: 300px;
  height: 300px;
}

.reset-button:active {
  transform: translateY(0);
}

.reset-button i {
  font-size: 0.875rem;
  transition: transform 0.3s ease;
}

.reset-button:hover i {
  transform: rotate(180deg);
}

/* Sub Menu — header sejajar dengan .nav-link */
.nav-submenu {
  margin: 0;
}

.nav-submenu-header.nav-link-style {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.25rem;
  color: rgba(255, 255, 255, 0.85);
  background: transparent;
  border: none;
  border-left: 3px solid transparent;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  position: relative;
  overflow: hidden;
}

.nav-submenu-header.nav-link-style span {
  flex: 1;
}

.nav-submenu-header.nav-link-style::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: linear-gradient(180deg, #ffd700, #ffed4e);
  transform: scaleY(0);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: bottom;
}

.nav-submenu-header.nav-link-style:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
  transform: translateX(4px);
  border-left-color: rgba(255, 215, 0, 0.6);
}

.nav-submenu-header.nav-link-style:hover::before {
  transform: scaleY(1);
}

.nav-submenu-header.nav-link-style.active {
  background: rgba(255, 255, 255, 0.18);
  color: white;
  border-left-color: #ffd700;
  font-weight: 600;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.nav-submenu-header.nav-link-style.active::before {
  transform: scaleY(1);
}

.nav-submenu-header.nav-link-style i:first-of-type {
  width: 20px;
  text-align: center;
  font-size: 1.0625rem;
  opacity: 0.9;
  transition: all 0.25s ease;
}

.nav-submenu-header.nav-link-style:hover i:first-of-type,
.nav-submenu-header.nav-link-style.active i:first-of-type {
  opacity: 1;
  transform: scale(1.1);
}

.nav-submenu-arrow {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-left: auto;
  transition: transform 0.3s ease;
}

.nav-submenu-arrow.rotated {
  transform: rotate(180deg);
}

.nav-submenu-body {
  overflow: hidden;
  padding-left: 1.8rem;
}

.nav-submenu-list {
  list-style: none;
  margin: 0 0 0 2.5rem;
  padding: 0 0 0 0.75rem;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  /* background-color: #4a5568; */
}

.nav-submenu-list li {
  margin: 0.25rem 0;
}

.nav-submenu-link {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  color: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease, background 0.2s ease;
  margin-left: -0.25rem;
}

.nav-submenu-link-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
  transition: background 0.2s ease, transform 0.2s ease;
}

.nav-submenu-link:hover {
  color: rgba(255, 255, 255, 0.95);
  background: rgba(255, 255, 255, 0.06);
}

.nav-submenu-link:hover .nav-submenu-link-dot {
  background: rgba(255, 215, 0, 0.8);
}

.nav-submenu-link.active {
  color: white;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
}

.nav-submenu-link.active .nav-submenu-link-dot {
  background: #ffd700;
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.25);
}

/* Submenu transition */
.submenu-enter-active,
.submenu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
