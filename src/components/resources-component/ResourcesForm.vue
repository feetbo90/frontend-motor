<template>
    <div>
        <FormSection title="Data Sumber Daya Manusia (SDM)"
            description="Informasi jumlah dan formasi karyawan, formasi tenaga, aset dan inventaris">
            <!-- Slot untuk content -->
            <template #content>
                <div class="form-grid ">
                    <div class="date-fields">
                        <FormSelect id="tahun" label="Tahun" v-model="resourcesData.tahun" placeholder="Pilih Tahun"
                            :options="yearOptions" />
                        <FormSelect id="bulan" label="Bulan" v-model="resourcesData.bulan" placeholder="Pilih Bulan"
                            :options="monthOptions" />
                    </div>
                        <!-- Formasi Tenaga Section -->
                        <div class="form-group" v-if="!isCabangRole">
                            <h4 class="form-group-title">Detail Formasi Tenaga</h4>
                            <p>Breakdown kebutuhan tenaga kerja</p>
                            <div class="form-group-content">
                                <FormField id="jumlah-karyawan" label="Jumlah Karyawan (orang)" type="number"
                                    v-model="resourcesData.jumlahKaryawan" placeholder="0" />
                                <FormField id="pimpinan" label="Pimpinan" type="number"
                                    v-model="resourcesData.formasi.pimpinan" placeholder="0" />
                                <FormField id="kasir" label="Kasir" type="number" v-model="resourcesData.formasi.kasir"
                                    placeholder="0" />
                                <FormField id="administrasi" label="Administrasi" type="number"
                                    v-model="resourcesData.formasi.administrasi" placeholder="0" />
                                <FormField id="pdl" label="PDL" type="number" v-model="resourcesData.formasi.pdl"
                                    placeholder="0" />
                                <FormField id="formasi-kurang" label="Formasi Tenaga Kurang (orang)" type="number"
                                    v-model="resourcesData.formasi.formasiKurang" placeholder="0" />
                            </div>
                        </div>
                        <!-- Aset dan Inventaris section -->
                        <div class="form-group" v-if="isCabangRole">
                            <h4 class="form-group-title">Aset dan Inventaris</h4>
                            <p>Data kontrak dan inventaris perusahaan</p>
                            <div class="form-group-content">
                                <div class="section-form">
                                    <div class="field-form">
                                        <FormField id="sisa-kontrak-kantor" label="Sisa Kontrak Kantor (bulan)"
                                            v-if="isCabangRole" type="number" v-model="resourcesData.sisaKontrakKantor"
                                            placeholder="0" />
                                        <FormField id="inventaris-mobil" label="Inventaris Mobil (unit)" type="number"
                                            v-if="isCabangRole" v-model="resourcesData.inventarisMobil"
                                            placeholder="0" />
                                    </div>
                                    <div class="form-group">
                                        <h4 class="form-group-title">Nilai Sisa Inventaris Pendirian</h4>
                                        <p>Data sisa inventaris dan penyusutan per {{ getMonthName(resourcesData.bulan)
                                        }}</p>
                                        <div class="form-group-content">
                                            <FormField id="nilai-sisa-inventaris" label="Sisa Inventaris Pendirian"
                                                v-if="isCabangRole" type="number"
                                                v-model="resourcesData.nilaiSisaInventaris" placeholder="0" />
                                            <FormField id="penyusutan-per-bulan"
                                                :label="`Nilai penyusutan per ${currentPeriod}`" v-if="isCabangRole"
                                                type="number" v-model="resourcesData.penyusutanPerBulan"
                                                placeholder="0" />
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
                    <button class="btn btn-primary" @click="handleSave"> <i class="fas"
                            :class="isEditing ? 'fa-save' : 'fa-plus'" /> {{ isEditing ? 'Simpan Perubahan' : 'Tambah ke Daftar'}}</button>
                    <button class="btn btn-reset" @click="handleReset"><i class="fas fa-rotate-left"></i> Reset</button>
                    <button v-if="isEditing" class="btn btn-outline" @click="cancelEdit"><i class="fas fa-ban"></i>
                        Batal
                        Edit</button>
                </div>
            </template>
        </FormSection>

        <FormSection title="Daftar SDM" description="Kumpulan item sumber daya manusia yang telah ditambahkan">
            <template #content>
                <ResourcesTable :entries="entries" @edit="editRow" @delete="deleteRow" />
            </template>
        </FormSection>
    </div>
</template>

