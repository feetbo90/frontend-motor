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
        title="Data Beban Operasional"
        description="Input semua komponen beban perusahaan berdasarkan kategori"
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
                  <tr class="table-row salary-row">
                    <td class="field-label">
                      <label for="gaji-insentif">
                        <i class="fas fa-money-bill-wave icon"></i>
                        Gaji/Insentif/Bonus
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="gaji-insentif"
                        label=""
                        type="number"
                        v-model="formData.gaji"
                        placeholder="0"
                        :error="errors.gaji"
                        format="currency"
                        @keydown.enter.prevent="focusNextInput('admin')"
                      />
                    </td>
                  </tr>
                  <tr class="table-row operational-row">
                    <td class="field-label">
                      <label for="admin">
                        <i class="fas fa-file-invoice icon"></i>
                        Administrasi
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="admin"
                        label=""
                        type="number"
                        v-model="formData.admin"
                        placeholder="0"
                        :error="errors.admin"
                        format="currency"
                        @keydown.enter.prevent="focusNextInput('operasional')"
                      />
                    </td>
                  </tr>
                  <tr class="table-row operational-row">
                    <td class="field-label">
                      <label for="operasional">
                        <i class="fas fa-cogs icon"></i>
                        Operasional
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="operasional"
                        label=""
                        type="number"
                        v-model="formData.operasional"
                        placeholder="0"
                        :error="errors.operasional"
                        format="currency"
                        @keydown.enter.prevent="focusNextInput('penyusutan-aktiva')"
                      />
                    </td>
                  </tr>
                  <tr class="table-row result-row">
                    <td class="field-label">
                      <label for="beban-umum-operasional">
                        <i class="fas fa-calculator icon"></i>
                        Jumlah Beban Umum Operasional
                        <span class="total-badge">Subtotal</span>
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="beban-umum-operasional"
                        label=""
                        type="number"
                        v-model="formData.beban_umum_operasional"
                        placeholder="0"
                        :error="errors.bebanUmumOperasional"
                        format="currency"
                        :readonly="true"
                      />
                    </td>
                  </tr>
                  <tr class="table-row">
                    <td class="field-label">
                      <label for="penyusutan-aktiva">
                        <i class="fas fa-chart-line-down icon"></i>
                        Penyusutan Aktiva
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="penyusutan-aktiva"
                        label=""
                        type="number"
                        v-model="formData.penyusutan_aktiva"
                        placeholder="0"
                        :error="errors.penyusutanAktiva"
                        format="currency"
                        @keydown.enter.prevent="focusNextInput('cadangan-piutang')"
                      />
                    </td>
                  </tr>
                  <tr class="table-row">
                    <td class="field-label">
                      <label for="cadangan-piutang">
                        <i class="fas fa-piggy-bank icon"></i>
                        Cadangan Piutang
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="cadangan-piutang"
                        label=""
                        type="number"
                        v-model="formData.cadangan_piutang"
                        placeholder="0"
                        :error="errors.cadanganPiutang"
                        format="currency"
                        @keydown.enter.prevent="focusNextInput('cadangan-stock')"
                      />
                    </td>
                  </tr>
                  <tr class="table-row">
                    <td class="field-label">
                      <label for="cadangan-stock">
                        <i class="fas fa-warehouse icon"></i>
                        Cadangan Stock
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="cadangan-stock"
                        label=""
                        type="number"
                        v-model="formData.cadangan_stock"
                        placeholder="0"
                        :error="errors.cadanganStock"
                        format="currency"
                        @keydown.enter.prevent="focusSubmitButton"
                      />
                    </td>
                  </tr>
                  <tr class="table-row final-result-row">
                    <td class="field-label">
                      <label for="total">
                        <i class="fas fa-chart-bar icon"></i>
                        Total Beban & Biaya
                        <span class="final-total-badge">Grand Total</span>
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="total"
                        label=""
                        type="number"
                        v-model="formData.total"
                        placeholder="0"
                        :error="errors.total"
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
        title="Daftar Beban Operasional"
        description="Kumpulan item beban operasional yang telah ditambahkan"
      >
        <template #content>
          <div class="list-table">
            <LoadComponentTable
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
import { loadComponentSchema, type LoadComponentSchema } from "@/schemas/loadComponentSchema";
import {
  deleteLoadComponent,
  getLoadComponentList,
  postLoadComponent,
  putLoadComponent,
} from "@/services/loadComponent";
import { useAuthStore } from "@/stores/auth";
import { bebanData, isGlobalLoading } from "@/stores/globalState";
import type {
  LoadComponentData,
  LoadComponentFrm,
  LoadComponentPayload,
} from "@/types/load-component.type";
import { computed, onMounted, ref, watch } from "vue";
import ConfirmModal from "../ui/ConfirmModal.vue";
import LoadComponentTable from "./LoadComponentTable.vue";

interface Emits {
  (e: "update:modelValue", value: LoadComponentFrm): void;
}

