<template>
    <div ref="formSection">
        <form @submit.prevent="handleSave">
            <ConfirmModal v-if="showConfirmModal" title="Hapus Item?"
                description="Apakah kamu yakin ingin menghapus item ini? Tindakan ini tidak bisa dibatalkan."
                confirmText="Delete" cancelText="Cancel" @confirm="handleConfirmDelete" @cancel="handleCancelDelete" />
            <FormSection title="Data Sumber Daya Manusia (SDM)"
                description="Informasi jumlah dan formasi karyawan, formasi tenaga, aset dan inventaris"
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
                        <!-- Formasi Tenaga Section -->
                        <div class="form-group">
                            <h4 class="form-group-title">Detail Formasi Tenaga</h4>
                            <p>Breakdown kebutuhan tenaga kerja</p>
                            <div class="form-group-content">
                                <FormField id="jumlah-karyawan" label="Jumlah Karyawan (orang)" type="number"
                                    v-model="formData.jumlah_karyawan" placeholder="0" :error="errors.jumlahKaryawan" />
                                <FormField id="formasi-tenaga" label="Formasi Tenaga" type="number"
                                    v-model="formData.formasi_tenaga" placeholder="0" :error="errors.formasiTenaga" />
                                <FormField id="pimpinan" label="Pimpinan" type="number" v-model="formData.pimpinan"
                                    placeholder="0" :error="errors.pimpinan" />
                                <FormField id="kasir" label="Kasir" type="number" v-model="formData.kasir"
                                    placeholder="0" :error="errors.kasir" />
                                <FormField id="administrasi" label="Administrasi" type="number"
                                    v-model="formData.administrasi" placeholder="0" :error="errors.administrasi" />
                                <FormField id="pdl" label="PDL" type="number" v-model="formData.pdl" placeholder="0"
                                    :error="errors.pdl" />
                                <FormField id="formasi-kurang" label="Formasi Tenaga Kurang (orang)" type="number"
                                    v-model="formData.formasi_kurang" placeholder="0" :error="errors.formasiKurang" />
                            </div>
                        </div>
                        <!-- Aset dan Inventaris section -->
                        <div class="form-group" v-if="isCabangRole">
                            <h4 class="form-group-title">Aset dan Inventaris</h4>
                            <p>Data kontrak dan inventaris perusahaan</p>
                            <div class="form-group-content">
                                <div class="section-form">
                                    <div class="field-form">
                                        <FormField id="kontrak-kantor" label="Kontrak Kantor (bulan)"
                                            v-if="isCabangRole" type="number" v-model="formData.kontrak_kantor"
                                            placeholder="0" :error="errors.kontrakKantor" />
                                        <FormField id="inventaris-mobil" label="Inventaris Mobil (unit)" type="number"
                                            v-if="isCabangRole" v-model="formData.inventaris_mobil" placeholder="0"
                                            :error="errors.inventarisMobil" />
                                        <FormField id="inventaris-mobil-kt" label="Inventaris Mobil Keterangan"
                                            v-if="isCabangRole" v-model="formData.inventaris_mobil_ket" placeholder="0"
                                            :error="errors.inventarisMobilKet" />
                                    </div>
                                    <div class="form-group">
                                        <h4 class="form-group-title">Nilai Sisa Inventaris Pendirian</h4>
                                        <p>Data sisa inventaris dan penyusutan per {{ monthName}}</p>
                                        <div class="form-group-content">
                                            <FormField id="nilai-sisa-inventaris" label="Sisa Inventaris Pendirian"
                                                v-if="isCabangRole" type="number"
                                                v-model="formData.sisa_inventaris_pendirian" placeholder="0"
                                                :error="errors.sisaInventarisPendirian" />
                                            <FormField id="penyusutan-per-bulan"
                                                :label="`Nilai penyusutan per ${monthName}`" v-if="isCabangRole"
                                                type="number" v-model="formData.penyusutan_bulan" placeholder="0"
                                                :error="errors.penyusutanBulan" />
                                        </div>
                                    </div>
                                </div>
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
            <FormSection title="Daftar SDM" description="Kumpulan item sumber daya manusia yang telah ditambahkan">
                <template #content>
                    <div class="list-table">
                        <ResourcesTable :current-page="currentPage" :page-size="pageSize" :entries="entries"
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
import { resourcesSchema, type ResourcesSchema } from '@/schemas/resourcesSchema'
import { deleteResources, getResourcesList, postResources, putResources } from '@/services/resourcesService'
import { useAuthStore } from '@/stores/auth'
import { currentPeriod, isGlobalLoading, sumberDayaData } from '@/stores/globalState'
import type { ResourcesData, ResourcesFrm, ResourcesPayload } from '@/types/resource.type'
import { computed, onMounted, ref } from 'vue'
import ConfirmModal from '../ui/ConfirmModal.vue'
import ResourcesTable from './ResourcesTable.vue'
import { useRole } from '@/composables/useRole'

interface Emits {
    (e: 'update:modelValue', value: ResourcesFrm): void
}

const emit = defineEmits<Emits>()

// Local table state
const entries = ref<ResourcesData[]>([])
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
const { hasRole } = useRole()
const isCabangRole = computed(() => hasRole('CABANG'))
const { getMonthName } = useDate()


const formData = computed({
    get: () => sumberDayaData.value,
    set: (value: ResourcesPayload) => emit('update:modelValue', value)
})
const monthName = computed(() => {
    return getMonthName(Number(formData.value.month))
})
const { monthOptions, getYearOptions, getCurrentDate } = useDate()
const yearOptions = getYearOptions(5) // Current year ± 5 years
const user = authStore.user.value
const branchId = user?.entity_id

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
    inventaris_mobil_ket: '',
    sisa_inventaris_pendirian: 0,
    penyusutan_bulan: 0,
}

const errors = ref<Record<keyof ResourcesSchema, string>>({
    jumlahKaryawan: '',
    formasiTenaga: '',
    pimpinan: '',
    kasir: '',
    administrasi: '',
    pdl: '',
    formasiKurang: '',
    kontrakKantor: '',
    inventarisMobil: '',
    inventarisMobilKet: '',
    sisaInventarisPendirian: '',
    penyusutanBulan: '',
})


const fetchList = async (page = 1) => {
    try {
        // getSales expects an object, not just branchId
        const apiData = await getResourcesList({ page, branch_id: branchId })
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
        const payload: ResourcesPayload = {
            branch_id: Number(branchId),
            ...formData.value
        }
        if (isEditing.value && idSelected.value !== null) {
            await putResources(idSelected.value, payload)
        } else {
            await postResources(payload)
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
    sumberDayaData.value = { ...defaultSalesData }
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
            const data = await deleteResources(idSelected.value)
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