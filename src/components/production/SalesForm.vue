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
        title="Form Penjualan"
        description="Input data penjualan kontan, kredit, dan leasing"
        :class="{ highlight: highlightForm }"
      >
        <!-- Slot untuk content -->
        <template #content>
          <div class="form-grid">
            <div class="date-fields">
              <FormSelect
                id="tahun"
                label="Tahun"
                v-model="salesData.tahun"
                placeholder="Pilih Tahun"
                :options="yearOptions"
              />
              <FormSelect
                id="bulan"
                label="Bulan"
                v-model="salesData.bulan"
                placeholder="Pilih Bulan"
                :options="monthOptions"
              />
            </div>
            <div class="form-table">
              <table class="data-input-table">
                <thead>
                  <tr>
                    <th class="field-header">Field Name</th>
                    <th class="value-header">Amount / Units</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="table-row">
                    <td class="field-label">
                      <label for="penjualan-kontan">
                        <i class="fas fa-money-bill icon"></i>
                        Penjualan Kontan
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="penjualan-kontan"
                        label=""
                        type="number"
                        v-model="salesData.kontan"
                        placeholder="0"
                        :error="errors.kontan"
                        format="currency"
                      />
                    </td>
                  </tr>
                  <tr class="table-row">
                    <td class="field-label">
                      <label for="penjualan-kredit">
                        <i class="fas fa-credit-card icon"></i>
                        Penjualan Stok Kredit
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="penjualan-kredit"
                        label=""
                        type="number"
                        v-model="salesData.kredit"
                        placeholder="0"
                        :error="errors.kredit"
                        format="currency"
                      />
                    </td>
                  </tr>
                  <tr class="table-row">
                    <td class="field-label">
                      <label for="penjualan-leasing">
                        <i class="fas fa-car icon"></i>
                        Penjualan Leasing
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="penjualan-leasing"
                        label=""
                        type="number"
                        v-model="salesData.leasing"
                        placeholder="0"
                        :error="errors.leasing"
                        format="currency"
                      />
                    </td>
                  </tr>
                  <tr class="table-row unit-row">
                    <td class="field-label">
                      <label for="unit-penjualan-kontan">
                        <i class="fas fa-boxes icon"></i>
                        Unit Terjual (Kontan)
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="unit-penjualan-kontan"
                        label=""
                        type="number"
                        v-model="salesData.unit_jualkontan"
                        placeholder="0"
                        :error="errors.unit_jualkontan"
                      />
                    </td>
                  </tr>
                  <tr class="table-row unit-row">
                    <td class="field-label">
                      <label for="unit-penjualan-kredit">
                        <i class="fas fa-boxes icon"></i>
                        Unit Terjual (Kredit)
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="unit-penjualan-kredit"
                        label=""
                        type="number"
                        v-model="salesData.unit_jualkredit"
                        placeholder="0"
                        :error="errors.unit_jualkredit"
                      />
                    </td>
                  </tr>
                  <tr class="table-row unit-row">
                    <td class="field-label">
                      <label for="unit-penjualan-leasing">
                        <i class="fas fa-boxes icon"></i>
                        Unit Terjual (Leasing)
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="unit-penjualan-leasing"
                        label=""
                        type="number"
                        v-model="salesData.unit_jualleasing"
                        placeholder="0"
                        :error="errors.unit_jualleasing"
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
            <button class="btn btn-primary" type="submit">
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
        title="Daftar Penjualan"
        description="Kumpulan item penjualan yang telah ditambahkan"
      >
        <template #content>
          <div class="list-table">
            <SalesTable
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
import SalesTable from "@/components/production/SalesTable.vue";
import { useDate } from "@/composables/useDate";
import { useNotification } from "@/composables/useNotification";
import { salesSchema, type SalesSchema } from "@/schemas/salesSchema";
import { deleteSales, getSales, postSales, putSales } from "@/services/salesService";
import { useAuthStore } from "@/stores/auth";
import {
  isGlobalLoading,
  selectedCabang,
  selectedMonth,
  selectedUnit,
  selectedYear,
} from "@/stores/globalState";
import type { SalesData, SalesResponse } from "@/types/sales.type";
import { computed, onMounted, ref, watch } from "vue";
import ConfirmModal from "../ui/ConfirmModal.vue";

interface Props {
  modelValue: SalesData;
}

