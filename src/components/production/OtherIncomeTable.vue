<template>
  <div class="modern-table-container">
    <!-- Table Header with Stats -->
    <div class="table-header">
      <div class="table-stats">
        <span class="stat-item">
          <svg
            class="stat-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {{ visibleEntries.length }} Records
        </span>
        <span class="stat-item">
          <svg
            class="stat-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 2v20m8-10H4" />
            <path d="M12 2l4 4-4 4M12 22l-4-4 4-4" />
          </svg>
          Total Income: {{ formatCurrency(totalIncome) }}
        </span>
        <span class="stat-item">
          <svg
            class="stat-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          Total Penalty: {{ formatCurrency(totalPenalty) }}
        </span>
      </div>
    </div>

    <!-- Modern Table -->
    <div class="table-wrapper">
      <div class="table-container">
        <table class="modern-table">
          <thead>
            <tr class="table-header-row">
              <th class="table-th index-col">#</th>
              <th class="table-th">Period</th>
              <th class="table-th amount-col income-col">Income Details</th>
              <th class="table-th amount-col penalty-col">Penalty Details</th>
              <th class="table-th amount-col total-col">Total</th>
              <th class="table-th actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Empty State -->
            <tr v-if="visibleEntries.length === 0" class="empty-row">
              <td :colspan="6" class="empty-cell">
                <div class="empty-state">
                  <svg
                    class="empty-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M8 12h8m-8 4h6" />
                  </svg>
                  <h3 class="empty-title">No Other Income Data Available</h3>
                  <p class="empty-description">
                    Start by adding other income data using the form above
                  </p>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr
              v-for="(item, idx) in visibleEntries"
              :key="item.row.id"
              class="table-row"
              :class="{ 'even-row': idx % 2 === 1 }"
            >
              <td class="table-td index-cell">
                <span class="index-badge">{{ (currentPage - 1) * pageSize + idx + 1 }}</span>
              </td>
              <td class="table-td period-cell">
                <div class="period-info">
                  <span class="period-month">{{ getMonthName(item.row.month) }}</span>
                  <span class="period-year">{{ item.row.year }}</span>
                </div>
              </td>
              <td class="table-td amount-cell income-cell">
                <div class="income-data">
                  <div class="income-breakdown">
                    <span class="income-item">
                      <span class="income-label">Penjualan PK:</span>
                      <span class="income-value">{{ formatCurrency(item.row.penjualan_pk) }}</span>
                    </span>
                    <span class="income-item">
                      <span class="income-label">Komisi:</span>
                      <span class="income-value">{{ formatCurrency(item.row.komisi) }}</span>
                    </span>
                  </div>
                </div>
              </td>
              <td class="table-td amount-cell penalty-cell">
                <div class="penalty-data">
                  <div class="penalty-breakdown">
                    <span class="penalty-item">
                      <span class="penalty-label">Denda Keterlambatan:</span>
                      <span class="penalty-value">{{ formatCurrency(item.row.denda_keterlambatan) }}</span>
                    </span>
                    <span class="penalty-item">
                      <span class="penalty-label">Diskon Denda:</span>
                      <span class="penalty-value discount-value">{{ formatCurrency(item.row.diskon_denda) }}</span>
                    </span>
                  </div>
                </div>
              </td>
              <td class="table-td amount-cell total-cell">
                <div class="total-data">
                  <span class="total-value">{{ formatCurrency(item.row.jumlah_pendapatan_lain) }}</span>
                </div>
              </td>
              <td class="table-td actions-cell">
                <div class="action-buttons">
                  <button
                    type="button"
                    class="action-btn edit-btn"
                    @click="$emit('edit', item.row.id)"
                    title="Edit"
                  >
                    <i class="fas fa-pen"></i>
                  </button>
                  <button
                    type="button"
                    class="action-btn delete-btn"
                    @click="$emit('delete', item.row.id)"
                    title="Delete"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDate } from '@/composables/useDate'
import type { OtherIncomeData } from '@/types/other-income.type'
import { computed } from 'vue'


