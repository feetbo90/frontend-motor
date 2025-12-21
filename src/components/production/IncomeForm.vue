<template>
  <div ref="formSection">
    <form @submit.prevent="handleSave">
      <ConfirmModal
        v-if="showConfirmModal"
        title="Hapus Item?"
        description="Apakah kamu yakin ingin menghapus item ini? Tindakan ini tidak bisa dibatalkan."
        confirmText="Delete"
        cancelText="Cancel"
        @confirm="handleConfirmDelete"
        @cancel="handleCancelDelete"
      />
      <FormSection
        title="Data Pendapatan"
        description="Input data mark up dan pendapatan lainnya"
        :class="{ highlight: highlightForm }"
      >
        <!-- Slot untuk content -->
        <template #content>
          <div class="form-grid">
            <div class="date-fields">
              <FormSelect
                id="tahun"
                label="Tahun"
                v-model="formData.year"
                placeholder="Pilih Tahun"
                :options="yearOptions"
              />
              <FormSelect
                id="bulan"
                label="Bulan"
                v-model="formData.month"
                placeholder="Pilih Bulan"
                :options="monthOptions"
              />
            </div>
            <div class="form-table">
              <table class="data-input-table">
                <thead>
                  <tr>
                    <th class="field-header">Field Name</th>
                    <th class="value-header">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="table-row markup-row">
                    <td class="field-label">
                      <label for="markup-kontan">
                        <i class="fas fa-percentage icon"></i>
                        Mark Up Penjualan Kontan
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="markup-kontan"
                        label=""
                        type="number"
                        v-model="formData.markup_kontan"
                        placeholder="0"
                        :error="errors.markupKontan"
                        format="currency"
                        @keydown.enter.prevent="focusNextInput('markup-kredit')"
                      />
                    </td>
                  </tr>
                  <tr class="table-row markup-row">
                    <td class="field-label">
                      <label for="markup-kredit">
                        <i class="fas fa-percentage icon"></i>
                        Mark Up Penjualan Kredit
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="markup-kredit"
                        label=""
                        type="number"
                        v-model="formData.markup_kredit"
                        placeholder="0"
                        :error="errors.markupKredit"
                        format="currency"
                        @keydown.enter.prevent="focusNextInput('realisasi-bunga')"
                      />
                    </td>
                  </tr>
                  <tr class="table-row result-row">
                    <td class="field-label">
                      <label for="jumlah-markup">
                        <i class="fas fa-calculator icon"></i>
                        Jumlah Mark Up
                        <span class="total-badge">Total</span>
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="jumlah-markup"
                        label=""
                        type="number"
                        v-model="formData.markup_jumlah"
                        placeholder="0"
                        :error="errors.markupJumlah"
                        format="currency"
                        :readonly="true"
                      />
                    </td>
                  </tr>
                  <tr class="table-row">
                    <td class="field-label">
                      <label for="realisasi-bunga">
                        <i class="fas fa-coins icon"></i>
                        Realisasi Bunga
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="realisasi-bunga"
                        label=""
                        type="number"
                        v-model="formData.realisasi_bunga"
                        placeholder="0"
                        :error="errors.realisasiBunga"
                        format="currency"
                        @keydown.enter.prevent="focusNextInput('diskon-bunga')"
                      />
                    </td>
                  </tr>
                  <tr class="table-row">
                    <td class="field-label">
                      <label for="diskon-bunga">
                        <i class="fas fa-tag icon"></i>
                        Diskon Bunga
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="diskon-bunga"
                        label=""
                        type="number"
                        v-model="formData.diskon_bunga"
                        placeholder="0"
                        :error="errors.diskonBunga"
                        format="currency"
                        @keydown.enter.prevent="focusNextInput('denda')"
                      />
                    </td>
                  </tr>
                  <tr class="table-row">
                    <td class="field-label">
                      <label for="denda">
                        <i class="fas fa-exclamation-triangle icon"></i>
                        Denda
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="denda"
                        label=""
                        type="number"
                        v-model="formData.denda"
                        placeholder="0"
                        :error="errors.denda"
                        format="currency"
                        @keydown.enter.prevent="focusNextInput('administrasi')"
                      />
                    </td>
                  </tr>
                  <tr class="table-row">
                    <td class="field-label">
                      <label for="administrasi">
                        <i class="fas fa-file-invoice icon"></i>
                        Administrasi
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="administrasi"
                        label=""
                        type="number"
                        v-model="formData.administrasi"
                        placeholder="0"
                        :error="errors.administrasi"
                        format="currency"
                        @keydown.enter.prevent="focusSubmitButton"
                      />
                    </td>
                  </tr>
                  <tr class="table-row final-result-row">
                    <td class="field-label">
                      <label for="jumlah-pendapatan">
                        <i class="fas fa-chart-line icon"></i>
                        Jumlah Pendapatan
                        <span class="final-total-badge">Grand Total</span>
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="jumlah-pendapatan"
                        label=""
                        type="number"
                        v-model="formData.jumlah_pendapatan"
                        placeholder="0"
                        :error="errors.jumlahPendapatan"
                        format="currency"
                        :readonly="true"
                      />
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
            <button ref="submitButton" class="btn btn-primary" type="submit">
              <i class="fas" :class="isEditing ? 'fa-save' : 'fa-plus'" />
              {{ isEditing ? "Simpan Perubahan" : "Tambah ke Daftar" }}
            </button>
            <button type="button" class="btn btn-reset" @click="handleReset">
              <i class="fas fa-rotate-left"></i> Reset
            </button>
            <button type="button" v-if="isEditing" class="btn btn-outline" @click="cancelEdit">
              <i class="fas fa-ban"></i> Batal Edit
            </button>
          </div>
        </template>
      </FormSection>

      <FormSection
        title="Daftar Pendapatan"
        description="Kumpulan item pendapatan yang telah ditambahkan"
      >
        <template #content>
          <div class="list-table">
            <IncomeTable
              :current-page="currentPage"
              :page-size="pageSize"
              :entries="entries"
              @edit="editRow"
              @delete="deleteRow"
            />
            <!-- PAGINATION -->
            <div class="pagination">
              <button
                type="button"
                :class="['btn btn-reset', { disabled: currentPage === 1 }]"
                :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)"
              >
                Prev
              </button>

              <span>Page {{ currentPage }} of {{ totalPages }}</span>

              <button
                type="button"
                :class="['btn btn-primary', { disabled: currentPage === totalPages }]"
                :disabled="currentPage === totalPages"
                @click="goToPage(currentPage + 1)"
              >
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
import FormField from "@/components/FormField.vue";
import FormSection from "@/components/FormSection.vue";
import FormSelect from "@/components/FormSelect.vue";
import { useDate } from "@/composables/useDate";
import { useFormNavigation } from "@/composables/useFormNavigation";
import { useNotification } from "@/composables/useNotification";
import { incomeSchema, type IncomeSchema } from "@/schemas/incomeSchema";
import { deleteIncome, getIncomeList, postIncome, putIncome } from "@/services/incomeService";
import { useAuthStore } from "@/stores/auth";
import { isGlobalLoading, produksiData } from "@/stores/globalState";
import type { IncomeData, IncomeFrm, IncomePayload } from "@/types/income.type";
import { computed, onMounted, ref, watch } from "vue";
import ConfirmModal from "../ui/ConfirmModal.vue";
import IncomeTable from "./IncomeTable.vue";

