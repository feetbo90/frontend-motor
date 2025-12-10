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
        title="Data Sumber Daya Manusia (SDM)"
        description="Input data sumber daya manusia, formasi tenaga, dan aset inventaris berdasarkan kategori"
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
                    <th class="value-header">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Personnel Section -->
                  <tr class="table-row personnel-row">
                    <td class="field-label">
                      <label for="jumlah-karyawan">
                        <i class="fas fa-users icon"></i>
                        Jumlah Karyawan (orang)
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="jumlah-karyawan"
                        label=""
                        type="number"
                        v-model="formData.jumlah_karyawan"
                        placeholder="0"
                        :error="errors.jumlahKaryawan"
                      />
                    </td>
                  </tr>
                  <tr class="table-row personnel-row">
                    <td class="field-label">
                      <label for="formasi-tenaga">
                        <i class="fas fa-sitemap icon"></i>
                        Formasi Tenaga
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="formasi-tenaga"
                        label=""
                        type="number"
                        v-model="formData.formasi_tenaga"
                        placeholder="0"
                        :error="errors.formasiTenaga"
                      />
                    </td>
                  </tr>

                  <!-- Staff Positions Section -->
                  <tr class="table-row staff-row">
                    <td class="field-label">
                      <label for="pimpinan">
                        <i class="fas fa-user-tie icon"></i>
                        Pimpinan
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="pimpinan"
                        label=""
                        type="number"
                        v-model="formData.pimpinan"
                        placeholder="0"
                        :error="errors.pimpinan"
                      />
                    </td>
                  </tr>
                  <tr class="table-row staff-row">
                    <td class="field-label">
                      <label for="kasir">
                        <i class="fas fa-cash-register icon"></i>
                        Kasir
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="kasir"
                        label=""
                        type="number"
                        v-model="formData.kasir"
                        placeholder="0"
                        :error="errors.kasir"
                      />
                    </td>
                  </tr>
                  <tr class="table-row staff-row">
                    <td class="field-label">
                      <label for="administrasi">
                        <i class="fas fa-file-alt icon"></i>
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
                      />
                    </td>
                  </tr>
                  <tr class="table-row staff-row">
                    <td class="field-label">
                      <label for="pdl">
                        <i class="fas fa-user-cog icon"></i>
                        PDL
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="pdl"
                        label=""
                        type="number"
                        v-model="formData.pdl"
                        placeholder="0"
                        :error="errors.pdl"
                      />
                    </td>
                  </tr>
                  <tr class="table-row result-row">
                    <td class="field-label">
                      <label for="formasi-kurang">
                        <i class="fas fa-user-minus icon"></i>
                        Formasi Tenaga Kurang (orang)
                        <span class="shortage-badge">Deficit</span>
                      </label>
                    </td>
                    <td class="field-input">
                      <FormField
                        id="formasi-kurang"
                        label=""
                        type="number"
                        v-model="formData.formasi_kurang"
                        placeholder="0"
                        :error="errors.formasiKurang"
                      />
                    </td>
                  </tr>

                  <!-- Assets Section (only for CABANG role) -->
                  <template v-if="isCabangRole">
                    <tr class="table-row asset-row">
                      <td class="field-label">
                        <label for="kontrak-kantor">
                          <i class="fas fa-building icon"></i>
                          Kontrak Kantor (bulan)
                        </label>
                      </td>
                      <td class="field-input">
                        <FormField
                          id="kontrak-kantor"
                          label=""
                          type="number"
                          v-model="formData.kontrak_kantor"
                          placeholder="0"
                          :error="errors.kontrakKantor"
                        />
                      </td>
                    </tr>
                    <tr class="table-row asset-row">
                      <td class="field-label">
                        <label for="inventaris-mobil">
                          <i class="fas fa-car icon"></i>
                          Inventaris Mobil (unit)
                        </label>
                      </td>
                      <td class="field-input">
                        <FormField
                          id="inventaris-mobil"
                          label=""
                          type="number"
                          v-model="formData.inventaris_mobil"
                          placeholder="0"
                          :error="errors.inventarisMobil"
                        />
                      </td>
                    </tr>
                    <tr class="table-row asset-row">
                      <td class="field-label">
                        <label for="inventaris-mobil-ket">
                          <i class="fas fa-info-circle icon"></i>
                          Inventaris Mobil Keterangan
                        </label>
                      </td>
                      <td class="field-input">
                        <FormField
                          id="inventaris-mobil-ket"
                          label=""
                          type="text"
                          v-model="formData.inventaris_mobil_ket"
                          placeholder="Keterangan inventaris mobil"
                          :error="errors.inventarisMobilKet"
                        />
                      </td>
                    </tr>

                    <!-- Depreciation Section -->
                    <tr class="table-row depreciation-row">
                      <td class="field-label">
                        <label for="sisa-inventaris">
                          <i class="fas fa-warehouse icon"></i>
                          Sisa Inventaris Pendirian
                        </label>
                      </td>
                      <td class="field-input">
                        <FormField
                          id="sisa-inventaris"
                          label=""
                          type="number"
                          v-model="formData.sisa_inventaris_pendirian"
                          placeholder="0"
                          :error="errors.sisaInventarisPendirian"
                          format="currency"
                        />
                      </td>
                    </tr>
                    <tr class="table-row depreciation-row">
                      <td class="field-label">
                        <label for="penyusutan-bulan">
                          <i class="fas fa-chart-line-down icon"></i>
                          Nilai Penyusutan per {{ monthName }}
                          <span class="depreciation-badge">Monthly</span>
                        </label>
                      </td>
                      <td class="field-input">
                        <FormField
                          id="penyusutan-bulan"
                          label=""
                          type="number"
                          v-model="formData.penyusutan_bulan"
                          placeholder="0"
                          :error="errors.penyusutanBulan"
                          format="currency"
                        />
                      </td>
                    </tr>
                  </template>
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
        title="Daftar SDM"
        description="Kumpulan item sumber daya manusia yang telah ditambahkan"
      >
        <template #content>
          <div class="list-table">
            <ResourcesTable
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
import { useNotification } from "@/composables/useNotification";
import { useRole } from "@/composables/useRole";
import { resourcesSchema, type ResourcesSchema } from "@/schemas/resourcesSchema";
import {
  deleteResources,
  getResourcesList,
  postResources,
  putResources,
} from "@/services/resourcesService";
import { useAuthStore } from "@/stores/auth";
import { isGlobalLoading, sumberDayaData } from "@/stores/globalState";
import type { ResourcesData, ResourcesFrm, ResourcesPayload } from "@/types/resource.type";
import { computed, onMounted, ref } from "vue";
import ConfirmModal from "../ui/ConfirmModal.vue";
import ResourcesTable from "./ResourcesTable.vue";

