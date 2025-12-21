<template>
  <div ref="formSection">
    <form @submit.prevent="handleSave">
      <ConfirmModal v-if="showConfirmModal" title="Hapus Item?"
        description="Apakah kamu yakin ingin menghapus item ini? Tindakan ini tidak bisa dibatalkan."
        confirmText="Delete" cancelText="Cancel" @confirm="handleConfirmDelete" @cancel="handleCancelDelete" />
      <FormSection title="Kas & Keuangan"
        description="Input data kas tunai, rekening bank, dan BON kas berdasarkan kategori"
        :class="{ highlight: highlightForm }">
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
                    <th class="value-header">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Cash & Bank Section -->
                  <tr class="table-row cash-row">
                    <td class="field-label">
                      <label for="kas-tunai">
                        <i class="fas fa-money-bill-wave icon"></i>
                        Kas Tunai
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField id="kas-tunai" label="" type="number" v-model="formData.kas_tunai" placeholder="0"
                        :error="errors.kasTunai" format="currency" @keydown.enter.prevent="focusNextInput('rekening-bank')" />
                    </td>
                  </tr>
                  <tr class="table-row cash-row">
                    <td class="field-label">
                      <label for="rekening-bank">
                        <i class="fas fa-university icon"></i>
                        Rekening Bank
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField id="rekening-bank" label="" type="number" v-model="formData.rekening_bank"
                        placeholder="0" :error="errors.rekeningBank" format="currency" @keydown.enter.prevent="focusNextInput('bon-karyawan')" />
                    </td>
                  </tr>
                  <tr class="table-row result-row">
                    <td class="field-label">
                      <label for="jumlah-kas-lancar">
                        <i class="fas fa-calculator icon"></i>
                        Jumlah Kas Lancar
                        <span class="total-badge">Total Current</span>
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField id="jumlah-kas-lancar" label="" type="number" v-model="formData.jumlah_kas_lancar"
                        placeholder="0" :error="errors.jumlahKasLancar" format="currency" :readonly="true" />
                    </td>
                  </tr>

                  <!-- BON Section -->
                  <tr class="table-row bon-row">
                    <td class="field-label">
                      <label for="bon-karyawan">
                        <i class="fas fa-users icon"></i>
                        BON Karyawan
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField id="bon-karyawan" label="" type="number" v-model="formData.bon_karyawan"
                        placeholder="0" :error="errors.bonKaryawan" format="currency" @keydown.enter.prevent="focusNextInput('bon-pusat')" />
                    </td>
                  </tr>
                  <tr class="table-row bon-row">
                    <td class="field-label">
                      <label for="bon-pusat">
                        <i class="fas fa-building icon"></i>
                        BON Pusat
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField id="bon-pusat" label="" type="number" v-model="formData.bon_pusat" placeholder="0"
                        :error="errors.bonPusat" format="currency" @keydown.enter.prevent="focusNextInput('bon-operasional')" />
                    </td>
                  </tr>
                  <tr class="table-row bon-row">
                    <td class="field-label">
                      <label for="bon-operasional">
                        <i class="fas fa-cogs icon"></i>
                        BON Biaya Operasional
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField id="bon-operasional" label="" type="number" v-model="formData.bon_operasional"
                        placeholder="0" :error="errors.bonOperasional" format="currency" @keydown.enter.prevent="focusNextInput('bon-gantung')" />
                    </td>
                  </tr>
                  <tr class="table-row bon-row">
                    <td class="field-label">
                      <label for="bon-gantung">
                        <i class="fas fa-user-times icon"></i>
                        BON Gantung (BON Prive Karyawan)
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField id="bon-gantung" label="" type="number" v-model="formData.bon_gantung" placeholder="0"
                        :error="errors.bonGantung" format="currency" @keydown.enter.prevent="focusNextInput('jumlah-kas-macet')" />
                    </td>
                  </tr>

                  <!-- Financial Status Section -->
                  <tr class="table-row status-row">
                    <td class="field-label">
                      <label for="jumlah-kas-macet">
                        <i class="fas fa-exclamation-triangle icon"></i>
                        Jumlah Kas Macet
                        <span class="warning-badge">Bad Debt</span>
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField id="jumlah-kas-macet" label="" type="number" v-model="formData.jumlah_kas_macet"
                        placeholder="0" :error="errors.jumlahKasMacet" format="currency" @keydown.enter.prevent="focusSubmitButton" />
                    </td>
                  </tr>
                  <tr class="table-row final-result-row">
                    <td class="field-label">
                      <label for="saldo-akhir">
                        <i class="fas fa-chart-bar icon"></i>
                        Saldo Akhir
                        <span class="final-badge">Final Balance</span>
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField id="saldo-akhir" label="" type="number" v-model="formData.saldo_akhir" placeholder="0"
                        :error="errors.saldoAkhir" format="currency" :readonly="true" />
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
      <FormSection title="Daftar Kas & Keuangan" description="Kumpulan item kas & keuangan yang telah ditambahkan">
        <template #content>
          <div class="list-table">
            <CashFlowTable :current-page="currentPage" :page-size="pageSize" :entries="entries" @edit="editRow"
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
import FormField from "@/components/FormField.vue";
import FormSection from "@/components/FormSection.vue";
import FormSelect from "@/components/FormSelect.vue";
import { useDate } from "@/composables/useDate";
import { useFormNavigation } from "@/composables/useFormNavigation";
import { useNotification } from "@/composables/useNotification";
import { cashFlowSchema, type CashFlowSchema } from "@/schemas/cashFlowSchema";
import {
  deleteCashFlow,
  getCashFlowList,
  postCashFlow,
  putCashFlow,
} from "@/services/cashFlowService";
import { useAuthStore } from "@/stores/auth";
import { cashFlowData, isGlobalLoading } from "@/stores/globalState";
import type { CashFlowData, CashFlowFrm, CashFlowPayload } from "@/types/cash-flow.type";
import { computed, onMounted, ref, watch } from "vue";
import ConfirmModal from "../ui/ConfirmModal.vue";
import CashFlowTable from "./CashFlowTable.vue";