interface Emits {
  (e: "update:modelValue", value: IncomeFrm): void;
}

const emit = defineEmits<Emits>();

// Local table state
const entries = ref<IncomeData[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);
const pageSize = ref(10); // default, nanti update dari API
const formSection = ref<HTMLElement | null>(null); // 👉 ref untuk form
const highlightForm = ref(false); // ✅ state untuk highlight
const isEditing = ref(false);
const idSelected = ref<number | null>(null);
const authStore = useAuthStore();
const { notifySuccess } = useNotification();
const showConfirmModal = ref(false);
const { submitButton, focusNextInput, focusSubmitButton } = useFormNavigation();

const formData = computed({
  get: () => produksiData.value.pendapatan,
  set: (value: IncomePayload) => emit("update:modelValue", value),
});

const { monthOptions, getYearOptions, getCurrentDate } = useDate();
const yearOptions = getYearOptions(5); // Current year ± 5 years
const user = authStore.user.value;
const branchId = user?.entity_id;

// Set default values for current date
const defaultSalesData: IncomeFrm = {
  ...getCurrentDate(),
  markup_kontan: 0,
  markup_kredit: 0,
  markup_jumlah: 0,
  realisasi_bunga: 0,
  diskon_bunga: 0,
  denda: 0,
  administrasi: 0,
  jumlah_pendapatan: 0,
};

