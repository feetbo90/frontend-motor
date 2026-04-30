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
          </svg>
          Total Reserves: {{ formatCurrency(totalReserves) }}
        </span>
        <span class="stat-item">
          <svg
            class="stat-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <path d="M20 8v6M23 11h-6" />
          </svg>
          Avg Surplus: {{ formatCurrency(avgSurplus) }}
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
              <th class="table-th period-col">Periode</th>
              <th class="table-th amount-col field-col col-piutang">Cadangan Piutang</th>
              <th class="table-th amount-col field-col col-macet">Macet Real</th>
              <th class="table-th amount-col field-col col-surplus">Surplus Devisit</th>
              <th class="table-th amount-col field-col col-cad-stock">Cadangan Stock</th>
              <th class="table-th amount-col field-col col-cad-stock-data">Cadangan Stock Data</th>
              <th class="table-th amount-col field-col col-total">Total Cadangan &amp; Nilai Sisa</th>
              <th class="table-th actions-col">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <!-- Empty State -->
            <tr v-if="visibleEntries.length === 0" class="empty-row">
              <td colspan="9" class="empty-cell">
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
                  <h3 class="empty-title">No Residual Value Reserve Data Available</h3>
                  <p class="empty-description">
                    Start by adding residual value reserve data using the form above
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
              <td class="table-td amount-cell col-piutang">
                <span class="amount-value">{{
                  formatCurrency(safeNumber(item.row.cadangan_piutang))
                }}</span>
              </td>
              <td class="table-td amount-cell col-macet">
                <span class="amount-value">{{
                  formatCurrency(safeNumber(item.row.macet_real))
                }}</span>
              </td>
              <td class="table-td amount-cell col-surplus">
                <span
                  class="amount-value"
                  :class="{
                    'negative-value': safeNumber(item.row.surplus_devist) < 0,
                    'positive-value': safeNumber(item.row.surplus_devist) > 0,
                  }"
                  >{{ formatCurrency(safeNumber(item.row.surplus_devist)) }}</span
                >
              </td>
              <td class="table-td amount-cell col-cad-stock">
                <span class="amount-value">{{
                  formatCurrency(safeNumber(item.row.cadangan_stock))
                }}</span>
              </td>
              <td class="table-td amount-cell col-cad-stock-data">
                <span class="amount-value">{{
                  formatCurrency(safeNumber(item.row.cadangan_stock_data))
                }}</span>
              </td>
              <td class="table-td amount-cell col-total">
                <span class="amount-value amount-value--total">{{
                  formatCurrency(rowTotalCadanganNilaiSisa(item.row))
                }}</span>
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
import { useDate } from "@/composables/useDate";
import type { ResidualValueReserveData } from "@/types/residual-value-reserve.type";
import { computed } from "vue";

interface Props {
  entries: ResidualValueReserveData[];
  showIndex?: boolean;
  currentPage: number;
  pageSize: number;
  showFooterTotal?: boolean;
  numberFormatLocale?: string;
  filterYear?: number | string | null;
  filterMonth?: number | string | null;
}

const { getMonthName } = useDate();
const props = withDefaults(defineProps<Props>(), {
  showIndex: true,
  showFooterTotal: true,
  numberFormatLocale: "id-ID",
  filterYear: null,
  filterMonth: null,
});

const visibleEntries = computed(() => {
  const yearFilter =
    props.filterYear !== null && props.filterYear !== "" ? Number(props.filterYear) : null;
  const monthFilter =
    props.filterMonth !== null && props.filterMonth !== "" ? Number(props.filterMonth) : null;
  return props.entries
    .map((row, index) => ({ row, originalIndex: index }))
    .filter(({ row }) => {
      const matchYear = yearFilter === null || Number(row.year) === yearFilter;
      const matchMonth = monthFilter === null || Number(row.month) === monthFilter;
      return matchYear && matchMonth;
    });
});

const totalReserves = computed(() => {
  const totalCadanganPiutang = visibleEntries.value.reduce((sum, { row }) => {
    return sum + safeNumber(row.cadangan_piutang);
  }, 0);
  const totalCadanganStock = visibleEntries.value.reduce((sum, { row }) => {
    return sum + safeNumber(row.cadangan_stock);
  }, 0);
  return totalCadanganPiutang + totalCadanganStock;
});

const avgSurplus = computed(() => {
  if (visibleEntries.value.length === 0) return 0;
  const total = visibleEntries.value.reduce((sum, { row }) => {
    return sum + safeNumber(row.surplus_devist);
  }, 0);
  return total / visibleEntries.value.length;
});

function safeNumber(n: unknown): number {
  const num = typeof n === "number" ? n : Number(n);
  return Number.isFinite(num) ? num : 0;
}

/** Selaras form: total = surplus (piutang − macet) + cadangan stock + cadangan stock data; atau total_reserves dari API jika ada. */
function rowTotalCadanganNilaiSisa(row: ResidualValueReserveData): number {
  const ext = row as ResidualValueReserveData & { total_reserves?: number };
  if (ext.total_reserves != null && Number.isFinite(Number(ext.total_reserves))) {
    return safeNumber(ext.total_reserves);
  }
  return (
    safeNumber(row.surplus_devist) +
    safeNumber(row.cadangan_stock) +
    safeNumber(row.cadangan_stock_data)
  );
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat(props.numberFormatLocale, {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safeNumber(n));
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

.period-col {
  min-width: 100px;
}

.amount-col {
  min-width: 128px;
}

.field-col {
  text-transform: none;
  letter-spacing: 0.02em;
  font-size: 12px;
  white-space: normal;
  line-height: 1.35;
}

.col-piutang,
.col-macet,
.col-surplus,
.col-cad-stock,
.col-cad-stock-data,
.col-total {
  position: relative;
}

.col-piutang::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #3b82f6, #1d4ed8);
}

.col-macet::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #ef4444, #dc2626);
}

.col-surplus::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #f59e0b, #d97706);
}

.col-cad-stock::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #8b5cf6, #7c3aed);
}

.col-cad-stock-data::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #7c3aed, #6d28d9);
}

.col-total::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #64748b, #475569);
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

.amount-value {
  display: block;
  padding-left: 12px;
  font-weight: 500;
  color: #111827;
  font-variant-numeric: tabular-nums;
}

.amount-value--total {
  font-weight: 600;
  color: #0f172a;
}

.positive-value {
  color: #059669;
}

.negative-value {
  color: #dc2626;
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
    min-width: 112px;
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

  .amount-value {
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
    min-width: 1100px;
  }
}
</style>
