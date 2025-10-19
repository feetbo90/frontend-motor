<template>
    <div ref="formSection">
        <form @submit.prevent="handleSave">
            <ConfirmModal v-if="showConfirmModal" title="Hapus Item?"
                description="Apakah kamu yakin ingin menghapus item ini? Tindakan ini tidak bisa dibatalkan."
                confirmText="Delete" cancelText="Cancel" @confirm="handleConfirmDelete" @cancel="handleCancelDelete" />
            <FormSection title="Kas & Keuangan"
                description="Informasi Kas & Keuangan "
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

                        <!-- Kas Tunai & Rekning Bank -->
                        <div class="form-group" style="margin-top: 0 !important;">
                            <h4 class="form-group-title">Detail Kas Tunai & Rekening Bank</h4>
                            <p>Informasi Data Kas Tunai & Rekening Bank</p>
                            <div class="form-group-content">
                                <FormField id="kas-tunai" label="Kas Tunai" type="number" v-model="formData.kas_tunai"
                                    placeholder="0" :error="errors.kasTunai" />
                                <FormField id="rekening-bank" label="Rekening Bank" type="number"
                                    v-model="formData.rekening_bank" placeholder="0" :error="errors.rekeningBank" />
                                <FormField id="jlh-kas-lancar" label="Jumlah Kas Lancar" type="number"
                                    v-model="formData.jumlah_kas_lancar" placeholder="0"
                                    :error="errors.jumlahKasLancar" />
                            </div>
                        </div>
                        <!-- BON Kas -->
                        <div class="form-group" style="margin-top: 0 !important;">
                            <h4 class="form-group-title">BON KAS</h4>
                            <p>Informasi Data berbagai jenis BON kas perusahaan</p>
                            <div class="form-group-content">
                                <FormField id="bon-karyawan" label="BON Karyawan" type="number"
                                    v-model="formData.bon_karyawan" placeholder="0" :error="errors.bonKaryawan" />
                                <FormField id="bon-pusat" label="BON Pusat" type="number" v-model="formData.bon_pusat"
                                    placeholder="0" :error="errors.bonPusat" />
                                <FormField id="bon-biaya-operasional" label="BON Biaya Operasional" type="number"
                                    v-model="formData.bon_operasional" placeholder="0" :error="errors.bonOperasional" />
                                <FormField id="bon-gantung" label="BON Gantung (BON Prive Karyawan)" type="number"
                                    v-model="formData.bon_gantung" placeholder="0" :error="errors.bonGantung" />
                                <FormField id="jlhO-kas-macet" label="Jumlah Kas Macet" type="number"
                                    v-model="formData.jumlah_kas_macet" placeholder="0" :error="errors.jumlahKasMacet" />
                                <FormField id="saldo-akhir" label="Saldo Akhir" type="number"
                                    v-model="formData.saldo_akhir" placeholder="0" :error="errors.saldoAkhir" />
                            </div>
                        </div>
                    </div>
                </template>

                <!-- Slot untuk footer -->
                <template #footer>
                    <div class="footer-btn">
                        <button class="btn btn-primary" type="submit"> <i class="fas"
                                :class="isEditing ? 'fa-save' : 'fa-plus'" />
                            {{
                                isEditing ? 'Simpan Perubahan' : 'Tambah ke Daftar'
                            }}</button>
                        <button type="button" class="btn btn-reset" @click="handleReset"><i
                                class="fas fa-rotate-left"></i>
                            Reset</button>
                        <button type="button" v-if="isEditing" class="btn btn-outline" @click="cancelEdit"><i
                                class="fas fa-ban"></i> Batal
                            Edit</button>
                    </div>
                </template>
            </FormSection>
            <FormSection title="Daftar Kas & Keuangan" description="Kumpulan item kas & keuangan yang telah ditambahkan">
                <template #content>
                    <div class="list-table">
                        <CashFlowTable :current-page="currentPage" :page-size="pageSize" :entries="entries"
                            @edit="editRow" @delete="deleteRow" />
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
import { cashFlowSchema, type CashFlowSchema } from '@/schemas/cashFlowSchema'
import { deleteCashFlow, getCashFlowList, postCashFlow, putCashFlow } from '@/services/cashFlowService'
import { useAuthStore } from '@/stores/auth'
import { cashFlowData, isGlobalLoading } from '@/stores/globalState'
import type { CashFlowData, CashFlowFrm, CashFlowPayload } from '@/types/cash-flow.type'
import { computed, onMounted, ref } from 'vue'
import ConfirmModal from '../ui/ConfirmModal.vue'
import CashFlowTable from './CashFlowTable.vue'

interface Emits {
    (e: 'update:modelValue', value: CashFlowFrm): void
}

const emit = defineEmits<Emits>()

// Local table state
const entries = ref<CashFlowData[]>([])
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
    get: () => cashFlowData.value,
    set: (value: CashFlowPayload) => emit('update:modelValue', value)
})

const { monthOptions, getYearOptions, getCurrentDate } = useDate()
const yearOptions = getYearOptions(5) // Current year ± 5 years
const user = authStore.user.value
const branchId = user?.entity_id

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
}

const errors = ref<Record<keyof CashFlowSchema, string>>({
    kasTunai: '',
    rekeningBank: '',
    bonKaryawan: '',
    bonPusat: '',
    bonOperasional: '',
    bonGantung: '',
    jumlahKasLancar: '',
    jumlahKasMacet: '',
    saldoAkhir: '',
})


const fetchList = async (page = 1) => {
    try {

        // getSales expects an object, not just branchId
        const apiData = await getCashFlowList({ page, branch_id: branchId })
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
        const payload: CashFlowPayload = {
            branch_id: Number(branchId),
            ...formData.value
        }
        if (isEditing.value && idSelected.value !== null) {
            await putCashFlow(idSelected.value, payload)
        } else {
            await postCashFlow(payload)
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
    cashFlowData.value = { ...defaultSalesData }
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
            const data = await deleteCashFlow(idSelected.value)
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