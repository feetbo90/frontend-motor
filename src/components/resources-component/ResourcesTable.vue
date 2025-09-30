<template>
    <div class="table-wrapper">
        <table class="table">
            <thead>
                <tr>
                    <th v-if="showIndex">#</th>
                    <th>Tahun</th>
                    <th>Bulan</th>
                    <th v-if="!isCabangRole">Jumlah Karyawan</th>
                    <th v-if="!isCabangRole">Formasi Tenaga</th>
                    <th v-if="isCabangRole">Aset dan Inventaris</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="visibleEntries.length === 0">
                    <td :colspan="showIndex ? !isCabangRole ? 6 : 5 : 6" class="empty">Belum ada data. Tambahkan data
                        piutang dan pembiayaan di atas.</td>
                </tr>
                <tr v-for="(item, idx) in visibleEntries" :key="item.row.id">
                    <td>{{ (currentPage - 1) * pageSize + idx + 1 }}</td>
                    <td align="center">{{ item.row.year }}</td>
                    <td>{{ getMonthName(item.row.month) }}</td>
                    <td v-if="!isCabangRole">{{ format(item.row.jumlah_karyawan) }}</td>
                    <td v-if="!isCabangRole">
                        <div class="formasi-grouping">
                            <div><strong>Jumlah Karyawan:</strong> {{ format(item.row.jumlah_karyawan) }}</div>
                            <div><strong>Pimpinan:</strong> {{ format(item.row.pimpinan) }}</div>
                            <div><strong>Kasir:</strong> {{ format(item.row.kasir) }}</div>
                            <div><strong>Administrasi:</strong> {{ format(item.row.administrasi) }}</div>
                            <div><strong>PDL:</strong> {{ format(item.row.pdl) }}</div>
                            <div><strong>Formasi Tenaga:</strong> {{ format(item.row.formasi_tenaga) }}</div>
                            <div><strong>Formasi Tenaga Kurang:</strong> {{ format(item.row.formasi_kurang) }}</div>
                        </div>
                    </td>
                    <td v-if="isCabangRole">
                        <div class="formasi-grouping">
                            <div><strong>Sisa Kontrak Kantor:</strong> {{ format(item.row.kontrak_kantor) }}</div>
                            <div><strong>Inventaris Mobil:</strong> {{ format(item.row.inventaris_mobil) }}</div>
                            <div><strong>Keterangan Inventaris Mobil:</strong> {{ item.row.inventaris_mobil_ket }}</div>
                            <div><strong>Sisa Inventaris Pendirian:</strong> {{ format(item.row.sisa_inventaris_pendirian) }}
                            </div>
                            <div><strong>Nilai Penyusutan:</strong> {{ format(item.row.penyusutan_bulan) }}</div>
                        </div>
                    </td>
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
import { useRole } from '@/composables/useRole'
import type { ResourcesData } from '@/types/resource.type'
import { computed } from 'vue'


interface Props {
    entries: ResourcesData[]
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
const { hasRole } = useRole()
const isCabangRole = computed(() => hasRole('CABANG'))
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