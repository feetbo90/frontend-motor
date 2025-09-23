<template>
  <div>
  <FormSection title="Data Beban Operasional" description="Input semua komponen beban perusahaan">
      <!-- Slot untuk content -->
      <template #content>
        <div class="form-grid ">
          <div class="date-fields">
            <FormSelect id="tahun" label="Tahun" v-model="loadComponentData.tahun" placeholder="Pilih Tahun"
              :options="yearOptions" />
            <FormSelect id="bulan" label="Bulan" v-model="loadComponentData.bulan" placeholder="Pilih Bulan"
              :options="monthOptions" />
          </div>
          <div class="form-fields">
            <FormField id="gaji-insentif" label="Gaji/Insentif/Bonus" type="number"
              v-model="loadComponentData.gajiInsentif" placeholder="0" v-if="!isCabangRole" />
            <FormField id="beban-umum" label="Beban Umum Administrasi" type="number"
              v-model="loadComponentData.bebanUmum" placeholder="0" v-if="!isCabangRole" />
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

    <FormSection title="Daftar Beban Operasional"
      description="Kumpulan item beban operasional yang telah ditambahkan">
      <template #content>
        <LoadComponentTable :entries="entries" @edit="editRow" @delete="deleteRow" />
      </template>
    </FormSection>
  </div>
</template>

<script setup lang="ts">
import FormField from '@/components/FormField.vue'
import FormSection from '@/components/FormSection.vue'
import FormSelect from '@/components/FormSelect.vue'
import { useDate } from '@/composables/useDate'
import type { LoadComponentData } from '@/types/load-component.type'
import { computed, ref } from 'vue'
import LoadComponentTable from './LoadComponentTable.vue'
import { useRole } from '@/composables/useRole'


type DataEntry = LoadComponentData & { id: number }

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

// Use date composable
const { monthOptions, getYearOptions, getCurrentDate } = useDate()
const yearOptions = getYearOptions(5) // Current year ± 5 years
const currentDate = getCurrentDate()

// Set default values for current date
const defaultData = {
  ...getCurrentDate(),
  gajiInsentif: 0,
    bebanUmum: 0,
    bebanOperasional: 0,
    jumlahBebanUmumOps: 0,
    bebanPenyusutan: 0,
    cadanganPHPiutang: 0,
    cadanganPHStok: 0,
    totalBeban: 0,
  tahun: currentDate.tahun,
  bulan: currentDate.bulan
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
  const newItem: LoadComponentData = {
    tahun: safeNumber(loadComponentData.value.tahun),
    bulan: safeNumber(loadComponentData.value.bulan),
    gajiInsentif: safeNumber(loadComponentData.value.gajiInsentif),
    bebanUmum: safeNumber(loadComponentData.value.bebanUmum),
    bebanOperasional: safeNumber(loadComponentData.value.bebanOperasional),
    jumlahBebanUmumOps: safeNumber(loadComponentData.value.jumlahBebanUmumOps),
    bebanPenyusutan: safeNumber(loadComponentData.value.bebanPenyusutan),
    cadanganPHStok: safeNumber(loadComponentData.value.cadanganPHStok),
    cadanganPHPiutang: safeNumber(loadComponentData.value.cadanganPHPiutang),
    totalBeban: safeNumber(loadComponentData.value.totalBeban),
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
  emit('update:modelValue', { tahun: row.tahun, bulan: row.bulan, gajiInsentif: row.gajiInsentif, bebanUmum: row.bebanUmum, bebanOperasional: row.bebanOperasional, jumlahBebanUmumOps: row.jumlahBebanUmumOps,bebanPenyusutan: row.bebanPenyusutan,cadanganPHPiutang: row.cadanganPHPiutang,cadanganPHStok: row.cadanganPHStok,totalBeban: row.totalBeban })
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