interface Emits {
  (e: "update:modelValue", value: ResourcesFrm): void;
}

const emit = defineEmits<Emits>();

// Local table state
const entries = ref<ResourcesData[]>([]);
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
const { hasRole } = useRole();
const isCabangRole = computed(() => hasRole("CABANG"));
const { getMonthName } = useDate();

const formData = computed({
  get: () => sumberDayaData.value,
  set: (value: ResourcesPayload) => emit("update:modelValue", value),
});

const monthName = computed(() => {
  return getMonthName(Number(formData.value.month));
});

const { monthOptions, getYearOptions, getCurrentDate } = useDate();
const yearOptions = getYearOptions(5); // Current year ± 5 years
const user = authStore.user.value;
const branchId = user?.entity_id;

// Set default values for current date
const defaultSalesData: ResourcesFrm = {
  ...getCurrentDate(),
  jumlah_karyawan: 0,
  formasi_tenaga: 0,
  pimpinan: 0,
  kasir: 0,
  administrasi: 0,
  pdl: 0,
  formasi_kurang: 0,
  kontrak_kantor: 0,
  inventaris_mobil: 0,
  inventaris_mobil_ket: "",
  sisa_inventaris_pendirian: 0,
  penyusutan_bulan: 0,
};

const errors = ref<Record<keyof ResourcesSchema, string>>({
  jumlahKaryawan: "",
  formasiTenaga: "",
  pimpinan: "",
  kasir: "",
  administrasi: "",
  pdl: "",
  formasiKurang: "",
  kontrakKantor: "",
  inventarisMobil: "",
  inventarisMobilKet: "",
  sisaInventarisPendirian: "",
  penyusutanBulan: "",
});