interface Emits {
  (e: "update:modelValue", value: CashFlowFrm): void;
}

const emit = defineEmits<Emits>();

// Local table state
const entries = ref<CashFlowData[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);
const pageSize = ref(10);
const formSection = ref<HTMLElement | null>(null);
const highlightForm = ref(false);
const isEditing = ref(false);
const idSelected = ref<number | null>(null);
const authStore = useAuthStore();
const { notifySuccess } = useNotification();
const showConfirmModal = ref(false);
const { submitButton, focusNextInput, focusSubmitButton } = useFormNavigation();

const formData = computed({
  get: () => cashFlowData.value,
  set: (value: CashFlowPayload) => emit("update:modelValue", value),
});

const { monthOptions, getYearOptions, getCurrentDate } = useDate();
const yearOptions = getYearOptions(5);
const user = authStore.user.value;
const branchId = user?.entity_id;

// Set default values for current date
const defaultSalesData: CashFlowFrm = {
  ...getCurrentDate(),
  kas_tunai: 0,
  rekening_bank: 0,
  bon_karyawan: 0,
  bon_pusat: 0,
  bon_operasional: 0,
  bon_gantung: 0,
  jumlah_kas_lancar: 0,
  jumlah_kas_macet: 0,
  saldo_akhir: 0,
};

const errors = ref<Record<keyof CashFlowSchema, string>>({
  kasTunai: "",
  rekeningBank: "",
  bonKaryawan: "",
  bonPusat: "",
  bonOperasional: "",
  bonGantung: "",
  jumlahKasLancar: "",
  jumlahKasMacet: "",
  saldoAkhir: "",
});

// Auto-calculation watchers
const kasTunai = computed(() => safeNumber(formData.value.kas_tunai));
const rekeningBank = computed(() => safeNumber(formData.value.rekening_bank));
const jumlahKasMacet = computed(() => safeNumber(formData.value.jumlah_kas_macet));
const jumlahKasLancar = computed(() => safeNumber(formData.value.jumlah_kas_lancar));