interface Props {
  entries: OtherIncomeData[]
  showIndex?: boolean
  currentPage:number
  pageSize:number
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

const totalIncome = computed(() => {
  return visibleEntries.value.reduce((sum, { row }) => {
    return sum + safeNumber(row.penjualan_pk) + safeNumber(row.komisi)
  }, 0)
})

const totalPenalty = computed(() => {
  return visibleEntries.value.reduce((sum, { row }) => {
    return sum + safeNumber(row.denda_keterlambatan) - safeNumber(row.diskon_denda)
  }, 0)
})

function safeNumber(n: unknown): number {
  const num = typeof n === 'number' ? n : Number(n)
  return Number.isFinite(num) ? num : 0
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat(props.numberFormatLocale, {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safeNumber(n))
}
</script>

<style scoped>
/* Main Container */
.modern-table-container {
  background: white;
  border-radius: 12px;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* Header Section */
.table-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 24px;
}

.table-stats {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: 500;
}

.stat-icon {
  width: 18px;
  height: 18px;
  opacity: 0.9;
}

/* Table Structure */
.table-wrapper {
  overflow-x: auto;
}

.table-container {
  width: 100%;
}

.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

/* Table Header */
.table-header-row {
  background: #f8fafc;
}

.table-th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.index-col {
  width: 60px;
  text-align: center;
}

.amount-col {
  min-width: 220px;
}

.income-col {
  position: relative;
}

.income-col::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #10b981, #059669);
}

.penalty-col {
  position: relative;
}

.penalty-col::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #ef4444, #dc2626);
}

.total-col {
  position: relative;
  min-width: 180px;
}

.total-col::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #eab308, #ca8a04);
}

.actions-col {
  width: 120px;
  text-align: center;
}

/* Table Rows */
.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f9fafb;
}

.even-row {
  background-color: #f8fafc;
}

.even-row:hover {
  background-color: #f1f5f9;
}

/* Table Cells */
.table-td {
  padding: 16px 20px;
  vertical-align: top;
  border-bottom: 1px solid #e5e7eb;
}

/* Index Cell */
.index-cell {
  text-align: center;
}

.index-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #e5e7eb;
  color: #374151;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 500;
}

/* Period Info */
.period-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.period-month {
  font-weight: 500;
  color: #111827;
}

.period-year {
  font-size: 13px;
  color: #6b7280;
}

/* Income Cell */
.income-cell {
  position: relative;
}

.income-cell::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #10b981, #059669);
}

.income-data {
  padding-left: 12px;
}

.income-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.income-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.income-label {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
}

.income-value {
  font-weight: 500;
  color: #111827;
}

/* Penalty Cell */
.penalty-cell {
  position: relative;
}

.penalty-cell::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #ef4444, #dc2626);
}

.penalty-data {
  padding-left: 12px;
}

.penalty-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.penalty-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.penalty-label {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
}

.penalty-value {
  font-weight: 500;
  color: #111827;
}

.discount-value {
  color: #10b981;
  font-weight: 600;
}

/* Total Cell */
.total-cell {
  position: relative;
}

.total-cell::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #eab308, #ca8a04);
}

.total-data {
  padding-left: 12px;
}

.total-value {
  font-weight: 600;
  color: #eab308;
  font-size: 15px;
}

/* Actions Cell */
.actions-cell {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn i {
  font-size: 14px;
}

.edit-btn {
  background: #3b82f6;
  color: white;
}

.edit-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

/* Empty State */
.empty-row {
  background: transparent;
}

.empty-cell {
  text-align: center;
  padding: 48px 24px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: #9ca3af;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.empty-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  max-width: 400px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .table-stats {
    gap: 16px;
  }

  .amount-col {
    min-width: 200px;
  }

  .total-col {
    min-width: 160px;
  }
}

@media (max-width: 768px) {
  .modern-table {
    font-size: 14px;
  }

  .table-th,
  .table-td {
    padding: 12px 16px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 28px;
    height: 28px;
  }

  .action-btn i {
    font-size: 12px;
  }

  .table-header {
    padding: 16px 20px;
  }

  .stat-item {
    font-size: 14px;
  }

  .table-stats {
    flex-direction: column;
    gap: 12px;
  }

  .income-data,
  .penalty-data,
  .total-data {
    font-size: 13px;
  }

  .empty-cell {
    padding: 32px 16px;
  }
}

@media (max-width: 640px) {
  .table-wrapper {
    overflow-x: scroll;
  }

  .modern-table {
    min-width: 900px;
  }
}
</style>


