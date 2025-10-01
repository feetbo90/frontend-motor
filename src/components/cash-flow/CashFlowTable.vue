<template>
    <div class="table-wrapper">
        <table class="table">
            <thead>
                <tr>
                    <th v-if="showIndex">#</th>
                    <th>Tahun</th>
                    <th>Bulan</th>
                    <th>Kas Tunai</th>
                    <th>Rekening Bank</th>
                    <th>Jlh KAS Lancar</th>
                    <th>BON Karyawan</th>
                    <th>BON Pusat</th>
                    <th>BON Biaya Operasional</th>
                    <th>BON Gantung (BON Prive Karyawan)</th>
                    <th>Jlh KAS Macet</th>
                    <th>Total Saldo Akhir</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="visibleEntries.length === 0">
                    <td :colspan="showIndex ? 12 : 6" class="empty">Belum ada data. Tambahkan data
                        piutang dan pembiayaan di atas.</td>
                </tr>
                <tr v-for="(item, idx) in visibleEntries" :key="item.row.id">
                    <td>{{ (currentPage - 1) * pageSize + idx + 1 }}</td>
                    <td align="center">{{ item.row.year }}</td>
                    <td>{{ getMonthName(item.row.month) }}</td>
                    <td>{{ format(item.row.kas_tunai) }}</td>
                    <td>{{ format(item.row.rekening_bank) }}</td>
                    <td>{{ format(item.row.jumlah_kas_lancar) }}</td>
                    <td>{{ format(item.row.bon_karyawan) }}</td>
                    <td>{{ format(item.row.bon_pusat) }}</td>
                    <td>{{ format(item.row.bon_operasional) }}</td>
                    <td>{{ format(item.row.bon_gantung) }}</td>
                    <td>{{ format(item.row.jumlah_kas_macet) }}</td>
                    <td>{{ format(item.row.saldo_akhir) }}</td>
                   
                    <td class="actions">
                        <button type="button" class="btn btn-xs btn-outline" @click="$emit('edit', item.row.id)"><i
                                class="fas fa-pen"></i> Ubah</button>
                        <button type="button" class="btn btn-xs btn-danger" @click="$emit('delete', item.row.id)"><i
                                class="fas fa-trash"></i> Hapus</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { useDate } from '@/composables/useDate'
import type { CashFlowData } from '@/types/cash-flow.type'
import { computed } from 'vue'


interface Props {
    entries: CashFlowData[]
    showIndex?: boolean
    currentPage: number
    pageSize: number
    showFooterTotal?: boolean
    numberFormatLocale?: string
    filterYear?: number | string | null
    filterMonth?: number | string | null
}
const { getMonthName } = useDate()
// Role-based access control

const props = withDefaults(defineProps<Props>(), {
    showIndex: true,
    showFooterTotal: true,
    numberFormatLocale: 'id-ID',
    filterYear: null,
    filterMonth: null
})

const visibleEntries = computed(() => {
    const yearFilter = props.filterYear !== null && props.filterYear !== '' ? Number(props.filterYear) : null
    const monthFilter = props.filterMonth !== null && props.filterMonth !== '' ? Number(props.filterMonth) : null
    return props.entries
        .map((row, index) => ({ row, originalIndex: index }))
        .filter(({ row }) => {
            const matchYear = yearFilter === null || Number(row.year) === yearFilter
            const matchMonth = monthFilter === null || Number(row.month) === monthFilter
            return matchYear && matchMonth
        })
})

function safeNumber(n: unknown): number {
    const num = typeof n === 'number' ? n : Number(n)
    return Number.isFinite(num) ? num : 0
}

function format(n: number): string {
    return new Intl.NumberFormat(props.numberFormatLocale).format(safeNumber(n))
}

</script>

<style scoped>
.table-wrapper {
    width: 100%;
    overflow-x: scroll;
}

.table {
    min-width: 700px;
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

.table th,
.table td {
    border-bottom: 1px solid var(--surface-200, #e5e7eb);
    padding: 8px 12px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
}

.table thead th {
    background: var(--surface-50, #fafafa);
}

.table .empty {
    text-align: center;
    color: #6b7280;
}

.actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.text-right {
    text-align: right;
}

.btn-danger {
    background: #ef4444;
    color: white;
}

.btn-xs {
    font-size: 12px;
    padding: 4px 8px;
}
</style>