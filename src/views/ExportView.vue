<template>
  <div class="container">
    <header class="page-header">
      <div class="title-group">
        <h1>Data Ekspor Periode</h1>
        <p class="subtitle">Kelola data dengan mudah menggunakan export JSON.</p>
      </div>
    </header>

    <div class="card">
      <div class="card-header">
        <h2>Periode</h2>
      </div>
      <div class="form-row">
        <div class="form-group">
          <FormSelect id="tahun" label="Filter Type" v-model="filterType" placeholder="Pilih Tipe"
            style="margin-bottom: 8px;" :options="exportOptions" :error="exportErrorSelect" />

          <label>Filter Date</label>
          <div class="date-input" :class="{ invalid: exportError, 'has-clear': !!filterDate }">
            <i class="fas fa-calendar-alt"></i>
            <input type="month" v-model="filterDate" class="input"
              @change="filterDate = ($event.target as HTMLInputElement).value" />
            <button v-if="filterDate" class="clear-btn" type="button" @click="filterDate = ''"
              aria-label="Clear start date">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <p v-if="exportError" class="error">{{ exportError }}</p>
        </div>

        <div class="actions">
          <button type="button" class="btn btn-reset btn-sm" @click="resetDates">
            <i class="fas fa-rotate"></i>
            Reset
          </button>
          <button class="btn btn-outline btn-sm" @click="handleSubmit">
            <i class="fas fa-file-export"></i>
            Ekspor JSON
          </button>
        </div>
      </div>
      <p class="hint">Export menyertakan filter bulan dan tahun yang dipilih.</p>
    </div>
  </div>

</template>

<script setup lang="ts">
import FormSelect from '@/components/FormSelect.vue'
import { useNotification } from '@/composables/useNotification'
import { getExport } from '@/services/exportService'
import { ref } from 'vue'


const now = new Date()
const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1) // awal bulan ini
const filterType = ref<string>('all')
const filterDate = ref<string>(defaultStart.toISOString().slice(0, 7)) // format YYYY-MM
const exportError = ref<string>('')
const exportErrorSelect = ref<string>('')
const { notifyInfo } = useNotification()

const exportOptions = [
  {
    value: 'all',
    label: 'Semua'
  },
  {
    value: 'penjualan',
    label: 'Penjualan'
  },
  {
    value: 'pendapatan',
    label: 'Pendapatan'
  },

]

async function handleSubmit(): Promise<void> {
  exportError.value = ''   // reset pesan error
  exportErrorSelect.value = ''   // reset pesan error
  if (!filterDate.value) {
    exportError.value = 'Silakan pilih "Filter Date" sebelum mengekspor data.'
    return
  }
  if (!filterType.value) {
    exportErrorSelect.value = 'Silakan pilih "Filter Type" sebelum mengekspor data.'
    return
  }

  try {
    // Panggil API untuk ambil data
    const [year, month] = filterDate.value.split('-')
    const params = {
      year: Number(year),
      month: Number(month),
      type: filterType.value,
    }
    const exportRes = await getExport(params)
    const semuaKosong = Object.values(exportRes).every(arr => Array.isArray(arr) && arr.length === 0)
    if (semuaKosong) {
      notifyInfo({ title: 'Information', msg: 'Maaf, data yang di ekspor kosong!' })
      return
    }
    // Buat file JSON
    const blob = new Blob([JSON.stringify(exportRes, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const type = filterType.value ? filterType.value : 'any'
    const start = filterDate.value ? filterDate.value : 'any'
    a.href = url
    a.download = `export_${type}_${start}.json`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error(error)
  }
}
const resetDates = () => {
  filterDate.value = defaultStart.toISOString().slice(0, 7)
}

</script>

<style scoped>
.container {
  margin: 2rem;
  width: 100%;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 0.25rem;
  backdrop-filter: saturate(180%) blur(8px);
}

.title-group h1 {
  margin: 0;
  font-size: 1.75rem;
}

.subtitle {
  margin: 0.25rem 0 0;
  color: var(--gray-500);
  font-size: 0.95rem;
}

.actions {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 20%;
}

.card {
  background: #fff;
  padding: 1.25rem 1.25rem 1rem;
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.form-group {
  flex: 1;
}

.form-group p {
  border: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.input {
  width: 100%;
}

.date-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--gray-200);
  background: white;
  border-radius: 12px;
  padding: 0.35rem 0.5rem 0.35rem 0.6rem;
}

.date-input.has-clear {
  grid-template-columns: 1.25rem 1fr 1.5rem;
}

.date-input input[type="month"] {
  border: none;
  outline: none;
  background: transparent;
  padding: 0.35rem 0.25rem;
}

.date-input.invalid {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
}

.date-input i {
  color: #6366f1;
}

.clear-btn {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--gray-500);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
}

.clear-btn:hover {
  background: var(--gray-100);
  color: var(--gray-700);
}

.hint {
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.dropzone {
  background: var(--gray-50);
  transition: all .2s ease;
}

.dropzone.dragging {
  border-color: #818cf8;
  background: #eef2ff;
}

.dropzone-body {
  border: 2px dashed var(--gray-300);
  text-align: center;
  border-radius: 16px;
  padding: 1.5rem 0.5rem;
  margin-bottom: 1rem;
  color: var(--gray-600);
}

.dropzone-body i {
  font-size: 2rem;
  color: #818cf8;
}

.hidden-input {
  display: none;
}

.error {
  color: #b91c1c;
  margin-top: 0.5rem;
}

.success {
  color: #065f46;
  margin-top: 0.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