// Watch for kas lancar calculation
watch(
  [kasTunai, rekeningBank],
  () => {
    formData.value.jumlah_kas_lancar = kasTunai.value + rekeningBank.value;
  },
  { immediate: true },
);

// Watch for saldo akhir calculation
watch(
  [jumlahKasLancar, jumlahKasMacet],
  () => {
    formData.value.saldo_akhir = Math.max(0, jumlahKasLancar.value - jumlahKasMacet.value);
  },
  { immediate: true },
);

watch(
  [
    () => formData.value.jumlah_kas_macet,
    () => formData.value.bon_karyawan,
    () => formData.value.bon_pusat,
    () => formData.value.bon_operasional,
    () => formData.value.bon_gantung,
  ],
  () => {
    const bonKaryawan = safeNumber(formData.value.bon_karyawan);
    const bonPusat = safeNumber(formData.value.bon_pusat);
    const bonOperasional = safeNumber(formData.value.bon_operasional);
    const bonGantung = safeNumber(formData.value.bon_gantung);

    formData.value.jumlah_kas_macet = bonKaryawan + bonPusat + bonOperasional + bonGantung;
  },
  { immediate: true },
);
const fetchList = async () => {
  try {
    isGlobalLoading.value = true;
    const apiData = {
      page: currentPage.value,
      per_page: pageSize.value,
      branch_id: branchId,
    };
    const ress = await getCashFlowList(apiData);
    const items = Array.isArray(ress?.data) ? ress.data : [];
    entries.value = items;
    currentPage.value = ress.meta.currentPage;
    totalPages.value = ress.meta.totalPages;
    total.value = ress.meta.total;
  } catch (error) {
    console.error("Error fetching cash flow list:", error);
  } finally {
    isGlobalLoading.value = false;
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchList();
  }
};

function safeNumber(n: unknown): number {
  const num = typeof n === "number" ? n : Number(n);
  return Number.isFinite(num) ? num : 0;
}

function validateForm(): boolean {
  const result = cashFlowSchema.safeParse({
    kasTunai: safeNumber(formData.value.kas_tunai),
    rekeningBank: safeNumber(formData.value.rekening_bank),
    bonKaryawan: safeNumber(formData.value.bon_karyawan),
    bonPusat: safeNumber(formData.value.bon_pusat),
    bonOperasional: safeNumber(formData.value.bon_operasional),
    bonGantung: safeNumber(formData.value.bon_gantung),
    jumlahKasLancar: safeNumber(formData.value.jumlah_kas_lancar),
    jumlahKasMacet: safeNumber(formData.value.jumlah_kas_macet),
    saldoAkhir: safeNumber(formData.value.saldo_akhir),
  });

  // Reset all errors
  Object.keys(errors.value).forEach((field) => {
    errors.value[field as keyof CashFlowSchema] = "";
  });

  if (!result.success) {
    result.error.issues.forEach((error) => {
      const field = error.path[0] as keyof CashFlowSchema;
      errors.value[field] = error.message;
    });
    return false;
  }
  return true;
}

async function handleSave() {
  try {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    const payload: CashFlowPayload = {
      ...formData.value,
      branch_id: branchId ?? 0,
    };

    if (isEditing.value && idSelected.value) {
      await putCashFlow(idSelected.value, payload);
      notifySuccess({ title: "Success", msg: "Data kas & keuangan berhasil diperbarui!" });
    } else {
      await postCashFlow(payload);
      notifySuccess({ title: "Success", msg: "Data kas & keuangan berhasil ditambahkan!" });
    }

    handleReset();
    await fetchList();
  } catch (error: any) {
    console.error("Error saving cash flow:", error);
  }
}

function handleReset() {
  cashFlowData.value = { ...defaultSalesData };
  isEditing.value = false;
  idSelected.value = null;
}

