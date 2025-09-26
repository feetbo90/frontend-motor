<template>
  <div ref="formSection">
    <form @submit.prevent="handleSave">
      <ConfirmModal v-if="showConfirmModal" title="Hapus Item?"
        description="Apakah kamu yakin ingin menghapus item ini? Tindakan ini tidak bisa dibatalkan."
        confirmText="Delete" cancelText="Cancel" @confirm="handleConfirmDelete" @cancel="handleCancelDelete" />
      <FormSection title="Form Penjualan" description="Input data penjualan kontan, kredit, dan leasing"
        :class="{ 'highlight': highlightForm }">
        <!-- Slot untuk content -->
        <template #content>
          <div class="form-grid">
            <div class="date-fields">
              <FormSelect id="tahun" label="Tahun" v-model="salesData.tahun" placeholder="Pilih Tahun"
                :options="yearOptions" />
              <FormSelect id="bulan" label="Bulan" v-model="salesData.bulan" placeholder="Pilih Bulan"
                :options="monthOptions" />
            </div>
            <div class="form-fields">
              <FormField id="penjualan-kontan" label="Penjualan Kontan" type="number" v-model="salesData.kontan"
                placeholder="0" :error="errors.kontan" />
              <FormField id="penjualan-kredit" label="Penjualan Stok Kredit" type="number" v-model="salesData.kredit"
                placeholder="0" :error="errors.kredit" />
              <FormField id="penjualan-leasing" label="Penjualan Leasing" type="number" v-model="salesData.leasing"
                placeholder="0" :error="errors.leasing" />
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
            <SalesTable :current-page="currentPage" :page-size="pageSize" :entries="entries" @edit="editRow"
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
import SalesTable from '@/components/production/SalesTable.vue'
import { useDate } from '@/composables/useDate'
import { useNotification } from '@/composables/useNotification'
import { salesSchema, type SalesSchema } from '@/schemas/salesSchema'
import { deleteSales, getSales, postSales, putSales } from '@/services/salesService'
import { useAuthStore } from '@/stores/auth'
import { isGlobalLoading } from '@/stores/globalState'
import type { SalesData, SalesResponse } from '@/types/sales.type'
import { computed, onMounted, ref } from 'vue'
import ConfirmModal from '../ui/ConfirmModal.vue'

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

const errors = ref<Record<keyof SalesSchema, string>>({
  kontan: '',
  kredit: '',
  leasing: ''
})
// Local table state
const entries = ref<SalesResponse[]>([])
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

const fetchSales = async (page = 1) => {
  try {
    const user = authStore.user.value
    const branchId = user?.entity_id
    // getSales expects an object, not just branchId
    const apiData = await getSales({ page, branch_id: branchId })
    // apiData may not be an array, so ensure we access the correct property
    const items = Array.isArray(apiData?.data) ? apiData.data : []
    entries.value = items.map((item) => ({
      id: item.id,
      branch_id: String(item.branch_id),
      period_id: String(item.period_id),
      kontan: Number(item.kontan),
      kredit: Number(item.kredit),
      leasing: Number(item.leasing),
      jumlah: Number(item.jumlah),
      created_at: item.created_at,
      updated_at: item.updated_at,
      year: item.year ?? null,
      month: item.month ?? null,
      version: Number(item.version),
      is_active: Boolean(item.is_active)
    }))
    currentPage.value = apiData.currentPage;
    totalPages.value = apiData.totalPages;
    total.value = apiData.total;
  } catch {
    // Optional: alert('Gagal mengambil data penjualan!')
  } finally {
    isGlobalLoading.value = false
  }
};

onMounted(async () => {
  if (!authStore.user?.value) return
  isGlobalLoading.value = true
  fetchSales(currentPage.value)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchSales(page);
  }
};

function safeNumber(n: unknown): number {
  const num = typeof n === 'number' ? n : Number(n)
  return Number.isFinite(num) ? num : 0
}

function validateForm(): boolean {
  Object.assign(errors.value, { kontan: '', kredit: '', leasing: '' })

  const result = salesSchema.safeParse({
    kontan: safeNumber(salesData.value.kontan),
    kredit: safeNumber(salesData.value.kredit),
    leasing: safeNumber(salesData.value.leasing)
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
  const newItem: SalesData = {
    tahun: safeNumber(salesData.value.tahun),
    bulan: safeNumber(salesData.value.bulan),
    kontan: safeNumber(salesData.value.kontan),
    kredit: safeNumber(salesData.value.kredit),
    leasing: safeNumber(salesData.value.leasing)
  }
  try {
    const user = authStore.user.value
    const payload = {
      branch_id: Number(user?.entity_id ?? 0),
      year: newItem.tahun,
      month: newItem.bulan,
      period_id: 1,//TODO: delete nanti dihapus dari BE
      kontan: newItem.kontan,
      kredit: newItem.kredit,
      leasing: newItem.leasing,
      jumlah: newItem.kontan + newItem.kredit + newItem.leasing
    }
    if (isEditing.value && idSelected.value !== null) {
      notifySuccess({ title: 'Success Message', msg: 'Data penjualan berhasil diubah' })
      await putSales(idSelected.value, payload)
    } else {
      await postSales(payload)
      notifySuccess({ title: 'Success Message', msg: 'Data penjualan berhasil disimpan' })
    }
    fetchSales(currentPage.value) // refresh table
  } catch {
    handleReset()
    isGlobalLoading.value = false
  } finally {
    handleReset()
    isGlobalLoading.value = false
  }
}

function handleReset(): void {
  emit('update:modelValue', { ...defaultSalesData })
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
  emit('update:modelValue', {
    tahun: Number(row.year),
    bulan: Number(row.month),
    kontan: row.kontan,
    kredit: row.kredit,
    leasing: row.leasing
  });
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
      const data = await deleteSales(idSelected.value)
      notifySuccess({ title: 'Success Message', msg: data.message })
      fetchSales(currentPage.value) // refresh table
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
