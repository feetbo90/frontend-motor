<template>
  <div class="table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th v-if="showIndex">#</th>
          <th>Tahun</th>
          <th>Bulan</th>
          <th>Kontan</th>
          <th>Kredit</th>
          <th>Leasing</th>
          <!-- <th>Total</th> -->
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="visibleEntries.length === 0">
          <td :colspan="showIndex ? 7 : 6" class="empty">Belum ada data. Tambahkan data penjualan di atas.</td>
        </tr>
        <tr v-for="(item, idx) in visibleEntries" :key="item.row.id">
          <td>{{ (currentPage - 1) * pageSize + idx + 1 }}</td>
          <td>{{ item.row.year }}</td>
          <td>{{ getMonthName(Number(item.row.month)) }}</td>
          <td>{{ format(item.row.kontan) }}</td>
          <td>{{ format(item.row.kredit) }}</td>
          <td>{{ format(item.row.leasing) }}</td>
          <td class="actions">
            <button type="button" class="btn btn-xs btn-outline" @click="$emit('edit', item.row.id)"><i class="fas fa-pen"></i> Ubah</button>
            <button type="button" class="btn btn-xs btn-danger" @click="$emit('delete', item.row.id)"><i class="fas fa-trash"></i> Hapus</button>
          </td>
        </tr>
      </tbody>
      <!-- <tfoot v-if="visibleEntries.length > 0 && showFooterTotal">
        <tr>
          <th :colspan="showIndex ? 3 : 3" class="text-right">Total Keseluruhan</th>
          <th>{{ format(grandTotal) }}</th>
          <th></th>
        </tr>
        <tr>
          <th :colspan="showIndex ? 3 : 3" class="text-right">Rata - rata</th>
          <th>{{ format(averageTotal) }}</th>
          <th></th>
        </tr>
      </tfoot> -->
    </table>
  </div>
</template>

<script setup lang="ts">
import { useDate } from '@/composables/useDate'
import type { SalesResponse } from '@/types/sales.type'
import { computed } from 'vue'

interface Props {
  entries: SalesResponse[]
  currentPage:number,
  pageSize:number,
  showIndex?: boolean
  showFooterTotal?: boolean
  numberFormatLocale?: string
  filterYear?: number | string | null
  filterMonth?: number | string | null
}
const { getMonthName } = useDate()
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

// const grandTotal = computed(() =>
//   visibleEntries.value.reduce((sum, item) => sum + safeNumber(item.row.kontan) + safeNumber(item.row.kredit) + safeNumber(item.row.leasing), 0)
// )

// const averageTotal = computed(() =>
//   visibleEntries.value.length > 0 ? grandTotal.value / visibleEntries.value.length : 0
// )

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
.table th, .table td {
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