function editRow(id: number) {
  try {
    const row = entries.value.find((item) => Number(item.id) === Number(id));
    if (!row) {
      console.error("Row not found for editing");
      return;
    }

    // Highlight form untuk user experience
    highlightForm.value = true;
    setTimeout(() => {
      highlightForm.value = false;
    }, 2000);

    // Scroll ke form
    const top = formSection.value?.offsetTop || 0;
    const offset = 100;

    window.scrollTo({
      top: top - offset,
      behavior: "smooth",
    });

    cashFlowData.value = {
      kas_tunai: Number(row.kas_tunai),
      rekening_bank: Number(row.rekening_bank),
      bon_karyawan: Number(row.bon_karyawan),
      bon_pusat: Number(row.bon_pusat),
      bon_operasional: Number(row.bon_operasional),
      bon_gantung: Number(row.bon_gantung),
      jumlah_kas_lancar: Number(row.jumlah_kas_lancar),
      jumlah_kas_macet: Number(row.jumlah_kas_macet),
      saldo_akhir: Number(row.saldo_akhir),
      year: row.year,
      month: row.month,
    };
    isEditing.value = true;
    idSelected.value = id;
  } catch (error) {
    console.error("Error editing row:", error);
  }
}

function cancelEdit() {
  handleReset();
}

function deleteRow(id: number) {
  try {
    const row = entries.value.find((item) => Number(item.id) === id);
    showConfirmModal.value = true;
    idSelected.value = id;
  } catch (error) {
    console.error("Error deleting row:", error);
  }
}

async function handleConfirmDelete() {
  try {
    if (idSelected.value) {
      await deleteCashFlow(idSelected.value);
      const data = {
        title: "Berhasil!",
        msg: "Data kas & keuangan berhasil dihapus",
      };
      notifySuccess({ title: data.title, msg: data.msg });
      showConfirmModal.value = false;
      idSelected.value = null;
      await fetchList();
    }
  } catch (error: any) {
    console.error("Error deleting cash flow:", error);
  }
}

function handleCancelDelete() {
  showConfirmModal.value = false;
  idSelected.value = null;
}

// Fetch data when component mounts
onMounted(() => {
  fetchList();
  cashFlowData.value = { ...defaultSalesData };
});
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

/* Cash & Bank Section Styling */
.cash-row {
  background: #f0f9ff;
}

.cash-row .field-label {
  border-left: 4px solid #3b82f6;
}

.cash-row .icon {
  color: #3b82f6;
}

.cash-row .field-input {
  background: #f0f9ff;
}

.cash-row .field-input :deep(.form-input) {
  background: white;
  border-color: #bfdbfe;
}

/* BON Section Styling */
.bon-row {
  background: #fef7f0;
}

.bon-row .field-label {
  border-left: 4px solid #f97316;
}

.bon-row .icon {
  color: #f97316;
}

.bon-row .field-input {
  background: #fef7f0;
}

.bon-row .field-input :deep(.form-input) {
  background: white;
  border-color: #fed7aa;
}

/* Status Row (Bad Debt) */
.status-row {
  background: #fef2f2;
}

.status-row .field-label {
  border-left: 4px solid #ef4444;
}

.status-row .icon {
  color: #ef4444;
}

.status-row .field-input {
  background: #fef2f2;
}

.status-row .field-input :deep(.form-input) {
  background: white;
  border-color: #fecaca;
}

/* Result Row (Current Total) */
.result-row {
  background: #f0fdf4;
}

.result-row .field-label {
  border-left: 4px solid #10b981;
}

.result-row .icon {
  color: #10b981;
}

.result-row .field-input {
  background: #f0fdf4;
}

.result-row .field-input :deep(.form-input) {
  background: white;
  border-color: #bbf7d0;
}

/* Final Result Row */
.final-result-row {
  background: #fefce8;
}

.final-result-row .field-label {
  border-left: 4px solid #eab308;
}

.final-result-row .icon {
  color: #eab308;
}

.final-result-row .field-input {
  background: #fefce8;
}

.final-result-row .field-input :deep(.form-input) {
  background: white;
  border-color: #fde047;
}

/* Badges */
.total-badge {
  display: inline-block;
  background: #10b981;
  color: white;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
}

.warning-badge {
  display: inline-block;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
}

.final-badge {
  display: inline-block;
  background: #eab308;
  color: white;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
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
