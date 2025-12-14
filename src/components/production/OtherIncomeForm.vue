<template>
  <div ref="formSection">
    <form @submit.prevent="handleSave">
      <ConfirmModal v-if="showConfirmModal" title="Hapus Item?"
        description="Apakah kamu yakin ingin menghapus item ini? Tindakan ini tidak bisa dibatalkan."
        confirmText="Delete" cancelText="Cancel" @confirm="handleConfirmDelete" @cancel="handleCancelDelete" />
      <FormSection title="Pendapatan Lain-lain" description="Input data pendapatan lainnya"
        :class="{ 'highlight': highlightForm }">
        <!-- Slot untuk content -->
        <template #content>
          <div class="form-grid">
            <div class="date-fields">
              <FormSelect id="tahun" label="Tahun" v-model="formData.year" placeholder="Pilih Tahun"
                :options="yearOptions" />
              <FormSelect id="bulan" label="Bulan" v-model="formData.month" placeholder="Pilih Bulan"
                :options="monthOptions" />
            </div>
            <div class="form-table">
              <table class="data-input-table">
                <thead>
                  <tr>
                    <th class="field-header">Field Name</th>
                    <th class="value-header">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="table-row income-row">
                    <td class="field-label">
                      <label for="penjualan-pk">
                        <i class="fas fa-money-bill-wave icon"></i>
                        Penjualan PK
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField id="penjualan-pk" label="" type="number" v-model="formData.penjualan_pk"
                        placeholder="0" :error="errors.penjualanPk" />
                    </td>
                  </tr>
                  <tr class="table-row income-row">
                    <td class="field-label">
                      <label for="komisi">
                        <i class="fas fa-percent icon"></i>
                        Komisi
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField id="komisi" label="" type="number" v-model="formData.komisi" placeholder="0"
                        :error="errors.komisi" />
                    </td>
                  </tr>
                  <tr class="table-row penalty-row">
                    <td class="field-label">
                      <label for="denda-keterlambatan">
                        <i class="fas fa-clock icon"></i>
                        Denda Keterlambatan
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField id="denda-keterlambatan" label="" type="number"
                        v-model="formData.denda_keterlambatan" placeholder="0" :error="errors.dendaKeterlambatan" />
                    </td>
                  </tr>
                  <tr class="table-row penalty-row">
                    <td class="field-label">
                      <label for="diskon-denda">
                        <i class="fas fa-tag icon"></i>
                        Diskon Denda
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField id="diskon-denda" label="" type="number" v-model="formData.diskon_denda"
                        placeholder="0" :error="errors.diskonDenda" />
                    </td>
                  </tr>
                  <tr class="table-row total-row">
                    <td class="field-label">
                      <label for="jumlah-pendapatan-lain">
                        <i class="fas fa-calculator icon"></i>
                        Jumlah Pendapatan Lainnya
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField id="jumlah-pendapatan-lain" label="" type="number"
                        v-model="calculatedTotal" placeholder="0" :error="errors.jumlahPendapatanLain" :readonly="true" />
                    </td>
                  </tr>
                </tbody>
              </table>
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
            <OtherIncomeTable :current-page="currentPage" :page-size="pageSize" :entries="entries" @edit="editRow"
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
import { otherIncomeSchema, type OtherIncomeSchema } from '@/schemas/incomeOtherSchema'
import { deleteOtherIncome, getOtherIncomeList, postOtherIncome, putOtherIncome } from '@/services/otherIncomeService'
import { useAuthStore } from '@/stores/auth'
import { isGlobalLoading, produksiData } from '@/stores/globalState'
import type { OtherIncomeData, OtherIncomeFrm, OtherIncomePayload } from '@/types/other-income.type'
import { computed, onMounted, ref, watch } from 'vue'
import ConfirmModal from '../ui/ConfirmModal.vue'
import OtherIncomeTable from './OtherIncomeTable.vue'

interface Emits {
  (e: 'update:modelValue', value: OtherIncomeFrm): void
}

const emit = defineEmits<Emits>()

// Local table state
const entries = ref<OtherIncomeData[]>([])
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
  get: () => produksiData.value.pendapatanLain,
  set: (value: OtherIncomePayload) => emit('update:modelValue', value)
})

function safeNumber(n: unknown): number {
  const num = typeof n === 'number' ? n : Number(n)
  return Number.isFinite(num) ? num : 0
}

// Computed property untuk menghitung total: penjualan PK - komisi + denda - diskon denda
const calculatedTotal = computed(() => {
  const penjualanPk = safeNumber(formData.value.penjualan_pk)
  const komisi = safeNumber(formData.value.komisi)
  const denda = safeNumber(formData.value.denda_keterlambatan)
  const diskon = safeNumber(formData.value.diskon_denda)
  return penjualanPk - komisi + denda - diskon
})

// Watch untuk mengupdate formData.jumlah_pendapatan_lain ketika field input berubah
watch(
  () => [
    formData.value.penjualan_pk,
    formData.value.komisi,
    formData.value.denda_keterlambatan,
    formData.value.diskon_denda
  ],
  () => {
    // Update formData dengan nilai yang dihitung
    produksiData.value.pendapatanLain.jumlah_pendapatan_lain = calculatedTotal.value
  },
  { immediate: true }
)

const { monthOptions, getYearOptions, getCurrentDate } = useDate()
const yearOptions = getYearOptions(5) // Current year ± 5 years
const user = authStore.user.value
const branchId = user?.entity_id

