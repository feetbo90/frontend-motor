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
          Total Cash: {{ formatCurrency(totalCash) }}
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
          Avg Balance: {{ formatCurrency(avgBalance) }}
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
              <th class="table-th amount-col cash-col">Cash & Bank</th>
              <th class="table-th amount-col bon-col">BON Details</th>
              <th class="table-th amount-col status-col">Financial Status</th>
              <th class="table-th actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Empty State -->
            <tr v-if="visibleEntries.length === 0" class="empty-row">
              <td colspan="6" class="empty-cell">
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
                  <h3 class="empty-title">No Cash Flow Data Available</h3>
                  <p class="empty-description">
                    Start by adding cash flow data using the form above
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
              <td class="table-td amount-cell cash-cell">
                <div class="cash-data">
                  <div class="cash-breakdown">
                    <span class="cash-item">
                      <span class="cash-label">Kas Tunai:</span>
                      <span class="cash-value">{{
                        formatCurrency(safeNumber(item.row.kas_tunai))
                      }}</span>
                    </span>
                    <span class="cash-item">
                      <span class="cash-label">Rekening Bank:</span>
                      <span class="cash-value">{{
                        formatCurrency(safeNumber(item.row.rekening_bank))
                      }}</span>
                    </span>
                  </div>
                  <div class="cash-total">
                    <span class="total-label">Kas Lancar:</span>
                    <span class="total-value">{{
                      formatCurrency(safeNumber(item.row.jumlah_kas_lancar))
                    }}</span>
                  </div>
                </div>
              </td>
              <td class="table-td amount-cell bon-cell">
                <div class="bon-data">
                  <div class="bon-breakdown">
                    <span class="bon-item">
                      <span class="bon-label">BON Karyawan:</span>
                      <span class="bon-value">{{
                        formatCurrency(safeNumber(item.row.bon_karyawan))
                      }}</span>
                    </span>
                    <span class="bon-item">
                      <span class="bon-label">BON Pusat:</span>
                      <span class="bon-value">{{
                        formatCurrency(safeNumber(item.row.bon_pusat))
                      }}</span>
                    </span>
                    <span class="bon-item">
                      <span class="bon-label">BON Operasional:</span>
                      <span class="bon-value">{{
                        formatCurrency(safeNumber(item.row.bon_operasional))
                      }}</span>
                    </span>
                    <span class="bon-item">
                      <span class="bon-label">BON Gantung:</span>
                      <span class="bon-value">{{
                        formatCurrency(safeNumber(item.row.bon_gantung))
                      }}</span>
                    </span>
                  </div>
                </div>
              </td>
              <td class="table-td amount-cell status-cell">
                <div class="status-data">
                  <div class="status-breakdown">
                    <span class="status-item">
                      <span class="status-label">Kas Macet:</span>
                      <span class="status-value bad-debt">{{
                        formatCurrency(safeNumber(item.row.jumlah_kas_macet))
                      }}</span>
                    </span>
                  </div>
                  <div class="status-final">
                    <span class="final-label">Saldo Akhir:</span>
                    <span
                      class="final-value"
                      :class="{
                        'positive-balance': safeNumber(item.row.saldo_akhir) > 0,
                        'negative-balance': safeNumber(item.row.saldo_akhir) < 0,
                      }"
                    >
                      {{ formatCurrency(safeNumber(item.row.saldo_akhir)) }}
                    </span>
                  </div>
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
import { useDate } from "@/composables/useDate";
import type { CashFlowData } from "@/types/cash-flow.type";
import { computed } from "vue";

interface Props {
  entries: CashFlowData[];
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

const totalCash = computed(() => {
  return visibleEntries.value.reduce((sum, { row }) => {
    return sum + safeNumber(row.kas_tunai) + safeNumber(row.rekening_bank);
  }, 0);
});

const avgBalance = computed(() => {
  if (visibleEntries.value.length === 0) return 0;
  const total = visibleEntries.value.reduce((sum, { row }) => {
    return sum + safeNumber(row.saldo_akhir);
  }, 0);
  return total / visibleEntries.value.length;
});

function safeNumber(n: unknown): number {
  const num = typeof n === "number" ? n : Number(n);
  return Number.isFinite(num) ? num : 0;
}

function format(n: number): string {
  return new Intl.NumberFormat(props.numberFormatLocale).format(safeNumber(n));
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

.amount-col {
  min-width: 200px;
}

.cash-col {
  position: relative;
}

.cash-col::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #3b82f6, #1d4ed8);
}

.bon-col {
  position: relative;
  min-width: 240px;
}

.bon-col::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #f97316, #ea580c);
}

.status-col {
  position: relative;
}

.status-col::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #eab308, #d97706);
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

/* Cash Cell */
.cash-cell {
  position: relative;
}

.cash-cell::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #3b82f6, #1d4ed8);
}

.cash-data {
  padding-left: 12px;
}

.cash-breakdown {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}

.cash-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.cash-label {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
}

.cash-value {
  font-weight: 500;
  color: #111827;
  font-size: 13px;
}

.cash-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-top: 6px;
  border-top: 1px solid #e5e7eb;
}

.total-label {
  font-size: 12px;
  color: #3b82f6;
  font-weight: 600;
  white-space: nowrap;
}

.total-value {
  font-weight: 600;
  color: #3b82f6;
  font-size: 13px;
}

/* BON Cell */
.bon-cell {
  position: relative;
}

.bon-cell::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #f97316, #ea580c);
}

.bon-data {
  padding-left: 12px;
}

.bon-breakdown {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bon-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.bon-label {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
}

.bon-value {
  font-weight: 500;
  color: #111827;
  font-size: 13px;
}

/* Status Cell */
.status-cell {
  position: relative;
}

.status-cell::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #eab308, #d97706);
}

.status-data {
  padding-left: 12px;
}

.status-breakdown {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.status-label {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
}

.status-value {
  font-weight: 500;
  color: #111827;
  font-size: 13px;
}

.bad-debt {
  color: #ef4444;
  font-weight: 600;
}

.status-final {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-top: 6px;
  border-top: 1px solid #e5e7eb;
}

.final-label {
  font-size: 12px;
  color: #eab308;
  font-weight: 600;
  white-space: nowrap;
}

.final-value {
  font-weight: 600;
  font-size: 14px;
}

.positive-balance {
  color: #10b981;
}

.negative-balance {
  color: #ef4444;
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
    min-width: 180px;
  }

  .bon-col {
    min-width: 200px;
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

  .cash-data,
  .bon-data,
  .status-data {
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