const emit = defineEmits<Emits>();

// Local table state
const entries = ref<LoadComponentData[]>([]);
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
  get: () => bebanData.value,
  set: (value: LoadComponentPayload) => emit("update:modelValue", value),
});

const { monthOptions, getYearOptions, getCurrentDate } = useDate();
const yearOptions = getYearOptions(5); // Current year ± 5 years
const user = authStore.user.value;
const branchId = user?.entity_id;

// Set default values for current date
const defaultSalesData: LoadComponentFrm = {
  ...getCurrentDate(),
  gaji: 0,
  admin: 0,
  operasional: 0,
  beban_umum_operasional: 0,
  penyusutan_aktiva: 0,
  cadangan_piutang: 0,
  cadangan_stock: 0,
  total: 0,
};

const errors = ref<Record<keyof LoadComponentSchema, string>>({
  gaji: "",
  admin: "",
  operasional: "",
  bebanUmumOperasional: "",
  penyusutanAktiva: "",
  cadanganPiutang: "",
  cadanganStock: "",
  total: "",
});

// Watch for auto calculation - Beban Umum Operasional
watch(
  [() => () => formData.value.admin, () => formData.value.operasional],
  () => {
    const admin = safeNumber(formData.value.admin);
    const operasional = safeNumber(formData.value.operasional);

    // Calculate beban umum operasional:  admin + operasional
    formData.value.beban_umum_operasional = admin + operasional;
  },
  { immediate: true },
);

// Watch for auto calculation - Total Beban & Biaya
watch(
  [
    () => formData.value.gaji,
    () => formData.value.beban_umum_operasional,
    () => formData.value.penyusutan_aktiva,
    () => formData.value.cadangan_piutang,
    () => formData.value.cadangan_stock,
  ],
  () => {
    const gaji = safeNumber(formData.value.gaji);
    const bebanUmumOperasional = safeNumber(formData.value.beban_umum_operasional);
    const penyusutanAktiva = safeNumber(formData.value.penyusutan_aktiva);
    const cadanganPiutang = safeNumber(formData.value.cadangan_piutang);
    const cadanganStock = safeNumber(formData.value.cadangan_stock);

    // Calculate total:gaji+ beban_umum_operasional + penyusutan_aktiva + cadangan_piutang + cadangan_stock
    formData.value.total =
      gaji+bebanUmumOperasional + penyusutanAktiva + cadanganPiutang + cadanganStock;
  },
  { immediate: true },
);

const fetchList = async (page = 1) => {
  try {
    // getSales expects an object, not just branchId
    const apiData = await getLoadComponentList({ page, branch_id: branchId });
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
  const result = loadComponentSchema.safeParse({
    gaji: safeNumber(formData.value.gaji),
    admin: safeNumber(formData.value.admin),
    operasional: safeNumber(formData.value.operasional),
    bebanUmumOperasional: safeNumber(formData.value.beban_umum_operasional),
    penyusutanAktiva: safeNumber(formData.value.penyusutan_aktiva),
    cadanganPiutang: safeNumber(formData.value.cadangan_piutang),
    cadanganStock: safeNumber(formData.value.cadangan_stock),
    total: safeNumber(formData.value.total),
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
    const payload: LoadComponentPayload = {
      branch_id: Number(branchId),
      ...formData.value,
    };
    if (isEditing.value && idSelected.value !== null) {
      await putLoadComponent(idSelected.value, payload);
    } else {
      await postLoadComponent(payload);
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
  bebanData.value = { ...defaultSalesData };
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
  bebanData.value = {
    gaji: Number(row.gaji),
    admin: Number(row.admin),
    operasional: Number(row.operasional),
    beban_umum_operasional: Number(row.beban_umum_operasional),
    penyusutan_aktiva: Number(row.penyusutan_aktiva),
    cadangan_piutang: Number(row.cadangan_piutang),
    cadangan_stock: Number(row.cadangan_stock),
    total: Number(row.total),
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
      const data = await deleteLoadComponent(idSelected.value);
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

.salary-row {
  background: #fef3c7;
}

.salary-row .field-label {
  background: #fde68a;
  border-right-color: #fcd34d;
}

.salary-row .icon {
  color: #d97706;
}

.salary-row .field-input {
  background: #fef3c7;
}

.salary-row .field-input :deep(.form-input) {
  background: #ffffff;
  border-color: #f59e0b;
  font-weight: 500;
  color: #92400e;
}

.operational-row {
  background: #f0f9ff;
}

.operational-row .field-label {
  background: #e0f2fe;
  border-right-color: #bae6fd;
}

.operational-row .icon {
  color: #0284c7;
}

.operational-row .field-input {
  background: #f0f9ff;
}

.operational-row .field-input :deep(.form-input) {
  background: #ffffff;
  border-color: #0ea5e9;
  font-weight: 500;
  color: #0c4a6e;
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