// Set default values for current date
const defaultSalesData: OtherIncomeFrm = {
  ...getCurrentDate(),
  penjualan_pk: 0,
  komisi: 0,
  denda_keterlambatan: 0,
  diskon_denda: 0,
  jumlah_pendapatan_lain: 0,
}

const errors = ref<Record<keyof OtherIncomeSchema, string>>({
  penjualanPk: '',
  komisi: '',
  dendaKeterlambatan: '',
  diskonDenda: '',
  jumlahPendapatanLain: ''
})


const fetchList = async (page = 1) => {
  try {

    // getSales expects an object, not just branchId
    const apiData = await getOtherIncomeList({ page, branch_id: branchId })
    // apiData may not be an array, so ensure we access the correct property
    const items = Array.isArray(apiData?.data) ? apiData.data : []
    entries.value = items
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
  isGlobalLoading.value = true
  handleReset()
  fetchList(currentPage.value)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchList(page);
  }
};

function validateForm(): boolean {
  // Object.assign(errors.value, { kontan: '', kredit: '', leasing: '' })

  const result = otherIncomeSchema.safeParse({
    penjualanPk: safeNumber(formData.value.penjualan_pk),
    komisi: safeNumber(formData.value.komisi),
    dendaKeterlambatan: safeNumber(formData.value.denda_keterlambatan),
    diskonDenda: safeNumber(formData.value.diskon_denda),
    jumlahPendapatanLain: safeNumber(formData.value.jumlah_pendapatan_lain),
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
    const payload: OtherIncomePayload = {
      branch_id: Number(branchId),
      ...formData.value
    }
    if (isEditing.value && idSelected.value !== null) {
      await putOtherIncome(idSelected.value, payload)
    } else {
      await postOtherIncome(payload)
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
  produksiData.value.pendapatanLain = { ...defaultSalesData }
  isEditing.value = false
  idSelected.value = null
}

function editRow(id: number): void {
  if (!id) return // jaga-jaga id tidak valid
  const row = entries.value.find(item => Number(item.id) === Number(id));
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
  produksiData.value.pendapatanLain = {
    penjualan_pk: Number(row.penjualan_pk),
    komisi: Number(row.komisi),
    denda_keterlambatan: Number(row.denda_keterlambatan),
    diskon_denda: Number(row.diskon_denda),
    jumlah_pendapatan_lain: Number(row.jumlah_pendapatan_lain),
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
  const row = entries.value.find(item => Number(item.id) === Number(id));
  if (!row) return;
  idSelected.value = id
  showConfirmModal.value = true
}

async function handleConfirmDelete(): Promise<void> {
  if (idSelected.value !== null) {
    try {
      const data = await deleteOtherIncome(idSelected.value)
      notifySuccess({ title: 'Success Message', msg: data.message || '' })
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
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.date-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.form-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-input-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.data-input-table thead th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  text-align: left;
  padding: 16px 20px;
}

.field-header {
  width: 40%;
}

.value-header {
  width: 60%;
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f8fafc;
}

.table-row:last-child {
  border-bottom: none;
}

.field-label {
  padding: 16px 20px;
  vertical-align: middle;
  border-bottom: 1px solid #e2e8f0;
}

.field-label label {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #374151;
  gap: 8px;
}

.icon {
  width: 16px;
  color: #6b7280;
}

.field-input {
  padding: 12px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.field-input :deep(.form-field) {
  margin: 0;
}

.field-input :deep(.form-input) {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 12px;
  transition: all 0.2s ease;
  background: #fafafa;
}

.field-input :deep(.form-input:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: white;
}

/* Income Section Styling */
.income-row {
  background: #f0fdf4;
}

.income-row .field-label {
  border-left: 4px solid #10b981;
}

.income-row .icon {
  color: #10b981;
}

.income-row .field-input {
  background: #f0fdf4;
}

.income-row .field-input :deep(.form-input) {
  background: white;
  border-color: #bbf7d0;
}

/* Penalty Section Styling */
.penalty-row {
  background: #fef2f2;
}

.penalty-row .field-label {
  border-left: 4px solid #ef4444;
}

.penalty-row .icon {
  color: #ef4444;
}

.penalty-row .field-input {
  background: #fef2f2;
}

.penalty-row .field-input :deep(.form-input) {
  background: white;
  border-color: #fecaca;
}

/* Total Row Styling */
.total-row {
  background: #fefce8;
}

.total-row .field-label {
  border-left: 4px solid #eab308;
}

.total-row .icon {
  color: #eab308;
}

.total-row .field-input {
  background: #fefce8;
}

.total-row .field-input :deep(.form-input) {
  background: white;
  border-color: #fde047;
}

@media (max-width: 768px) {
  .data-input-table thead {
    display: none;
  }

  .table-row {
    display: flex;
    flex-direction: column;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .field-label,
  .field-input {
    display: block;
    width: 100%;
    border-bottom: none;
  }

  .field-label {
    background: #f8fafc;
    border-radius: 8px 8px 0 0;
  }

  .field-input {
    border-radius: 0 0 8px 8px;
  }

  .date-fields {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.list-table {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-btn {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}

.footer-btn .btn {
  position: relative;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  overflow: hidden;
}

.footer-btn .btn::before {
  content: "";
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
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-2px);
}

.btn-reset {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
  border: none;
}

.btn-reset:hover {
  background: linear-gradient(135deg, #5b6470, #374151);
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: #6b7280;
  border: 2px solid #d1d5db;
}

.btn-outline:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
  color: #374151;
  transform: translateY(-2px);
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 1rem;
}
</style>
