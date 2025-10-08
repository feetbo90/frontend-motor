<template>
  <div class="container">
    <header class="page-header">
      <div class="title-group">
        <h1>Impor Data JSON</h1>
        <p class="subtitle">Kelola data dengan mudah menggunakan impor JSON.</p>
      </div>
    </header>

    <div class="card">
      <!-- <div class="card-header">
          <h2>Import File</h2>
        </div> -->
      <div class="dropzone-body dropzone" :class="{ dragging: isDragging }" @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave" @drop.prevent="onDrop" @click="openFilePicker">
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Tarik & letakkan file JSON di sini, atau klik untuk memilih</p>
        <small v-if="selectedFileName">Filename: {{ selectedFileName }}</small>
      </div>
      <input ref="fileInput" class="hidden-input" type="file" accept="application/json" @change="handleFileChange" />
      <div class="footer-btn" style="flex:1;">
        <button class="btn btn-primary" style="flex:1;" :disabled="!selectedFileName || !importText" @click="handleImport">
          <i class="fas fa-file-import"></i>
          Import JSON
        </button>
      </div>
      <transition name="fade">
        <p v-if="importError" class="error">{{ importError }}</p>
      </transition>
    </div>
  </div>

</template>

<script setup lang="ts">
import { useNotification } from '@/composables/useNotification'
import { postImport } from '@/services/exportService'
import { ref } from 'vue'

const importText = ref<string>('')
const importError = ref<string>('')
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFileName = ref<string>('')
const isDragging = ref<boolean>(false)
const { notifySuccess, notifyError } = useNotification()

const handleFileChange = (e: Event) => {
  importError.value = ''
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

const handleImport = async () => {
  importError.value = ''
  if (!importText.value || !selectedFileName.value) {
    notifyError({ title: 'Error', msg: 'Silakan pilih file JSON terlebih dahulu.' })
    return
  }

  try {
    const parsed = JSON.parse(importText.value)
    if (!parsed || typeof parsed !== 'object') {
      // throw new Error('Format file tidak valid')
      notifyError({ title: 'Error', msg: 'Format file tidak valid' })
      return
    }
    const blob = new Blob([importText.value], { type: 'application/json' })
    const file = new File([blob], selectedFileName.value || 'import.json', {
      type: 'application/json',
    })
    // ✅ Kirim data 
    const exportRes = await postImport(file)
    notifySuccess({ title: 'Information', msg: exportRes.message })
    importText.value = ''
    selectedFileName.value = ''
    if (fileInput.value) fileInput.value.value = '' 
  } catch (error: unknown) {
    console.error(error)
    selectedFileName.value = ''
    importText.value = ''
    if (fileInput.value) fileInput.value.value = '' 
    // importError.value = error instanceof Error ? error.message : 'Gagal mengimpor file'
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
  max-width: 70%;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
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
