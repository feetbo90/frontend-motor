<template>
  <div class="container">
    <header class="page-header">
      <div class="title-group">
        <h1>Data Ekspor & Impor</h1>
        <p class="subtitle">Kelola data dengan mudah menggunakan export dan impor JSON.</p>
      </div>
      <div class="actions">
        <button class="btn btn-reset btn-sm" @click="resetDates">
          <i class="fas fa-rotate"></i>
          Reset
        </button>
        <button class="btn btn-outline btn-sm" @click="handleExport">
          <i class="fas fa-file-export"></i>
          Ekspor JSON
        </button>
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <div class="card-header">
          <h2>Periode</h2>
          <div class="chips">
            <button
              v-for="preset in presets"
              :key="preset.key"
              class="chip"
              :class="{ active: activePreset === preset.key }"
              @click="selectPreset(preset.key)"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Dari Tanggal</label>
            <div class="date-input" :class="{ invalid: isRangeInvalid, 'has-clear': !!startDate }">
              <i class="fas fa-calendar-alt"></i>
              <input type="date" v-model="startDate" @change="activePreset = 'custom'" :max="endDate || undefined" />
              <button v-if="startDate" class="clear-btn" type="button" @click="startDate = ''" aria-label="Clear start date">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div class="form-group">
            <label>Sampai Tanggal</label>
            <div class="date-input" :class="{ invalid: isRangeInvalid, 'has-clear': !!endDate }">
              <i class="fas fa-calendar-alt"></i>
              <input type="date" v-model="endDate" @change="activePreset = 'custom'" :min="startDate || undefined" />
              <button v-if="endDate" class="clear-btn" type="button" @click="endDate = ''" aria-label="Clear end date">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
        <p v-if="isRangeInvalid" class="error">Rentang tanggal tidak valid. "Dari" harus ≤ "Sampai".</p>
        <p class="hint">Export menyertakan metadata filter dan rentang tanggal yang dipilih.</p>
      </div>

      <div
        class="card"
      >
        <div class="card-header">
          <h2>Import</h2>
        </div>
        <div class="dropzone-body dropzone" 
         :class="{ dragging: isDragging }"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop" @click="openFilePicker">
          <i class="fas fa-cloud-upload-alt"></i>
          <p>Tarik & letakkan file JSON di sini, atau klik untuk memilih</p>
          <small v-if="selectedFileName">Filename: {{ selectedFileName }}</small>
        </div>
        <input ref="fileInput" class="hidden-input" type="file" accept="application/json" @change="handleFileChange" />
        <div class="footer-btn" style="flex:1;">
          <button class="btn btn-primary" style="flex:1;" :disabled="!importText" @click="handleImport">
            <i class="fas fa-file-import"></i>
            Import JSON
          </button>
        </div>
        <transition name="fade">
          <p v-if="importError" class="error">{{ importError }}</p>
        </transition>
        <transition name="fade">
          <p v-if="importSuccess" class="success">Import berhasil.</p>
        </transition>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  selectedYear,
  selectedMonth,
  selectedCabang,
  selectedUnit,
  dashboardData,
  produksiData,
  bebanData
} from '@/stores/globalState'

const startDate = ref<string>('')
const endDate = ref<string>('')
const importText = ref<string>('')
const importError = ref<string>('')
const importSuccess = ref<boolean>(false)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFileName = ref<string>('')
const isDragging = ref<boolean>(false)

type PresetKey = 'today' | 'thisMonth' | 'last7' | 'custom'
const activePreset = ref<PresetKey>('thisMonth')
const presets: Array<{ key: PresetKey; label: string }> = [
  { key: 'today', label: 'Hari ini' },
  { key: 'last7', label: '7 hari' },
  { key: 'thisMonth', label: 'Bulan ini' },
  { key: 'custom', label: 'Custom' }
]
const isRangeInvalid = computed<boolean>(() => {
  if (!startDate.value || !endDate.value) return false
  return new Date(startDate.value) > new Date(endDate.value)
})

type ExportPayload = {
  meta: {
    exportedAt: string
    dateRange: { start: string | null; end: string | null }
    filters: {
      year: number
      month: number
      cabang: string
      unit: string
    }
    app: string
    version: number
  }
  data: {
    dashboardData: unknown
    produksiData: unknown
    bebanData: unknown
  }
}

