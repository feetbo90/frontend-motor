<template>
  <div>
    <FormSection title="Data Pendapatan" description="Input data mark up dan pendapatan lainnya">
      <!-- Slot untuk content -->
      <template #content>
        <div class="form-grid ">
          <div class="date-fields">
            <FormSelect id="tahun" label="Tahun" v-model="incomeData.tahun" placeholder="Pilih Tahun"
              :options="yearOptions" />
            <FormSelect id="bulan" label="Bulan" v-model="incomeData.bulan" placeholder="Pilih Bulan"
              :options="monthOptions" />
          </div>
          <div class="form-fields">
            <FormField id="markup-kontan" label="Mark Up Penjualan Kontan" type="number"
              v-model="incomeData.markupKontan" placeholder="0" />
            <FormField id="markup-kredit" label="Mark Up Penjualan Kredit" type="number"
              v-model="incomeData.markupKredit" placeholder="0" />
            <FormField id="realisasi-bunga" label="Realisasi Bunga" type="number" v-model="incomeData.realisasiBunga"
              placeholder="0" />
            <FormField id="diskon-bunga" label="Diskon Bunga" type="number" v-model="incomeData.diskonBunga"
              placeholder="0" />
            <FormField id="denda" label="Denda" type="number" v-model="incomeData.denda" placeholder="0" />
            <FormField id="administrasi" label="Administrasi" type="number" v-model="incomeData.administrasi"
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

    <FormSection title="Daftar Pendapatan" description="Kumpulan item pendapatan yang telah ditambahkan">
      <template #content>
        <IncomeTable :entries="entries" @edit="editRow" @delete="deleteRow" />
      </template>
    </FormSection>
  </div>
</template>

<script setup lang="ts">
import FormField from '@/components/FormField.vue'
import FormSection from '@/components/FormSection.vue'
import FormSelect from '@/components/FormSelect.vue'
import { useDate } from '@/composables/useDate'
import type { IncomeData } from '@/types/income.type'
import { computed, ref } from 'vue'
import IncomeTable from './IncomeTable.vue'


type IncomeEntry = IncomeData & { id: number }

interface Props {
  modelValue: IncomeData
}

interface Emits {
  (e: 'update:modelValue', value: IncomeData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const incomeData = computed({
  get: () => props.modelValue,
  set: (value: IncomeData) => emit('update:modelValue', value)
})

// Use date composable
const { monthOptions, getYearOptions, getCurrentDate } = useDate()
const yearOptions = getYearOptions(5) // Current year ± 5 years
const currentDate = getCurrentDate()

// Set default values for current date
const defaultSalesData = {
  ...getCurrentDate(),
  markupKontan: 0,
  markupKredit: 0,
  realisasiBunga: 0,
  diskonBunga: 0,
  denda: 0,
  administrasi: 0,
  tahun: currentDate.tahun,
  bulan: currentDate.bulan
}

// Local table state
const entries = ref<IncomeEntry[]>([])
const editingIndex = ref<number | null>(null)
let autoId = 1

const isEditing = computed(() => editingIndex.value !== null)

function safeNumber(n: unknown): number {
  const num = typeof n === 'number' ? n : Number(n)
  return Number.isFinite(num) ? num : 0
}

function handleSave(): void {
  const newItem: IncomeData = {
    tahun: safeNumber(incomeData.value.tahun),
    bulan: safeNumber(incomeData.value.bulan),
    markupKontan: safeNumber(incomeData.value.markupKontan),
    markupKredit: safeNumber(incomeData.value.markupKredit),
    realisasiBunga: safeNumber(incomeData.value.realisasiBunga),
    diskonBunga: safeNumber(incomeData.value.diskonBunga),
    denda: safeNumber(incomeData.value.denda),
    administrasi: safeNumber(incomeData.value.administrasi)
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
  emit('update:modelValue', { tahun: row.tahun, bulan: row.bulan, markupKontan: row.markupKontan, markupKredit: row.markupKredit, realisasiBunga: row.realisasiBunga, diskonBunga: row.diskonBunga, denda: row.denda, administrasi: row.administrasi })
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
