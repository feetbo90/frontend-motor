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
          Total Sales: {{ formatCurrency(totalSales) }}
        </span>
        <span class="stat-item">
          <svg
            class="stat-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
            />
            <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          Total Units: {{ totalUnits }}
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
              <th class="table-th amount-col sales-col">Kontan</th>
              <th class="table-th amount-col sales-col">Kredit</th>
              <th class="table-th amount-col sales-col">Leasing</th>
              <th class="table-th units-col">Units Sold</th>
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
                  <h3 class="empty-title">No Sales Data Available</h3>
                  <p class="empty-description">Start by adding sales data using the form above</p>
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
                  <span class="period-month">{{ getMonthName(Number(item.row.month)) }}</span>
                  <span class="period-year">{{ item.row.year }}</span>
                </div>
              </td>
              <td class="table-td amount-cell sales-cell">
                <div class="sales-data">
                  <span class="amount-value">{{ formatCurrency(item.row.kontan) }}</span>
                  <span class="unit-badge">{{ item.row.unit_jualkontan }} units</span>
                </div>
              </td>
              <td class="table-td amount-cell sales-cell">
                <div class="sales-data">
                  <span class="amount-value">{{ formatCurrency(item.row.kredit) }}</span>
                  <span class="unit-badge">{{ item.row.unit_jualkredit }} units</span>
                </div>
              </td>
              <td class="table-td amount-cell sales-cell">
                <div class="sales-data">
                  <span class="amount-value">{{ formatCurrency(item.row.leasing) }}</span>
                  <span class="unit-badge">{{ item.row.unit_jualleasing }} units</span>
                </div>
              </td>
              <td class="table-td units-cell">
                <div class="units-summary">
                  <span class="total-units">{{ getTotalUnits(item.row) }}</span>
                  <span class="units-label">Total Units</span>
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
import type { SalesResponse } from "@/types/sales.type";
import { computed } from "vue";

interface Props {
  entries: SalesResponse[];
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

const totalSales = computed(() => {
  return visibleEntries.value.reduce((sum, item) => {
    return (
      sum + safeNumber(item.row.kontan) + safeNumber(item.row.kredit) + safeNumber(item.row.leasing)
    );
  }, 0);
});

const totalUnits = computed(() => {
  return visibleEntries.value.reduce((sum, item) => {
    return sum + getTotalUnits(item.row);
  }, 0);
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

function getTotalUnits(row: SalesResponse): number {
  return (
    safeNumber(row.unit_jualkontan) +
    safeNumber(row.unit_jualkredit) +
    safeNumber(row.unit_jualleasing)
  );
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
  width: 160px;
}

.sales-col {
  background: #f0f9ff;
  position: relative;
}

.sales-col::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #0ea5e9;
}

.units-col {
  text-align: center;
  width: 120px;
  background: #fefce8;
  position: relative;
}

.units-col::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #eab308;
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

/* Sales Cells */
.sales-cell {
  background: #f0f9ff;
  position: relative;
  text-align: right;
}

.sales-cell::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #0ea5e9;
}

.sales-data {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-end;
}

.amount-value {
  font-weight: 500;
  color: #0c4a6e;
  font-family: "Courier New", monospace;
}

.unit-badge {
  font-size: 0.75rem;
  color: #0284c7;
  background: #e0f2fe;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-weight: 500;
}

/* Units Cell */
.units-cell {
  background: #fefce8;
  text-align: center;
  position: relative;
}

.units-cell::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #eab308;
}

.units-summary {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
}

.total-units {
  font-size: 1.125rem;
  font-weight: 700;
  color: #92400e;
}

.units-label {
  font-size: 0.6875rem;
  color: #a16207;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
    width: 140px;
  }

  .units-col {
    width: 100px;
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

  .sales-data {
    align-items: center;
  }

  .units-summary {
    gap: 0.125rem;
  }

  .total-units {
    font-size: 1rem;
  }
}

@media (max-width: 640px) {
  .table-wrapper {
    padding-bottom: 1rem;
  }

  .modern-table {
    min-width: 900px;
  }
}
</style>