const fetchList = async () => {
  try {
    isGlobalLoading.value = true;
    const apiData = {
      page: currentPage.value,
      per_page: pageSize.value,
      branch_id: branchId,
    };
    const ress = await getResourcesList(apiData);
    const items = Array.isArray(ress?.data) ? ress.data : [];
    entries.value = items;
    currentPage.value = ress.meta.currentPage;
    totalPages.value = ress.meta.totalPages;
    total.value = ress.meta.total;
  } catch (error) {
    console.error("Error fetching resources list:", error);
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
  const result = resourcesSchema.safeParse({
    jumlahKaryawan: safeNumber(formData.value.jumlah_karyawan),
    formasiTenaga: safeNumber(formData.value.formasi_tenaga),
    pimpinan: safeNumber(formData.value.pimpinan),
    kasir: safeNumber(formData.value.kasir),
    administrasi: safeNumber(formData.value.administrasi),
    pdl: safeNumber(formData.value.pdl),
    formasiKurang: safeNumber(formData.value.formasi_kurang),
    kontrakKantor: safeNumber(formData.value.kontrak_kantor),
    inventarisMobil: safeNumber(formData.value.inventaris_mobil),
    inventarisMobilKet: formData.value.inventaris_mobil_ket,
    sisaInventarisPendirian: safeNumber(formData.value.sisa_inventaris_pendirian),
    penyusutanBulan: safeNumber(formData.value.penyusutan_bulan),
  });

  // Reset all errors
  Object.keys(errors.value).forEach((field) => {
    errors.value[field as keyof ResourcesSchema] = "";
  });

  if (!result.success) {
    result.error.issues.forEach((error) => {
      const field = error.path[0] as keyof ResourcesSchema;
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

    const payload: ResourcesPayload = {
      ...formData.value,
      branch_id: branchId ?? 0,
    };

    if (isEditing.value && idSelected.value) {
      await putResources(idSelected.value, payload);
      notifySuccess({ title: "Success Message", msg: "Data SDM berhasil diperbarui!" });
    } else {
      await postResources(payload);
      notifySuccess({ title: "Success Message", msg: "Data SDM berhasil ditambahkan!" });
    }

    handleReset();
    await fetchList();
  } catch (error: any) {
    console.error("Error saving resources:", error);
  }
}

function handleReset() {
  sumberDayaData.value = { ...defaultSalesData };
  isEditing.value = false;
  idSelected.value = null;
}

function editRow(id: number) {
  try {
    const row = entries.value.find((item) => Number(item.id) === id);
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
    const offset = 100; // offset dari atas

    window.scrollTo({
      top: top - offset,
      behavior: "smooth",
    });

    sumberDayaData.value = {
      jumlah_karyawan: row.jumlah_karyawan,
      formasi_tenaga: row.formasi_tenaga,
      pimpinan: row.pimpinan,
      kasir: row.kasir,
      administrasi: row.administrasi,
      pdl: row.pdl,
      formasi_kurang: row.formasi_kurang,
      kontrak_kantor: row.kontrak_kantor,
      inventaris_mobil: row.inventaris_mobil,
      inventaris_mobil_ket: row.inventaris_mobil_ket,
      sisa_inventaris_pendirian: row.sisa_inventaris_pendirian,
      penyusutan_bulan: row.penyusutan_bulan,
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
    const row = entries.value.find((item) => Number(item.id) === Number(id));
    showConfirmModal.value = true;
    idSelected.value = id;
  } catch (error) {
    console.error("Error deleting row:", error);
  }
}

async function handleConfirmDelete() {
  try {
    if (idSelected.value) {
      await deleteResources(idSelected.value);
      const data = {
        title: "Berhasil!",
        msg: "Data SDM berhasil dihapus",
      };
      notifySuccess({ title: data.title, msg: data.msg });
      showConfirmModal.value = false;
      idSelected.value = null;
      await fetchList();
    }
  } catch (error: any) {
    console.error("Error deleting resources:", error);
  }
}

function handleCancelDelete() {
  showConfirmModal.value = false;
  idSelected.value = null;
}

// Fetch data when component mounts
onMounted(() => {
  fetchList();
  sumberDayaData.value = { ...defaultSalesData };
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

/* Personnel Section Styling */
.personnel-row {
  background: #fef7f0;
}

.personnel-row .field-label {
  border-left: 4px solid #f97316;
}

.personnel-row .icon {
  color: #f97316;
}

.personnel-row .field-input {
  background: #fef7f0;
}

.personnel-row .field-input :deep(.form-input) {
  background: white;
  border-color: #fed7aa;
}

/* Staff Section Styling */
.staff-row {
  background: #f0f9ff;
}

.staff-row .field-label {
  border-left: 4px solid #3b82f6;
}

.staff-row .icon {
  color: #3b82f6;
}

.staff-row .field-input {
  background: #f0f9ff;
}

.staff-row .field-input :deep(.form-input) {
  background: white;
  border-color: #bfdbfe;
}

/* Result Row (Shortage) */
.result-row {
  background: #fef2f2;
}

.result-row .field-label {
  border-left: 4px solid #ef4444;
}

.result-row .icon {
  color: #ef4444;
}

.result-row .field-input {
  background: #fef2f2;
}

.result-row .field-input :deep(.form-input) {
  background: white;
  border-color: #fecaca;
}

/* Asset Section Styling */
.asset-row {
  background: #f0fdf4;
}

.asset-row .field-label {
  border-left: 4px solid #10b981;
}

.asset-row .icon {
  color: #10b981;
}

.asset-row .field-input {
  background: #f0fdf4;
}

.asset-row .field-input :deep(.form-input) {
  background: white;
  border-color: #bbf7d0;
}

/* Depreciation Section Styling */
.depreciation-row {
  background: #fefce8;
}

.depreciation-row .field-label {
  border-left: 4px solid #eab308;
}

.depreciation-row .icon {
  color: #eab308;
}

.depreciation-row .field-input {
  background: #fefce8;
}

.depreciation-row .field-input :deep(.form-input) {
  background: white;
  border-color: #fde047;
}

/* Badges */
.shortage-badge {
  display: inline-block;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
}

.depreciation-badge {
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