const handleExport = () => {
  importSuccess.value = false
  importError.value = ''

  const payload: ExportPayload = {
    meta: {
      exportedAt: new Date().toISOString(),
      dateRange: {
        start: startDate.value || null,
        end: endDate.value || null
      },
      filters: {
        year: selectedYear.value,
        month: selectedMonth.value,
        cabang: selectedCabang.value,
        unit: selectedUnit.value
      },
      app: 'cv-pandu-motor-FE',
      version: 1
    },
    data: {
      dashboardData: dashboardData.value,
      produksiData: produksiData.value,
      bebanData: bebanData.value
    }
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const start = startDate.value ? startDate.value : 'any'
  const end = endDate.value ? endDate.value : 'any'
  a.href = url
  a.download = `export_${start}_to_${end}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const handleFileChange = (e: Event) => {
  importError.value = ''
  importSuccess.value = false
  const input = e.target as HTMLInputElement
  const file = input.files && input.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    importText.value = String(reader.result || '')
    selectedFileName.value = file.name
  }
  reader.readAsText(file)
}

const handleImport = () => {
  importError.value = ''
  importSuccess.value = false
  if (!importText.value) return
  try {
    const parsed = JSON.parse(importText.value)
    if (!parsed || typeof parsed !== 'object' || !parsed.data) {
      throw new Error('Format file tidak valid')
    }

    // Optional: basic schema checks
    if (parsed.meta?.app !== 'cv-pandu-motor-FE') {
      console.warn('File dari aplikasi berbeda, melanjutkan dengan kehati-hatian')
    }

    // Update stores dengan aman
    if (parsed.data.dashboardData) {
      dashboardData.value = { ...dashboardData.value, ...parsed.data.dashboardData }
    }
    if (parsed.data.produksiData) {
      produksiData.value = { ...produksiData.value, ...parsed.data.produksiData }
    }
    if (parsed.data.bebanData) {
      bebanData.value = { ...bebanData.value, ...parsed.data.bebanData }
    }

    // Optional: set filters from meta
    if (parsed.meta?.filters) {
      selectedYear.value = Number(parsed.meta.filters.year) || selectedYear.value
      selectedMonth.value = Number(parsed.meta.filters.month) || selectedMonth.value
      selectedCabang.value = String(parsed.meta.filters.cabang ?? selectedCabang.value)
      selectedUnit.value = String(parsed.meta.filters.unit ?? selectedUnit.value)
    }

    importSuccess.value = true
  } catch (error: unknown) {
    importError.value = error instanceof Error ? error.message : 'Gagal mengimpor file'
  }
}

const resetDates = () => {
  selectPreset('thisMonth')
}

const selectPreset = (key: PresetKey) => {
  activePreset.value = key
  const now = new Date()
  if (key === 'today') {
    const iso = now.toISOString().slice(0, 10)
    startDate.value = iso
    endDate.value = iso
  } else if (key === 'last7') {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 6)
    startDate.value = start.toISOString().slice(0, 10)
    endDate.value = end.toISOString().slice(0, 10)
  } else if (key === 'thisMonth') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    startDate.value = start.toISOString().slice(0, 10)
    endDate.value = end.toISOString().slice(0, 10)
  } else {
    // custom
  }
}

const onDragOver = () => {
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  if (!e.dataTransfer || !e.dataTransfer.files?.length) return
  const file = e.dataTransfer.files[0]
  if (file && file.type === 'application/json') {
    const reader = new FileReader()
    reader.onload = () => {
      importText.value = String(reader.result || '')
      selectedFileName.value = file.name
    }
    reader.readAsText(file)
  } else {
    importError.value = 'File harus berformat JSON'
  }
}

const openFilePicker = () => {
  fileInput.value?.click()
}
</script>

<style scoped>
.container {
  /* max-width: 1100px; */
  /* margin: 0 auto; */
  margin:2rem;
  width:100%;
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

.actions { display: flex; gap: 0.5rem; }

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 960px) {
  .grid { grid-template-columns: 1fr 1fr; }
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

.chips { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.chip {
  border: 1px solid var(--gray-200);
  background: var(--gray-100);
  color: var(--gray-700);
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  cursor: pointer;
  transition: all .2s ease;
}
.chip:hover { background: #eef2ff; border-color: #c7d2fe; color: #4338ca; }
.chip.active { background: #e0e7ff; border-color: #818cf8; color: #3730a3; }

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.date-input {
  display: grid;
  grid-template-columns: 1.25rem 1fr;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--gray-200);
  background: white;
  border-radius: 12px;
  padding: 0.35rem 0.5rem 0.35rem 0.6rem;
}
.date-input.has-clear { grid-template-columns: 1.25rem 1fr 1.5rem; }
.date-input input[type="date"] {
  border: none;
  outline: none;
  background: transparent;
  padding: 0.35rem 0.25rem;
}
.date-input.invalid {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
}
.date-input i { color: #6366f1; }
.clear-btn {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--gray-500);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
}
.clear-btn:hover { background: var(--gray-100); color: var(--gray-700); }

.hint {
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.dropzone {
  background: var(--gray-50);
  transition: all .2s ease;
}
.dropzone.dragging { border-color: #818cf8; background: #eef2ff; }
.dropzone-body {
  border: 2px dashed var(--gray-300);
  text-align: center;
  border-radius: 16px;
  padding: 1.5rem 0.5rem;
  margin-bottom:1rem;
  color: var(--gray-600);
}
.dropzone-body i { font-size: 2rem; color: #818cf8; }

.hidden-input { display: none; }

.error { color: #b91c1c; margin-top: 0.5rem; }
.success { color: #065f46; margin-top: 0.5rem; }

.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