<script setup lang="ts">
import FormField from '@/components/FormField.vue'
import FormSection from '@/components/FormSection.vue'
import FormSelect from '@/components/FormSelect.vue'
import { useDate } from '@/composables/useDate'
import { useRole } from '@/composables/useRole'
import { currentPeriod } from '@/stores/globalState'
import type { ResourcesData } from '@/types/resource.type'
import { computed, ref } from 'vue'
import ResourcesTable from './ResourcesTable.vue'


type DataEntry = ResourcesData & { id: number }

interface Props {
    modelValue: ResourcesData
}

interface Emits {
    (e: 'update:modelValue', value: ResourcesData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
// Role-based access control
const { hasRole } = useRole()
const isCabangRole = computed(() => hasRole('cabang'))

const { getMonthName } = useDate()

const resourcesData = computed({
    get: () => props.modelValue,
    set: (value: ResourcesData) => emit('update:modelValue', value)
})

// Use date composable
const { monthOptions, getYearOptions, getCurrentDate } = useDate()
const yearOptions = getYearOptions(5) // Current year ± 5 years
const currentDate = getCurrentDate()

// Set default values for current date
const defaultData = {
    ...getCurrentDate(),
    jumlahKaryawan: 0,
    formasi: {
        pimpinan: 0,
        kasir: 0,
        administrasi: 0,
        pdl: 0,
        formasiKurang: 0,
    },
    sisaKontrakKantor: 0,
    inventarisMobil: 0,
    nilaiSisaInventaris: 0,
    penyusutanPerBulan: 0,
    tahun: currentDate.tahun,
    bulan: currentDate.bulan
}

// Local table state
const entries = ref<DataEntry[]>([])
const editingIndex = ref<number | null>(null)
let autoId = 1

const isEditing = computed(() => editingIndex.value !== null)

function safeNumber(n: unknown): number {
    const num = typeof n === 'number' ? n : Number(n)
    return Number.isFinite(num) ? num : 0
}

function handleSave(): void {
    const newItem: ResourcesData = {
        tahun: safeNumber(resourcesData.value.tahun),
        bulan: safeNumber(resourcesData.value.bulan),
        jumlahKaryawan: safeNumber(resourcesData.value.jumlahKaryawan),
        sisaKontrakKantor: safeNumber(resourcesData.value.sisaKontrakKantor),
        inventarisMobil: safeNumber(resourcesData.value.inventarisMobil),
        nilaiSisaInventaris: safeNumber(resourcesData.value.nilaiSisaInventaris),
        penyusutanPerBulan: resourcesData.value.penyusutanPerBulan,
        formasi: {
            pimpinan: resourcesData.value.formasi.pimpinan,
            kasir: resourcesData.value.formasi.kasir,
            administrasi: resourcesData.value.formasi.administrasi,
            pdl: resourcesData.value.formasi.pdl,
            formasiKurang: resourcesData.value.formasi.formasiKurang
        }
    }

    if (isEditing.value && editingIndex.value !== null) {
        const idx = editingIndex.value
        entries.value[idx] = { ...entries.value[idx], ...newItem }
        editingIndex.value = null
    } else {
        entries.value.push({ id: autoId++, ...newItem })
    }

    handleReset()
}

function handleReset(): void {
    emit('update:modelValue', { ...defaultData })
}

function editRow(index: number): void {
    const row = entries.value[index]
    if (!row) return
    editingIndex.value = index
    emit('update:modelValue', {
        tahun: row.tahun, bulan: row.bulan, jumlahKaryawan: row.jumlahKaryawan, sisaKontrakKantor: row.sisaKontrakKantor, inventarisMobil: row.inventarisMobil, nilaiSisaInventaris: row.nilaiSisaInventaris, penyusutanPerBulan: row.penyusutanPerBulan, formasi: {
            pimpinan: row.formasi.pimpinan,
            kasir: row.formasi.kasir,
            administrasi: row.formasi.administrasi,
            pdl: row.formasi.pdl,
            formasiKurang: row.formasi.formasiKurang,
        }
    })
}

function cancelEdit(): void {
    editingIndex.value = null
    handleReset()
}

function deleteRow(index: number): void {
    const row = entries.value[index]
    if (!row) return
    const ok = window.confirm('Hapus item ini?')
    if (!ok) return
    entries.value.splice(index, 1)
    if (editingIndex.value !== null && index === editingIndex.value) {
        cancelEdit()
    }
}
</script>

<style scoped>
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