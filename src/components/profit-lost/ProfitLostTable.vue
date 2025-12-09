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
          Total Profit: {{ formatCurrency(totalProfit) }}
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
          Avg Equity: {{ formatCurrency(avgEquity) }}
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
              <th class="table-th amount-col capital-col">Capital Base</th>
              <th class="table-th amount-col earnings-col">Profit & Loss</th>
              <th class="table-th amount-col withdrawals-col">Withdrawals</th>
              <th class="table-th amount-col final-col">Final Equity</th>
              <th class="table-th actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Empty State -->
            <tr v-if="visibleEntries.length === 0" class="empty-row">
              <td colspan="7" class="empty-cell">
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
                  <h3 class="empty-title">No Profit & Loss Data Available</h3>
                  <p class="empty-description">
                    Start by adding profit & loss data using the form above
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
              <td class="table-td amount-cell capital-cell">
                <div class="capital-data">
                  <div class="capital-breakdown">
                    <span class="capital-item">
                      <span class="capital-label">Modal:</span>
                      <span class="capital-value">{{
                        formatCurrency(safeNumber(item.row.modal))
                      }}</span>
                    </span>
                  </div>
                </div>
              </td>
              <td class="table-td amount-cell earnings-cell">
                <div class="earnings-data">
                  <div class="earnings-breakdown">
                    <span class="earnings-item">
                      <span class="earnings-label">Kumulatif:</span>
                      <span class="earnings-value">{{
                        formatCurrency(safeNumber(item.row.kumulatif))
                      }}</span>
                    </span>
                    <span class="earnings-item">
                      <span class="earnings-label">Bulan Ini:</span>
                      <span class="earnings-value">{{
                        formatCurrency(safeNumber(item.row.bulan_ini))
                      }}</span>
                    </span>
                  </div>
                  <div class="earnings-total">
                    <span class="total-label">Total Laba:</span>
                    <span class="total-value">{{
                      formatCurrency(
                        safeNumber(
                          item.row.total_laba ||
                            safeNumber(item.row.kumulatif) + safeNumber(item.row.bulan_ini),
                        ),
                      )
                    }}</span>
                  </div>
                </div>
              </td>
              <td class="table-td amount-cell withdrawals-cell">
                <div class="withdrawals-data">
                  <div class="withdrawals-breakdown">
                    <span class="withdrawals-item">
                      <span class="withdrawals-label">Penarikan:</span>
                      <span class="withdrawals-value">{{
                        formatCurrency(safeNumber(item.row.penarikan))
                      }}</span>
                    </span>
                  </div>
                </div>
              </td>
              <td class="table-td amount-cell final-cell">
                <div class="final-equity">
                  <span class="grand-total">{{
                    formatCurrency(
                      safeNumber(
                        item.row.saldo_akhir ||
                          safeNumber(item.row.modal) +
                            safeNumber(item.row.kumulatif) +
                            safeNumber(item.row.bulan_ini) -
                            safeNumber(item.row.penarikan),
                      ),
                    )
                  }}</span>
                  <svg
                    class="final-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
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
import type { ProfitLostData } from "@/types/profit-lost.type";
import { computed } from "vue";

interface Props {
  entries: ProfitLostData[];
  currentPage: number;
  pageSize: number;
  showIndex?: boolean;
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

const totalProfit = computed(() => {
  return visibleEntries.value.reduce((sum, item) => {
    const totalLaba =
      safeNumber(item.row.total_laba) ||
      safeNumber(item.row.kumulatif) + safeNumber(item.row.bulan_ini);
    return sum + totalLaba;
  }, 0);
});

const avgEquity = computed(() => {
  if (visibleEntries.value.length === 0) return 0;
  const total = visibleEntries.value.reduce((sum, item) => {
    const saldoAkhir =
      safeNumber(item.row.saldo_akhir) ||
      safeNumber(item.row.modal) +
        safeNumber(item.row.kumulatif) +
        safeNumber(item.row.bulan_ini) -
        safeNumber(item.row.penarikan);
    return sum + saldoAkhir;
  }, 0);
  return total / visibleEntries.value.length;
});

function safeNumber(n: unknown): number {
  const num = typeof n === "number" ? n : Number(n);
  return Number.isFinite(num) ? num : 0;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safeNumber(n));
}
</script>

<style scoped>
/* Container */
.modern-table-container {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Table Header with Stats */
.table-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
}

.table-stats {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.stat-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
}

/* Table Wrapper */
.table-wrapper {
  overflow-x: auto;
}

.table-container {
  min-width: 100%;
}

/* Modern Table */
.modern-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
}

/* Table Header */
.table-header-row {
  background: #f9fafb;
}

.table-th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
}

