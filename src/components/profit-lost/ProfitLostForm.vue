<template>
    <div>
        <FormSection title="Data Laba Rugi" description="Input data laba rugi dan modal perusahaan">
            <!-- Slot untuk content -->
            <template #content>
                <div class="form-grid ">
                    <div class="date-fields">
                        <FormSelect id="tahun" label="Tahun" v-model="profitLostData.tahun" placeholder="Pilih Tahun"
                            :options="yearOptions" />
                        <FormSelect id="bulan" label="Bulan" v-model="profitLostData.bulan" placeholder="Pilih Bulan"
                            :options="monthOptions" />
                    </div>
                    <div class="form-fields">
                        <FormField id="laba-rugi-bulan" :label="`Laba/Rugi Bulan ${getMonthName(profitLostData.bulan)}`" type="number"
                            v-model="profitLostData.labaRugiBulan" placeholder="0" />
                        <FormField id="laba-rugi-kumulatif" label="Jumlah Laba / Rugi Kumulatif" type="number"
                            v-model="profitLostData.labaRugiKumulatif" placeholder="0" />
                        <FormField id="penarikan-laba" label="Penarikan Laba" type="number"
                            v-model="profitLostData.penarikanLaba" placeholder="0" />
                        <FormField id="jumlah-modal" label="Jumlah Modal" type="number"
                            v-model="profitLostData.jumlahModal" placeholder="0" />
                    </div>
                </div>
            </template>

            <!-- Slot untuk footer -->
            <template #footer>
                <div class="footer-btn">
                    <button class="btn btn-primary" @click="handleSave"> <i class="fas"
                            :class="isEditing ? 'fa-save' : 'fa-plus'" /> {{ isEditing ? 'Simpan Perubahan' : 'Tambah ke Daftar'
                        }}</button>
                    <button class="btn btn-reset" @click="handleReset"><i class="fas fa-rotate-left"></i> Reset</button>
                    <button v-if="isEditing" class="btn btn-outline" @click="cancelEdit"><i class="fas fa-ban"></i>
                        Batal
                        Edit</button>
                </div>
            </template>
        </FormSection>

        <FormSection title="Daftar Laba Rugi" description="Kumpulan item laba rugi yang telah ditambahkan">
            <template #content>
                <ProfitLostTable :entries="entries" @edit="editRow" @delete="deleteRow" />
            </template>
        </FormSection>
    </div>
</template>

<script setup lang="ts">
import FormField from '@/components/FormField.vue'
import FormSection from '@/components/FormSection.vue'
import FormSelect from '@/components/FormSelect.vue'
import { useDate } from '@/composables/useDate'
import type { ProfitLostData } from '@/types/profit-lost.type'
import { computed, ref } from 'vue'
import ProfitLostTable from './ProfitLostTable.vue'

type DataEntry = ProfitLostData & { id: number }

interface Props {
    modelValue: ProfitLostData
}

interface Emits {
    (e: 'update:modelValue', value: ProfitLostData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { getMonthName } = useDate()

const profitLostData = computed({
    get: () => props.modelValue,
    set: (value: ProfitLostData) => emit('update:modelValue', value)
})

// Use date composable
const { monthOptions, getYearOptions, getCurrentDate } = useDate()
const yearOptions = getYearOptions(5) // Current year ± 5 years
const currentDate = getCurrentDate()

// Set default values for current date
const defaultData = {
    ...getCurrentDate(),
    labaRugiBulan: 0,
    labaRugiKumulatif: 0,
    penarikanLaba: 0,
    jumlahModal: 0,
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
    const newItem: ProfitLostData = {
        tahun: safeNumber(profitLostData.value.tahun),
        bulan: safeNumber(profitLostData.value.bulan),
        labaRugiBulan: safeNumber(profitLostData.value.labaRugiBulan),
        labaRugiKumulatif: safeNumber(profitLostData.value.labaRugiKumulatif),
        penarikanLaba: safeNumber(profitLostData.value.penarikanLaba),
        jumlahModal: safeNumber(profitLostData.value.jumlahModal),
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
    emit('update:modelValue', { tahun: row.tahun, bulan: row.bulan, labaRugiBulan: row.labaRugiBulan, labaRugiKumulatif: row.labaRugiKumulatif, penarikanLaba: row.penarikanLaba, jumlahModal: row.jumlahModal })
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