<template>
  <div class="table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th v-if="showIndex">#</th>
          <th>Tahun</th>
          <th>Bulan</th>
          <th>Piutang Lancar</th>
          <th>Piutang Kurang Lancar</th>
          <th>Piutang Ragu-ragu</th>
          <th>Piutang Macet Baru</th>
          <th>Piutang Macet Lama</th>
          <th>Total Piutang</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="visibleEntries.length === 0">
          <td :colspan="showIndex ? 9 : 6" class="empty">Belum ada data. Tambahkan data piutang dan pembiayaan di atas.</td>
        </tr>
        <tr v-for="(item, idx) in visibleEntries" :key="item.row.id">
          <td v-if="showIndex">{{ idx + 1 }}</td>
          <td align="center">{{ item.row.tahun }}</td>
          <td>{{ getMonthName(item.row.bulan) }}</td>
          <td>{{ format(item.row.lancar) }}</td>
          <td>{{ format(item.row.kurangLancar) }}</td>
          <td>{{ format(item.row.raguRagu) }}</td>
          <td>{{ format(item.row.macetBaru) }}</td>
          <td>{{ format(item.row.macetLama) }}</td>
          <td>{{ format(item.row.totalPiutang) }}</td>
          <td class="actions">
            <button class="btn btn-xs btn-outline" @click="$emit('edit', item.originalIndex)"><i class="fas fa-pen"></i> Ubah</button>
            <button class="btn btn-xs btn-danger" @click="$emit('delete', item.originalIndex)"><i class="fas fa-trash"></i> Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useDate } from '@/composables/useDate'
import type { AccountReceivableTuroverData } from '@/types/account-receivable-turnover.type'
import { computed } from 'vue'

type DataEntry = AccountReceivableTuroverData & { id: number }

interface Props {
  entries: DataEntry[]
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
      const matchYear = yearFilter === null || Number(row.tahun) === yearFilter
      const matchMonth = monthFilter === null || Number(row.bulan) === monthFilter
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