const errors = ref<Record<keyof IncomeSchema, string>>({
  markupKontan: "",
  markupKredit: "",
  markupJumlah: "",
  realisasiBunga: "",
  diskonBunga: "",
  denda: "",
  administrasi: "",
  jumlahPendapatan: "",
});
// Auto-calculate Markup Jumlah when Markup Kontan or Markup Kredit changes
watch(
  [() => formData.value.markup_kontan, () => formData.value.markup_kredit],
  ([markupKontan, markupKredit]) => {
    const kontan = safeNumber(markupKontan);
    const kredit = safeNumber(markupKredit);
    formData.value.markup_jumlah = kontan + kredit;
  },
  { immediate: false },
);

// Auto-calculate Jumlah Pendapatan from all income sources
watch(
  [
    () => formData.value.markup_jumlah,
    () => formData.value.realisasi_bunga,
    () => formData.value.diskon_bunga,
    () => formData.value.denda,
    () => formData.value.administrasi,
  ],
  ([markupJumlah, realisasiBunga, diskonBunga, denda, administrasi]) => {
    const markup = safeNumber(markupJumlah);
    const bunga = safeNumber(realisasiBunga);
    const diskon = safeNumber(diskonBunga);
    const dendaAmount = safeNumber(denda);
    const admin = safeNumber(administrasi);

    // Formula: markup_jumlah + realisasi_bunga - diskon_bunga + denda + administrasi
    formData.value.jumlah_pendapatan = markup + bunga - diskon + dendaAmount + admin;
  },
  { immediate: false },
);
const fetchList = async (page = 1) => {
  try {
    // getSales expects an object, not just branchId
    const apiData = await getIncomeList({ page, branch_id: branchId });
    // apiData may not be an array, so ensure we access the correct property
    const items = Array.isArray(apiData?.data) ? apiData.data : [];
    entries.value = items;
    currentPage.value = apiData.meta.currentPage;
    totalPages.value = apiData.meta.totalPages;
    total.value = apiData.meta.total;
  } catch {
    // Optional: alert('Gagal mengambil data penjualan!')
  } finally {
    isGlobalLoading.value = false;
  }
};

onMounted(async () => {
  if (!authStore.user?.value) return;
  emit("update:modelValue", { ...defaultSalesData });
  isGlobalLoading.value = true;
  fetchList(currentPage.value);
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchList(page);
  }
};

function safeNumber(n: unknown): number {
  const num = typeof n === "number" ? n : Number(n);
  return Number.isFinite(num) ? num : 0;
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
  });

  if (!result.success) {
    result.error.issues.forEach((err) => {
      const field = err.path[0] as keyof typeof errors.value;
      errors.value[field] = err.message;
    });
    return false;
  }
  return true;
}

async function handleSave(): Promise<void> {
  // ✅ Validasi dulu
  const isValid = validateForm();
  if (!isValid) return; // ✅ stop kalau invalid

  isGlobalLoading.value = true;
  try {
    const payload: IncomePayload = {
      branch_id: Number(branchId),
      ...formData.value,
    };
    if (isEditing.value && idSelected.value !== null) {
      await putIncome(idSelected.value, payload);
    } else {
      await postIncome(payload);
    }
    fetchList(currentPage.value); // refresh table
  } catch {
    handleReset();
    isGlobalLoading.value = false;
  } finally {
    handleReset();
    isGlobalLoading.value = false;
  }
}

function handleReset(): void {
  produksiData.value.pendapatan = { ...defaultSalesData };
  // emit('update:modelValue', { ...defaultSalesData })
  isEditing.value = false;
  idSelected.value = null;
}

function editRow(id: number): void {
  if (!id) return; // jaga-jaga id tidak valid
  const row = entries.value.find((item) => Number(item.id) === Number(id));
  if (!row) return;
  isEditing.value = true;
  idSelected.value = id;
  // ✅ Aktifkan highlight
  highlightForm.value = true;
  // Matikan highlight setelah 1.5 detik
  setTimeout(() => {
    highlightForm.value = false;
  }, 1500);

  // Scroll ke form dengan offset
  if (formSection.value) {
    const top = formSection.value.getBoundingClientRect().top + window.scrollY;
    const offset = 80; // ganti sesuai tinggi header
    window.scrollTo({
      top: top - offset,
      behavior: "smooth",
    });
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
    month: row.month,
  };
}

function cancelEdit(): void {
  isEditing.value = false;
  handleReset();
}

function deleteRow(id: number): void {
  if (!id) return; // jaga-jaga id tidak valid
  const row = entries.value.find((item) => Number(item.id) === Number(id));
  if (!row) return;
  idSelected.value = id;
  showConfirmModal.value = true;
}

