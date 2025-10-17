<template>
  <div ref="formSection">
    <form @submit.prevent="handleSave">
      <ConfirmModal v-if="showConfirmModal" title="Hapus Item?"
        description="Apakah kamu yakin ingin menghapus item ini? Tindakan ini tidak bisa dibatalkan."
        confirmText="Delete" cancelText="Cancel" @confirm="handleConfirmDelete" @cancel="handleCancelDelete" />
        <FormSection title="Data Pendapatan" description="Input data mark up dan pendapatan lainnya" :class="{ 'highlight': highlightForm }">
       
        <!-- Slot untuk content -->
        <template #content>
          <div class="form-grid">
            <div class="date-fields">
              <FormSelect id="tahun" label="Tahun" v-model="formData.year" placeholder="Pilih Tahun"
                :options="yearOptions" />
              <FormSelect id="bulan" label="Bulan" v-model="formData.month" placeholder="Pilih Bulan"
                :options="monthOptions" />
            </div>
            <div class="form-fields">
              <FormField id="markup-kontan" label="Mark Up Penjualan Kontan" type="number"
                v-model="formData.markup_kontan" placeholder="0" :error="errors.markupKontan" />
              <FormField id="markup-kredit" label="Mark Up Penjualan Kredit" type="number"
                v-model="formData.markup_kredit" placeholder="0" :error="errors.markupKredit" />
              <FormField id="jumlah-markup" label="Jumlah Mark Up" type="number"
                v-model="formData.markup_jumlah" placeholder="0" :error="errors.markupJumlah" />
              <FormField id="realisasi-bunga" label="Realisasi Bunga" type="number" v-model="formData.realisasi_bunga"
                placeholder="0" :error="errors.realisasiBunga" />
              <FormField id="diskon-bunga" label="Diskon Bunga" type="number" v-model="formData.diskon_bunga"
                placeholder="0" :error="errors.diskonBunga" />
              <FormField id="denda" label="Denda" type="number" v-model="formData.denda" placeholder="0" :error="errors.denda" />
              <FormField id="administrasi" label="Administrasi" type="number" v-model="formData.administrasi"
                placeholder="0" :error="errors.administrasi" />
              <FormField id="jumlah-pendapatan" label="Jumlah Pendapatan" type="number" v-model="formData.jumlah_pendapatan"
                placeholder="0" :error="errors.administrasi" />
            </div>
          </div>
        </template>

        <!-- Slot untuk footer -->
        <template #footer>
          <div class="footer-btn">
            <button class="btn btn-primary" type="submit"> <i class="fas" :class="isEditing ? 'fa-save' : 'fa-plus'" />
              {{
                isEditing ? 'Simpan Perubahan' : 'Tambah ke Daftar'
              }}</button>
            <button type="button" class="btn btn-reset" @click="handleReset"><i class="fas fa-rotate-left"></i>
              Reset</button>
            <button type="button" v-if="isEditing" class="btn btn-outline" @click="cancelEdit"><i
                class="fas fa-ban"></i> Batal
              Edit</button>
          </div>
        </template>
      </FormSection>

      <FormSection title="Daftar Penjualan" description="Kumpulan item penjualan yang telah ditambahkan">
        <template #content>
          <div class="list-table">
            <IncomeTable :current-page="currentPage" :page-size="pageSize" :entries="entries" @edit="editRow"
              @delete="deleteRow" />
            <!-- PAGINATION -->
            <div class="pagination">
              <button type="button" :class="['btn btn-reset', { disabled: currentPage === 1 }]"
                :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
                Prev
              </button>

              <span>Page {{ currentPage }} of {{ totalPages }}</span>

              <button type="button" :class="['btn btn-primary', { disabled: currentPage === totalPages }]"
                :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
                Next
              </button>
            </div>
          </div>
        </template>
      </FormSection>
    </form>
  </div>
</template>

<script setup lang="ts">
import FormField from '@/components/FormField.vue'
import FormSection from '@/components/FormSection.vue'
import FormSelect from '@/components/FormSelect.vue'
import { useDate } from '@/composables/useDate'
import { useNotification } from '@/composables/useNotification'
import { incomeSchema, type IncomeSchema } from '@/schemas/incomeSchema'
import { deleteIncome, getIncomeList, postIncome, putIncome } from '@/services/incomeService'
import { useAuthStore } from '@/stores/auth'
import { isGlobalLoading, produksiData } from '@/stores/globalState'
import type { IncomeData, IncomeFrm, IncomePayload } from '@/types/income.type'
import { computed, onMounted, ref } from 'vue'
import ConfirmModal from '../ui/ConfirmModal.vue'
import IncomeTable from './IncomeTable.vue'

interface Emits {
  (e: 'update:modelValue', value: IncomeFrm): void
}

const emit = defineEmits<Emits>()

// Local table state
const entries = ref<IncomeData[]>([])
const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);
const pageSize = ref(10) // default, nanti update dari API
const formSection = ref<HTMLElement | null>(null) // 👉 ref untuk form
const highlightForm = ref(false) // ✅ state untuk highlight
const isEditing = ref(false)
const idSelected = ref<number | null>(null)
const authStore = useAuthStore()
const { notifySuccess } = useNotification()
const showConfirmModal = ref(false)

const formData = computed({
  get: () => produksiData.value.pendapatan,
  set: (value: IncomePayload) => emit('update:modelValue', value)
})

const { monthOptions, getYearOptions, getCurrentDate } = useDate()
const yearOptions = getYearOptions(5) // Current year ± 5 years
const user = authStore.user.value
const branchId = user?.entity_id