.index-col {
  width: 60px;
  text-align: center;
}

.amount-col {
  text-align: right;
  width: 180px;
}

.capital-col {
  background: #fef3c7;
  position: relative;
}

.capital-col::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #f59e0b;
}

.earnings-col {
  background: #f0f9ff;
  position: relative;
  width: 220px;
}

.earnings-col::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #0ea5e9;
}

.withdrawals-col {
  background: #fef2f2;
  position: relative;
}

.withdrawals-col::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #ef4444;
}

.final-col {
  background: #ede9fe;
  position: relative;
  width: 200px;
}

.final-col::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #7c3aed;
}

.actions-col {
  width: 120px;
  text-align: center;
}

/* Table Rows */
.table-row {
  transition: all 0.15s ease;
  border-bottom: 1px solid #f3f4f6;
}

.table-row:hover {
  background: #f9fafb;
}

.even-row {
  background: #fafafa;
}

.even-row:hover {
  background: #f3f4f6;
}

/* Table Cells */
.table-td {
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  color: #374151;
  vertical-align: middle;
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
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Period Cell */
.period-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.period-month {
  font-weight: 600;
  color: #111827;
}

.period-year {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Capital Cell */
.capital-cell {
  background: #fef3c7;
  position: relative;
  text-align: right;
}

.capital-cell::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #f59e0b;
}

.capital-data {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.capital-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.capital-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

.capital-label {
  color: #d97706;
  font-weight: 500;
}

.capital-value {
  color: #d97706;
  font-family: "Courier New", monospace;
  font-weight: 600;
}

/* Earnings Cell */
.earnings-cell {
  background: #f0f9ff;
  position: relative;
  text-align: right;
}

.earnings-cell::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #0ea5e9;
}

.earnings-data {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.earnings-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.earnings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

.earnings-label {
  color: #0284c7;
  font-weight: 500;
}

.earnings-value {
  color: #0284c7;
  font-family: "Courier New", monospace;
  font-weight: 500;
}

.earnings-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.25rem;
  border-top: 1px solid #bae6fd;
}

.total-label {
  font-size: 0.75rem;
  color: #0c4a6e;
  font-weight: 600;
}

.total-value {
  color: #0c4a6e;
  font-family: "Courier New", monospace;
  font-weight: 600;
  font-size: 0.875rem;
}

/* Withdrawals Cell */
.withdrawals-cell {
  background: #fef2f2;
  position: relative;
  text-align: right;
}

.withdrawals-cell::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #ef4444;
}

.withdrawals-data {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.withdrawals-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.withdrawals-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

.withdrawals-label {
  color: #dc2626;
  font-weight: 500;
}

.withdrawals-value {
  color: #dc2626;
  font-family: "Courier New", monospace;
  font-weight: 500;
}

/* Final Cell */
.final-cell {
  background: #ede9fe;
  position: relative;
  text-align: center;
}

.final-cell::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #7c3aed;
}

.final-equity {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.grand-total {
  font-size: 1rem;
  font-weight: 700;
  color: #5b21b6;
  font-family: "Courier New", monospace;
}

.final-icon {
  width: 16px;
  height: 16px;
  color: #7c3aed;
}

/* Action Buttons */
.actions-cell {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn i {
  font-size: 14px;
}

.edit-btn {
  color: #3b82f6;
  border-color: #3b82f6;
}

.edit-btn:hover {
  background: #3b82f6;
  color: #ffffff;
}

.delete-btn {
  color: #ef4444;
  border-color: #ef4444;
}

.delete-btn:hover {
  background: #ef4444;
  color: #ffffff;
}

/* Empty State */
.empty-row {
  height: 320px;
}

.empty-cell {
  text-align: center;
  vertical-align: middle;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #d1d5db;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.empty-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  max-width: 400px;
  line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .table-stats {
    gap: 1rem;
  }

  .amount-col {
    width: 160px;
  }

  .earnings-col {
    width: 200px;
  }

  .final-col {
    width: 180px;
  }
}

@media (max-width: 768px) {
  .modern-table {
    font-size: 0.75rem;
  }

  .table-th,
  .table-td {
    padding: 0.75rem 0.5rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }

  .action-btn {
    width: 28px;
    height: 28px;
  }

  .action-btn i {
    font-size: 12px;
  }

  .table-header {
    padding: 1rem;
  }

  .stat-item {
    font-size: 0.8125rem;
  }

  .table-stats {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .capital-data,
  .earnings-data,
  .withdrawals-data {
    align-items: center;
  }

  .grand-total {
    font-size: 0.875rem;
  }
}

@media (max-width: 640px) {
  .table-wrapper {
    padding-bottom: 1rem;
  }

  .modern-table {
    min-width: 1200px;
  }
}
</style>
