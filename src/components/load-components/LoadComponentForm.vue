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
        description="Input semua komponen beban perusahaan"
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
            <div class="form-fields">
              <FormField
                id="gaji-insentif"
                label="Gaji/Insentif/Bonus"
                type="number"
                v-model="formData.gaji"
                placeholder="0"
                format="currency"
              />
              <FormField
                id="admin"
                label="Administrasi"
                type="number"
                v-model="formData.admin"
                placeholder="0"
                :error="errors.admin"
              />
              <FormField
                id="operasional"
                label="Operasional"
                type="number"
                v-model="formData.operasional"
                placeholder="0"
                :error="errors.operasional"
              />
              <FormField
                id="beban-umum-operasional"
                label="Jumlah Beban Umum Operasional"
                type="number"
                v-model="formData.beban_umum_operasional"
                placeholder="0"
                :error="errors.bebanUmumOperasional"
                format="currency"
              />

              <!-- Fields for Cabang role only -->
              <FormField
                id="penyusutan-aktiva"
                label="Penyusutan Aktiva"
                type="number"
                v-model="formData.penyusutan_aktiva"
                placeholder="0"
                :error="errors.penyusutanAktiva"
              />
              <FormField
                id="cadangan-piutang"
                label="Cadangan Piutang"
                type="number"
                v-model="formData.cadangan_piutang"
                placeholder="0"
                :error="errors.cadanganPiutang"
                format="currency"
              />

              <!-- Fields for all roles except Cabang -->
              <FormField
                id="cadangan-stock"
                label="Cadangan Stock"
                type="number"
                v-model="formData.cadangan_stock"
                placeholder="0"
                :error="errors.cadanganStock"
                format="currency"
              />
              <FormField
                id="total"
                label="Total Beban & Biaya"
                type="number"
                v-model="formData.total"
                placeholder="0"
                :error="errors.total"
                format="currency"
              />
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
        title="Beban Operasional"
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
import { computed, onMounted, ref } from "vue";
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