// Set default values for current date
const defaultSalesData:IncomeFrm= {
  ...getCurrentDate(),
  markup_kontan: 0,
  markup_kredit: 0,
  markup_jumlah:0,
  realisasi_bunga: 0,
  diskon_bunga: 0,
  denda: 0,
  administrasi: 0,
  jumlah_pendapatan: 0,
}
  
const errors = ref<Record<keyof IncomeSchema, string>>({
  markupKontan: '',
  markupKredit: '',
  markupJumlah:'',
  realisasiBunga: '',
  diskonBunga: '',
  denda: '',
  administrasi: '',
  jumlahPendapatan:''
})


const fetchList = async (page = 1) => {
  try {
   
    // getSales expects an object, not just branchId
    const apiData = await getIncomeList({ page, branch_id: branchId })
    // apiData may not be an array, so ensure we access the correct property
    const items = Array.isArray(apiData?.data) ? apiData.data : []
    entries.value =items
    currentPage.value = apiData.meta.currentPage;
    totalPages.value = apiData.meta.totalPages;
    total.value = apiData.meta.total;
  } catch {
    // Optional: alert('Gagal mengambil data penjualan!')
  } finally {
    isGlobalLoading.value = false
  }
};

onMounted(async () => {
  if (!authStore.user?.value) return
  emit('update:modelValue', { ...defaultSalesData })
  isGlobalLoading.value = true
  fetchList(currentPage.value)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchList(page);
  }
};

function safeNumber(n: unknown): number {
  const num = typeof n === 'number' ? n : Number(n)
  return Number.isFinite(num) ? num : 0
}

function validateForm(): boolean {
  // Object.assign(errors.value, { kontan: '', kredit: '', leasing: '' })

  const result = incomeSchema.safeParse({
    markupKontan: safeNumber(formData.value.markup_kontan),
    markupKredit: safeNumber(formData.value.markup_kredit),
    markupJumlah: safeNumber(formData.value.markup_jumlah),
    realisasiBunga: safeNumber(formData.value.realisasi_bunga),
    diskonBunga: safeNumber(formData.value.diskon_bunga),
    administrasi: safeNumber(formData.value.administrasi),
    denda: safeNumber(formData.value.denda),
    jumlahPendapatan: safeNumber(formData.value.jumlah_pendapatan),
  })

  if (!result.success) {
    result.error.issues.forEach((err) => {
      const field = err.path[0] as keyof typeof errors.value
      errors.value[field] = err.message
    })
    return false
  }
  return true
}

async function handleSave(): Promise<void> {
  // ✅ Validasi dulu
  const isValid = validateForm()
  if (!isValid) return  // ✅ stop kalau invalid

  isGlobalLoading.value = true
  try {
    const payload:IncomePayload = {
      branch_id:Number(branchId),
     ...formData.value
    }
    if (isEditing.value && idSelected.value !== null) {
      await putIncome(idSelected.value, payload)
    } else {
      await postIncome(payload)
    }
    fetchList(currentPage.value) // refresh table
  } catch {
    handleReset()
    isGlobalLoading.value = false
  } finally {
    handleReset()
    isGlobalLoading.value = false
  }
}

function handleReset(): void {
  produksiData.value.pendapatan =  {...defaultSalesData}
  // emit('update:modelValue', { ...defaultSalesData })
  isEditing.value = false
  idSelected.value = null
}

function editRow(id: number): void {
  if (!id) return // jaga-jaga id tidak valid
  const row = entries.value.find(item => Number(item.id) ===  Number(id) );
  if (!row) return;
  isEditing.value = true
  idSelected.value = id
  // ✅ Aktifkan highlight
  highlightForm.value = true
  // Matikan highlight setelah 1.5 detik
  setTimeout(() => {
    highlightForm.value = false
  }, 1500)


  // Scroll ke form dengan offset
  if (formSection.value) {
    const top = formSection.value.getBoundingClientRect().top + window.scrollY
    const offset = 80 // ganti sesuai tinggi header
    window.scrollTo({
      top: top - offset,
      behavior: 'smooth'
    })
  }
  produksiData.value.pendapatan = {
    markup_kontan: Number(row.markup_kontan),
    markup_kredit: Number(row.markup_kredit),
    markup_jumlah: Number(row.markup_jumlah),
    realisasi_bunga: Number(row.realisasi_bunga),
    diskon_bunga: Number(row.diskon_bunga),
    denda: Number(row.denda),
    administrasi: Number(row.administrasi),
    jumlah_pendapatan: Number(row.jumlah_pendapatan),
    year: row.year,
    month: row.month
  }
}

function cancelEdit(): void {
  isEditing.value = false;
  handleReset()
}

function deleteRow(id: number): void {
  if (!id) return // jaga-jaga id tidak valid
  const row = entries.value.find(item =>  Number(item.id) ===  Number(id) );
  if (!row) return;
  idSelected.value = id
  showConfirmModal.value = true
}

async function handleConfirmDelete(): Promise<void> {
  if (idSelected.value !== null) {
    try {
      const data = await deleteIncome(idSelected.value)
      notifySuccess({ title: 'Success Message', msg: data.message||'' })
      fetchList(currentPage.value) // refresh table
    } catch {
      isGlobalLoading.value = false
      idSelected.value = null
      showConfirmModal.value = false
    } finally {
      isGlobalLoading.value = false
      idSelected.value = null
      showConfirmModal.value = false
    }
  }
}

function handleCancelDelete() {
  handleReset()
  showConfirmModal.value = false
}
</script>

<style scoped>
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 1rem;
}

.list-table {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

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