async function handleConfirmDelete(): Promise<void> {
  if (idSelected.value !== null) {
    try {
      const data = await deleteIncome(idSelected.value);
      notifySuccess({ title: "Success Message", msg: data.message || "" });
      fetchList(currentPage.value); // refresh table
    } catch {
      isGlobalLoading.value = false;
      idSelected.value = null;
      showConfirmModal.value = false;
    } finally {
      isGlobalLoading.value = false;
      idSelected.value = null;
      showConfirmModal.value = false;
    }
  }
}

function handleCancelDelete() {
  handleReset();
  showConfirmModal.value = false;
}
</script>

<style scoped>
/* Modern Form Grid Layout */
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.date-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-table {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-input-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  background: #ffffff;
}

.data-input-table thead th {
  background: #f9fafb;
  color: #374151;
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  border-bottom: 2px solid #e5e7eb;
  letter-spacing: 0.025em;
}

.field-header {
  width: 40%;
}

.value-header {
  width: 60%;
}

.table-row {
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.15s ease;
}

.table-row:hover {
  background: #f9fafb;
}

.table-row:last-child {
  border-bottom: none;
}

.field-label {
  padding: 1rem 1.5rem;
  vertical-align: middle;
  background: #fafafa;
  border-right: 1px solid #f3f4f6;
}

.field-label label {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
  margin: 0;
}

.icon {
  margin-right: 0.5rem;
  color: #6b7280;
  font-size: 1rem;
  opacity: 0.7;
}

.field-input {
  padding: 1rem 1.5rem;
  vertical-align: middle;
  background: #ffffff;
}

.field-input :deep(.form-field) {
  margin: 0;
}

.field-input :deep(.form-input) {
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  transition: all 0.15s ease;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  width: 100%;
  font-weight: 400;
}

.field-input :deep(.form-input:focus) {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Markup rows styling */
.markup-row .field-label {
  background: #fef3c7;
  border-right-color: #fde68a;
}

.markup-row .icon {
  color: #d97706;
}

.result-row {
  background: #f0fdf4;
}

.result-row .field-label {
  background: #ecfdf5;
  border-right-color: #d1fae5;
}

.result-row .icon {
  color: #10b981;
}

.result-row .field-input {
  background: #f0fdf4;
}

.result-row .field-input :deep(.form-input) {
  background: #ffffff;
  border-color: #10b981;
  font-weight: 500;
  color: #065f46;
}

.final-result-row {
  background: #ede9fe;
}

.final-result-row .field-label {
  background: #f3f4f6;
  border-right-color: #e5e7eb;
}

.final-result-row .icon {
  color: #7c3aed;
}

.final-result-row .field-input {
  background: #ede9fe;
}

.final-result-row .field-input :deep(.form-input) {
  background: #ffffff;
  border-color: #7c3aed;
  font-weight: 600;
  color: #5b21b6;
}

.total-badge {
  background: #10b981;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-left: 0.5rem;
  font-weight: 500;
}

.final-total-badge {
  background: #7c3aed;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  margin-left: 0.5rem;
  font-weight: 500;
}

/* Modern Pagination Styles */
.modern-pagination {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pagination-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.page-count {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.page-indicator {
  font-size: 0.875rem;
  color: #374151;
}

.page-indicator strong {
  color: #111827;
  font-weight: 600;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.pagination-btn:hover:not(.disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
  color: #111827;
}

.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #9ca3af;
}

.pagination-btn i {
  font-size: 0.75rem;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.page-number {
  min-width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-number:hover:not(.active) {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.page-number.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #ffffff;
  font-weight: 600;
}

.page-ellipsis {
  min-width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .data-input-table thead {
    display: none;
  }

  .table-row {
    display: block;
    margin-bottom: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
  }

  .field-label,
  .field-input {
    display: block;
    padding: 0.75rem 1rem;
    border: none;
  }

  .field-label {
    border-bottom: 1px solid #f3f4f6;
    background: #f9fafb;
  }

  .field-input {
    background: #ffffff;
  }

  .date-fields {
    grid-template-columns: 1fr;
    padding: 1rem;
    gap: 0.75rem;
  }

  .pagination-info {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .page-numbers {
    order: -1;
    justify-content: center;
  }

  .pagination-btn {
    width: 100%;
    justify-content: center;
  }
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
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 1rem;
}
</style>
