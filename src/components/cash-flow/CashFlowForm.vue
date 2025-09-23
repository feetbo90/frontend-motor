<template>
    <div>
        <FormSection title="Data Sumber Daya Manusia (SDM)"
            description="Informasi jumlah dan formasi karyawan, formasi tenaga, aset dan inventaris">
            <!-- Slot untuk content -->
            <template #content>
                <div class="form-grid ">
                    <div class="date-fields">
                        <FormSelect id="tahun" label="Tahun" v-model="cashFlowData.tahun" placeholder="Pilih Tahun"
                            :options="yearOptions" />
                        <FormSelect id="bulan" label="Bulan" v-model="cashFlowData.bulan" placeholder="Pilih Bulan"
                            :options="monthOptions" />
                    </div>
                    <!-- Kas Tunai & Rekning Bank -->
                    <div class="form-group" style="margin-top: 0 !important;">
                        <h4 class="form-group-title">Detail Kas Tunai & Rekening Bank</h4>
                        <p>Informasi Data Kas Tunai & Rekening Bank</p>
                        <div class="form-group-content">
                            <FormField id="kas-tunai" label="Kas Tunai" type="number" v-model="cashFlowData.kasTunai"
                                placeholder="0" />
                            <FormField id="rekening-bank" label="Rekening Bank" type="number"
                                v-model="cashFlowData.rekeningBank" placeholder="0" />
                            <FormField id="jlh-kas-lancar" label="Jumlah Kas Lancar" type="number"
                                v-model="cashFlowData.jlh_kas_lancar" placeholder="0" />
                        </div>
                    </div>
                    <!-- BON Kas -->
                    <div class="form-group" style="margin-top: 0 !important;">
                        <h4 class="form-group-title">BON KAS</h4>
                        <p>Informasi Data berbagai jenis BON kas perusahaan</p>
                        <div class="form-group-content">
                            <FormField id="bon-karyawan" label="BON Karyawan" type="number"
                                v-model="cashFlowData.bonKaryawan" placeholder="0" />
                            <FormField id="bon-pusat" label="BON Pusat" type="number" v-model="cashFlowData.bonPusat"
                                placeholder="0" />
                            <FormField id="bon-biaya-operasional" label="BON Biaya Operasional" type="number"
                                v-model="cashFlowData.bonBiayaOps" placeholder="0" />
                            <FormField id="bon-gantung" label="BON Gantung (BON Prive Karyawan)" type="number"
                                v-model="cashFlowData.bonGantung" placeholder="0" />
                            <FormField id="jlh-kas-macet" label="Jumlah Kas Macet" type="number"
                                v-model="cashFlowData.jlh_kas_macet" placeholder="0" />
                        </div>
                    </div>
                    <FormField id="total-saldo-akhir" label="Total Saldo Akhir" type="number"
                    v-model="cashFlowData.total_saldo_akhir" placeholder="0" />
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
                <CashFlowTable :entries="entries" @edit="editRow" @delete="deleteRow" />
            </template>
        </FormSection>
    </div>
</template>

<script setup lang="ts">
import FormField from '@/components/FormField.vue'
import FormSection from '@/components/FormSection.vue'
import FormSelect from '@/components/FormSelect.vue'
import { useDate } from '@/composables/useDate'
import type { CashFlowData } from '@/types/cash-flow.type'
import { computed, ref } from 'vue'
import CashFlowTable from './CashFlowTable.vue'


type DataEntry = CashFlowData & { id: number }

interface Props {
    modelValue: CashFlowData
}

interface Emits {
    (e: 'update:modelValue', value: CashFlowData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const cashFlowData = computed({
    get: () => props.modelValue,
    set: (value: CashFlowData) => emit('update:modelValue', value)
})

// Use date composable
const { monthOptions, getYearOptions, getCurrentDate } = useDate()
const yearOptions = getYearOptions(5) // Current year ± 5 years
const currentDate = getCurrentDate()

// Set default values for current date
const defaultData = {
    ...getCurrentDate(),
    kasTunai: 0,
    rekeningBank: 0,
    bonKaryawan: 0,
    bonPusat: 0,
    bonBiayaOps: 0,
    bonGantung: 0,
    jlh_kas_lancar: 0,
    jlh_kas_macet: 0,
    total_saldo_akhir: 0,
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
    const newItem: CashFlowData = {
        tahun: safeNumber(cashFlowData.value.tahun),
        bulan: safeNumber(cashFlowData.value.bulan),
        kasTunai: safeNumber(cashFlowData.value.kasTunai),
        rekeningBank: safeNumber(cashFlowData.value.rekeningBank),
        bonKaryawan: safeNumber(cashFlowData.value.bonKaryawan),
        bonPusat: safeNumber(cashFlowData.value.bonPusat),
        bonBiayaOps: safeNumber(cashFlowData.value.bonBiayaOps),
        bonGantung: safeNumber(cashFlowData.value.bonGantung),
        jlh_kas_lancar: safeNumber(cashFlowData.value.jlh_kas_lancar),
        jlh_kas_macet: safeNumber(cashFlowData.value.jlh_kas_macet),
        total_saldo_akhir: safeNumber(cashFlowData.value.total_saldo_akhir),
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
        tahun: row.tahun, bulan: row.bulan, kasTunai: row.kasTunai, rekeningBank: row.rekeningBank, bonKaryawan: row.bonKaryawan, bonPusat: row.bonPusat, bonBiayaOps: row.bonBiayaOps, bonGantung: row.bonGantung, jlh_kas_lancar: row.jlh_kas_lancar, jlh_kas_macet: row.jlh_kas_macet,total_saldo_akhir: row.total_saldo_akhir
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