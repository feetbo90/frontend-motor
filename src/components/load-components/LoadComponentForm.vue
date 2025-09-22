<template>
  <FormSection title="Data Beban Operasional" description="Input semua komponen beban perusahaan">
    <template #content>
      <div class="section-form">
      <div class="section-form-field">
        <!-- Fields for all roles -->
        <FormField id="gaji-insentif" label="Gaji/Insentif/Bonus" type="number" v-model="loadComponentData.gajiInsentif"
          placeholder="0" v-if="!isCabangRole" />
        <FormField id="beban-umum" label="Beban Umum Administrasi" type="number" v-model="loadComponentData.bebanUmum"
          placeholder="0" v-if="!isCabangRole" />
        <FormField id="beban-operasional" label="Beban Operasional" type="number"
          v-model="loadComponentData.bebanOperasional" placeholder="0" v-if="!isCabangRole" />
        <FormField id="jumlah-beban-umum-ops" label="Jumlah Beban Umum dan Operasional" type="number"
          v-model="loadComponentData.jumlahBebanUmumOps" placeholder="0" v-if="!isCabangRole" />
        
        <!-- Fields for Cabang role only -->
        <FormField id="beban-penyusutan" label="Beban Penyusutan Aktiva" type="number"
          v-model="loadComponentData.bebanPenyusutan" placeholder="0" v-if="isCabangRole" />
        <FormField id="cadangan-ph-stok" label="Cadangan PH Stok" type="number"
          v-model="loadComponentData.cadanganPHStok" placeholder="0" v-if="isCabangRole" />
        
        <!-- Fields for all roles except Cabang -->
        <FormField id="cadangan-ph-piutang" label="Cadangan PH Piutang" type="number"
          v-model="loadComponentData.cadanganPHPiutang" placeholder="0" v-if="!isCabangRole" />
      </div>
      <div class="total-summary" v-if="isCabangRole">
        <span class="total-label">Total Beban dan Biaya:</span>
        <span class="total-amount">{{ formatCurrency(calculatedTotal) }}</span>
      </div>
    </div>
    </template>

    <!-- Slot untuk footer -->
    <template #footer>
      <div class="footer-btn">
        <button class="btn btn-outline"> <i class="fas fa-save"></i> Simpan</button>
        <button class="btn btn-reset"><i class="fas fa-times-circle"></i> Reset</button>
      </div>
    </template>
  </FormSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FormSection from '@/components/FormSection.vue'
import FormField from '@/components/FormField.vue'
import { formatCurrency } from '@/stores/globalState'
import { useRole } from '@/composables/useRole'

interface LoadComponentData {
  gajiInsentif: number,
  bebanUmum: number,
  bebanOperasional: number,
  jumlahBebanUmumOps: number,
  bebanPenyusutan: number,
  cadanganPHPiutang: number,
  cadanganPHStok: number,
  totalBeban: number
}

interface Props {
  modelValue: LoadComponentData
}

interface Emits {
  (e: 'update:modelValue', value: LoadComponentData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Role-based access control
const { hasRole } = useRole()
const isCabangRole = computed(() => hasRole('cabang'))

const loadComponentData = computed({
  get: () => props.modelValue,
  set: (value: LoadComponentData) => emit('update:modelValue', value)
})

// Calculate total based on role
const calculatedTotal = computed(() => {
  if (isCabangRole.value) {
    // For Cabang role: only Beban Penyusutan Aktiva + Cadangan PH Stok
    return (loadComponentData.value.bebanPenyusutan || 0) + (loadComponentData.value.cadanganPHStok || 0)
  } else {
    // For other roles: all fields
    return (loadComponentData.value.gajiInsentif || 0) +
           (loadComponentData.value.bebanUmum || 0) +
           (loadComponentData.value.bebanOperasional || 0) +
           (loadComponentData.value.jumlahBebanUmumOps || 0) +
           (loadComponentData.value.bebanPenyusutan || 0) +
           (loadComponentData.value.cadanganPHPiutang || 0) +
           (loadComponentData.value.cadanganPHStok || 0)
  }
})
</script>
<style scoped>
.section-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-form-field {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.content-form {
  display: flex;
  flex-direction: column;
}

.total-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--gray-50);
  border-radius: var(--radius);
  border: 2px solid var(--primary-fallback);
}

.total-label {
  font-weight: 600;
  color: var(--gray-700);
  font-size: 1.125rem;
}

.total-amount {
  font-weight: 800;
  color: var(--primary-fallback);
  font-size: 1.25rem;
}
</style>
