<template>
  <div>
    <FormSection title="Barang PK Jaminan" description="Input data barang PK jaminan">
      <!-- Slot untuk content -->
      <template #content>
        <div class="form-grid ">
          <div class="date-fields">
            <FormSelect id="tahun" label="Tahun" v-model="pkColleteralGoods.tahun" placeholder="Pilih Tahun"
              :options="yearOptions" />
            <FormSelect id="bulan" label="Bulan" v-model="pkColleteralGoods.bulan" placeholder="Pilih Bulan"
              :options="monthOptions" />
          </div>
          <div class="form-fields">
            <FormField id="unit-awal-pk" label="Jumlah Unit Awal" type="number" v-model="pkColleteralGoods.unitAwal"
        placeholder="0" />
      <FormField id="pk-tambahan" label="PK Tambahan" type="number" v-model="pkColleteralGoods.pkTambahan"
        placeholder="0" />
      <FormField id="unit-terjual-pk" label="Unit Terjual" type="number" v-model="pkColleteralGoods.unitTerjual"
        placeholder="0" />
      <FormField id="unit-pk" label="Jumlah Unit PK" type="number" v-model="pkColleteralGoods.unitPK" placeholder="0" />
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

    <FormSection title="Daftar Sirkulasi Stock dan PK"
      description="Kumpulan item sirkulasi stock dan PK yang telah ditambahkan">
      <template #content>
        <PkColleteralGoodsTable :entries="entries" @edit="editRow" @delete="deleteRow" />
      </template>
    </FormSection>
  </div>
</template>

<script setup lang="ts">
import FormField from '@/components/FormField.vue'
import FormSection from '@/components/FormSection.vue'
import FormSelect from '@/components/FormSelect.vue'
import { useDate } from '@/composables/useDate'
import type { PkColleteralGoods } from '@/types/pk-colleteral-goods.types'
import { computed, ref } from 'vue'
import PkColleteralGoodsTable from './PkColleteralGoodsTable.vue'


type DataEntry = PkColleteralGoods & { id: number }

interface Props {
  modelValue: PkColleteralGoods
}

interface Emits {
  (e: 'update:modelValue', value: PkColleteralGoods): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const pkColleteralGoods = computed({
  get: () => props.modelValue,
  set: (value: PkColleteralGoods) => emit('update:modelValue', value)
})

// Use date composable
const { monthOptions, getYearOptions, getCurrentDate } = useDate()
const yearOptions = getYearOptions(5) // Current year ± 5 years
const currentDate = getCurrentDate()

// Set default values for current date
const defaultData = {
  ...getCurrentDate(),
  unitAwal: 0,
  pkTambahan: 0,
  unitTerjual: 0,
  unitPK: 0,
  tahun: currentDate.year,
  bulan: currentDate.month
}

// Local table state
const entries = ref<DataEntry[]>([])
const editingIndex = ref<number | null>(null)
let autoId = 1

const isEditing = computed(() => editingIndex.value !== null)

function safeNumber(n: unknown): number {
  const num = typeof n === 'number' ? n : Number(n)
  return Number.isFinite(num) ? num : 0
}

function handleSave(): void {
  const newItem: PkColleteralGoods = {
    tahun: safeNumber(pkColleteralGoods.value.tahun),
    bulan: safeNumber(pkColleteralGoods.value.bulan),
    unitAwal: safeNumber(pkColleteralGoods.value.unitAwal),
    pkTambahan: safeNumber(pkColleteralGoods.value.pkTambahan),
    unitTerjual: safeNumber(pkColleteralGoods.value.unitTerjual),
    unitPK: safeNumber(pkColleteralGoods.value.unitPK),
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
  emit('update:modelValue', { ...defaultData })
}

function editRow(index: number): void {
  const row = entries.value[index]
  if (!row) return
  editingIndex.value = index
  emit('update:modelValue', { tahun: row.tahun, bulan: row.bulan, unitAwal: row.unitAwal, pkTambahan: row.pkTambahan, unitTerjual: row.unitTerjual, unitPK: row.unitPK })
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