interface Emits {
  (e: "update:modelValue", value: SalesData): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const salesData = computed({
  get: () => props.modelValue,
  set: (value: SalesData) => emit("update:modelValue", value),
});

const { monthOptions, getYearOptions, getCurrentDate } = useDate();
const yearOptions = getYearOptions(5); // Current year ± 5 years
const currentDate = getCurrentDate();

// Set default values for current date
const defaultSalesData = {
  ...getCurrentDate(),
  kontan: 0,
  kredit: 0,
  leasing: 0,
  unit_jualkontan: 0,
  unit_jualkredit: 0,
  unit_jualleasing: 0,
  tahun: currentDate.year,
  bulan: currentDate.month,
};

const errors = ref<Record<keyof SalesSchema, string>>({
  kontan: "",
  kredit: "",
  leasing: "",
  unit_jualkontan: "",
  unit_jualkredit: "",
  unit_jualleasing: "",
});
// Local table state
const entries = ref<SalesResponse[]>([]);
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

const fetchSales = async (
  page = 1,
  year: number | undefined = undefined,
  month: number | undefined = undefined,
) => {
  try {
    const user = authStore.user.value;
    const branchId = user?.entity_id;
    // bikin object params
    const apiData = await getSales({ page, year, month, branch_id: branchId });
    // apiData may not be an array, so ensure we access the correct property
    const items = Array.isArray(apiData?.data) ? apiData.data : [];
    entries.value = items.map((item) => ({
      id: item.id,
      branch_id: String(item.branch_id),
      period_id: String(item.period_id),
      kontan: Number(item.kontan),
      kredit: Number(item.kredit),
      leasing: Number(item.leasing),
      jumlah: Number(item.jumlah),
      unit_jualkontan: Number(item.unit_jualkontan),
      unit_jualkredit: Number(item.unit_jualkredit),
      unit_jualleasing: Number(item.unit_jualleasing),
      created_at: item.created_at,
      updated_at: item.updated_at,
      year: item.year ?? null,
      month: item.month ?? null,
      version: Number(item.version),
      is_active: Boolean(item.is_active),
    }));
    currentPage.value = apiData.currentPage;
    totalPages.value = apiData.totalPages;
    total.value = apiData.total;
  } catch {
    // Optional: alert('Gagal mengambil data penjualan!')
  } finally {
    isGlobalLoading.value = false;
  }
};

watch([selectedYear, selectedMonth, selectedCabang, selectedUnit], () => {
  const year = selectedYear.value !== "" ? Number(selectedYear.value) : undefined;
  const month = selectedMonth.value !== "" ? Number(selectedMonth.value) : undefined;
  // const cabang = selectedCabang.value !== '' ? selectedCabang.value : undefined
  // const unit = selectedUnit.value !== '' ? selectedUnit.value : undefined
  fetchSales(currentPage.value, year, month);
});

onMounted(async () => {
  if (!authStore.user?.value) return;
  isGlobalLoading.value = true;
  emit("update:modelValue", { ...defaultSalesData });
  fetchSales(currentPage.value);
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchSales(page);
  }
};

const getVisiblePages = (): (number | string)[] => {
  const total = totalPages.value;
  const current = currentPage.value;
  const delta = 2;

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const left = Math.max(1, current - delta);
  const right = Math.min(total, current + delta);

  const pages: (number | string)[] = [];

  if (left > 1) {
    pages.push(1);
    if (left > 2) pages.push("...");
  }

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  if (right < total) {
    if (right < total - 1) pages.push("...");
    pages.push(total);
  }

  return pages;
};

function safeNumber(n: unknown): number {
  const num = typeof n === "number" ? n : Number(n);
  return Number.isFinite(num) ? num : 0;
}

function validateForm(): boolean {
  // Object.assign(errors.value, { kontan: '', kredit: '', leasing: '' })

  const result = salesSchema.safeParse({
    kontan: safeNumber(salesData.value.kontan),
    kredit: safeNumber(salesData.value.kredit),
    leasing: safeNumber(salesData.value.leasing),
    unit_jualkontan: safeNumber(salesData.value.unit_jualkontan),
    unit_jualkredit: safeNumber(salesData.value.unit_jualkredit),
    unit_jualleasing: safeNumber(salesData.value.unit_jualleasing),
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
  const newItem: SalesData = {
    tahun: safeNumber(salesData.value.tahun),
    bulan: safeNumber(salesData.value.bulan),
    kontan: safeNumber(salesData.value.kontan),
    kredit: safeNumber(salesData.value.kredit),
    leasing: safeNumber(salesData.value.leasing),
    unit_jualkontan: safeNumber(salesData.value.unit_jualkontan),
    unit_jualkredit: safeNumber(salesData.value.unit_jualkredit),
    unit_jualleasing: safeNumber(salesData.value.unit_jualleasing),
  };
  try {
    const user = authStore.user.value;
    const payload = {
      branch_id: Number(user?.entity_id ?? 0),
      year: newItem.tahun,
      month: newItem.bulan,
      period_id: 1, //TODO: delete nanti dihapus dari BE
      kontan: newItem.kontan,
      kredit: newItem.kredit,
      leasing: newItem.leasing,
      unit_jualkontan: newItem.unit_jualkontan,
      unit_jualkredit: newItem.unit_jualkredit,
      unit_jualleasing: newItem.unit_jualleasing,
      jumlah: newItem.kontan + newItem.kredit + newItem.leasing,
    };
    if (isEditing.value && idSelected.value !== null) {
      notifySuccess({ title: "Success Message", msg: "Data penjualan berhasil diubah" });
      await putSales(idSelected.value, payload);
    } else {
      await postSales(payload);
      notifySuccess({ title: "Success Message", msg: "Data penjualan berhasil disimpan" });
    }
    fetchSales(currentPage.value); // refresh table
  } catch {
    handleReset();
    isGlobalLoading.value = false;
  } finally {
    handleReset();
    isGlobalLoading.value = false;
  }
}

function handleReset(): void {
  emit("update:modelValue", { ...defaultSalesData });
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
  emit("update:modelValue", {
    tahun: Number(row.year),
    bulan: Number(row.month),
    kontan: row.kontan,
    kredit: row.kredit,
    leasing: row.leasing,
    unit_jualkontan: row.unit_jualkontan,
    unit_jualkredit: row.unit_jualkredit,
    unit_jualleasing: row.unit_jualleasing,
  });
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
      const data = await deleteSales(idSelected.value);
      notifySuccess({ title: "Success Message", msg: data.message });
      fetchSales(currentPage.value); // refresh table
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

/* Unit rows styling */
.unit-row .field-label {
  background: #f0f9ff;
  border-right-color: #e0f2fe;
}

.unit-row .icon {
  color: #0284c7;
}

.unit-row .field-input {
  background: #f0f9ff;
}

.unit-row .field-input :deep(.form-input) {
  background: #ffffff;
  border-color: #0ea5e9;
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
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 1rem;
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
@media (max-width: 640px) {
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
</style>
