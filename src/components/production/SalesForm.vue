<template>
  <div>
    <FormSection title="Form Penjualan" description="Input data penjualan kontan, kredit, dan leasing">
      <!-- Slot untuk content -->
      <template #content>
        <div class="form-grid ">
          <div class="date-fields">
            <FormSelect id="tahun" label="Tahun" v-model="salesData.tahun" placeholder="Pilih Tahun"
              :options="yearOptions" />
            <FormSelect id="bulan" label="Bulan" v-model="salesData.bulan" placeholder="Pilih Bulan"
              :options="monthOptions" />
          </div>
          <div class="form-fields">
            <FormField id="penjualan-kontan" label="Penjualan Kontan" type="number" v-model="salesData.kontan"
              placeholder="0" />
            <FormField id="penjualan-kredit" label="Penjualan Stok Kredit" type="number" v-model="salesData.kredit"
              placeholder="0" />
            <FormField id="penjualan-leasing" label="Penjualan Leasing" type="number" v-model="salesData.leasing"
              placeholder="0" />
          </div>
        </div>
      </template>

      <!-- Slot untuk footer -->
      <template #footer>
        <div class="footer-btn">
          <button class="btn btn-primary" @click="handleSave"> <i class="fas"
              :class="isEditing ? 'fa-save' : 'fa-plus'" /> {{ isEditing ? 'Simpan Perubahan' : 'Tambah ke Daftar'
            }}</button>
          <button class="btn btn-reset" @click="handleReset"><i class="fas fa-rotate-left"></i> Reset</button>
          <button v-if="isEditing" class="btn btn-outline" @click="cancelEdit"><i class="fas fa-ban"></i> Batal
            Edit</button>
        </div>
      </template>
    </FormSection>

    <FormSection title="Daftar Penjualan" description="Kumpulan item penjualan yang telah ditambahkan">
      <template #content>
        <SalesTable :entries="entries" @edit="editRow" @delete="deleteRow" />
      </template>
    </FormSection>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import FormSection from '@/components/FormSection.vue'
import FormField from '@/components/FormField.vue'
import FormSelect from '@/components/FormSelect.vue'
import SalesTable from '@/components/production/SalesTable.vue'
import { useDate } from '@/composables/useDate'
import type { SalesData } from '@/types/sales.type'


type SalesEntry = SalesData & { id: number }

interface Props {
  modelValue: SalesData
}

interface Emits {
  (e: 'update:modelValue', value: SalesData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const salesData = computed({
  get: () => props.modelValue,
  set: (value: SalesData) => emit('update:modelValue', value)
})

// Use date composable
const { monthOptions, getYearOptions, getCurrentDate } = useDate()
const yearOptions = getYearOptions(5) // Current year ± 5 years
const currentDate = getCurrentDate()

// Set default values for current date
const defaultSalesData = {
  ...getCurrentDate(),
  kontan: 0,
  kredit: 0,
  leasing: 0,
  tahun: currentDate.tahun,
  bulan: currentDate.bulan
}

// Local table state
const entries = ref<SalesEntry[]>([])
const editingIndex = ref<number | null>(null)
let autoId = 1

const isEditing = computed(() => editingIndex.value !== null)

function safeNumber(n: unknown): number {
  const num = typeof n === 'number' ? n : Number(n)
  return Number.isFinite(num) ? num : 0
}

function handleSave(): void {
  const newItem: SalesData = {
    tahun: safeNumber(salesData.value.tahun),
    bulan: safeNumber(salesData.value.bulan),
    kontan: safeNumber(salesData.value.kontan),
    kredit: safeNumber(salesData.value.kredit),
    leasing: safeNumber(salesData.value.leasing)
  }

  if (isEditing.value && editingIndex.value !== null) {
    const idx = editingIndex.value
    entries.value[idx] = { ...entries.value[idx], ...newItem }
    editingIndex.value = null
  } else {
    entries.value.push({ id: autoId++, ...newItem })
  }

  handleReset()
}

function handleReset(): void {
  emit('update:modelValue', { ...defaultSalesData })
}

function editRow(index: number): void {
  const row = entries.value[index]
  if (!row) return
  editingIndex.value = index
  emit('update:modelValue', { tahun: row.tahun, bulan: row.bulan, kontan: row.kontan, kredit: row.kredit, leasing: row.leasing })
}

function cancelEdit(): void {
  editingIndex.value = null
  handleReset()
}

function deleteRow(index: number): void {
  const row = entries.value[index]
  if (!row) return
  const ok = window.confirm('Hapus item ini?')
  if (!ok) return
  entries.value.splice(index, 1)
  if (editingIndex.value !== null && index === editingIndex.value) {
    cancelEdit()
  }
}
</script>

<style scoped>
.footer-btn {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.footer-btn .btn {
  min-width: 140px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.footer-btn .btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.footer-btn .btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn-reset {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(100, 116, 139, 0.4);
}

.btn-reset:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(100, 116, 139, 0.6);
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.btn-outline:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

</style>
