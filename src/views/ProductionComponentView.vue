<template>
  <div class="section-content">

    <div class="content-card">
      <div class="tabs">
        <button v-for="tab in tabs" :key="tab.key" :class="['tab-button', { active: activeTab === tab.key }]"
          @click="setTab(tab.key)">
          <i :class="tab.icon"></i>
          {{ tab.label }}
        </button>
      </div>
      <div class="tab-content">
        <!-- Penjualan -->
        <div v-if="activeTab === 'penjualan'" :key="activeTab">
          <SalesForm v-model="produksiData.penjualan" />
        </div>

        <!-- Pendapatan -->
        <div v-if="activeTab === 'pendapatan'" :key="activeTab">
          <IncomeForm />
        </div>

        <!-- Pendapatan Lain-lain -->
        <div v-if="activeTab === 'pendapatan-lain'" :key="activeTab">
          <OtherIncomeForm v-model="produksiData.pendapatanLain" />
        </div>

        <!-- Piutang & Pembiayaan -->
        <div v-if="activeTab === 'piutang'" :key="activeTab">
          <AccountReceivableForm v-model="produksiData.piutang" />
        </div>

        <!-- Sirkulasi Piutang -->
        <div v-if="activeTab === 'sirkulasi-piutang'" :key="activeTab">
          <AccountReceivableTurnoverForm v-model="produksiData.sirkulasiPiutang" />
        </div>

        <!-- Sirkulasi Stock dan PK -->
        <div v-if="activeTab === 'sirkulasi-stock'" :key="activeTab">
          <StockCirculationForm v-model="produksiData.sirkulasiStock" />
        </div>

        <!-- Barang PK Jaminan -->
        <div v-if="activeTab === 'barang-pk'" :key="activeTab">
          <PKColleteralGoodsForm v-model="produksiData.barangPK" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AccountReceivableForm from '@/components/production/AccountReceivableForm.vue'
import AccountReceivableTurnoverForm from '@/components/production/AccountReceivableTurnoverForm.vue'
import IncomeForm from '@/components/production/IncomeForm.vue'
import OtherIncomeForm from '@/components/production/OtherIncomeForm.vue'
import PKColleteralGoodsForm from '@/components/production/PKColleteralGoodsForm.vue'
import SalesForm from '@/components/production/SalesForm.vue'
import StockCirculationForm from '@/components/production/StockCirculationForm.vue'
import { produksiData } from '@/stores/globalState'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// const activeTab = ref('penjualan')

const tabs = [
  { key: 'penjualan', label: 'Penjualan', icon: 'fas fa-shopping-cart' },
  { key: 'pendapatan', label: 'Pendapatan', icon: 'fas fa-coins' },
  { key: 'pendapatan-lain', label: 'Pendapatan Lain', icon: 'fas fa-plus-circle' },
  { key: 'piutang', label: 'Piutang & Pembiayaan', icon: 'fas fa-file-invoice-dollar' },
  { key: 'sirkulasi-piutang', label: 'Sirkulasi Piutang', icon: 'fas fa-sync' },
  { key: 'sirkulasi-stock', label: 'Sirkulasi Stock', icon: 'fas fa-boxes' },
  { key: 'barang-pk', label: 'Barang PK', icon: 'fas fa-warehouse' }
]

// --- Ambil query param
const activeTab = ref(route.query.tab?.toString() || 'penjualan')

// --- Watch route supaya kalau query berubah, tab ikut berubah
watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab && typeof newTab === 'string') {
      activeTab.value = newTab
    }
  }
)

// --- Function klik tab -> update query param
function setTab(tabKey: string) {
  activeTab.value = tabKey
  router.replace({
    query: { ...route.query, tab: tabKey }
  })
}
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding: 1px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.tab-button {
  padding: 0.75rem 1rem;
  border: none;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tab-button:hover {
  background: #f8fafc;
  transform: translateY(-1px);
}

.tab-button.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  /* box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); */
}

.tab-content {
  min-height: 400px;
}
</style>