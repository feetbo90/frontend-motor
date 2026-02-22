<template>
  <div class="container">
    <div class="header-actions">
      <h2>Laporan Satuan Pengukuran</h2>
      <div class="download-buttons">
        <button
          class="btn-download"
          :disabled="loading || excelDataByEntity.length < 1"
          @click="downloadExcelWithStyle"
        >
          <i class="fas fa-file-excel"></i>
          Download Excel
        </button>
      </div>
    </div>

    <div class="filter-info-section">
      <h3>Filter Laporan</h3>
      <p class="range-info">
        <i class="fas fa-info-circle"></i>
        Tahun, bulan, dan satuan kerja diambil dari filter di sidebar. Pastikan ketiga filter sudah dipilih agar data laporan tampil.
      </p>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="!loading&&apiData.entityIds.length < 1" class="empty-container">
      <img src="/images/empty.png" alt="Empty State" width="400" height="400" />
      <p class="empty">Data satuan pengukuran tidak ditemukan!</p>
    </div>
    <div v-else>
      <div v-for="entity in apiData.entityIds" :key="entity.id" class="entity-section">
        <h3 class="entity-title">{{ entity.name }} ({{ entity.type }})</h3>
        
        <!-- Tabel laporan: No, Uraian, kolom bulan + R mengikuti visibleMonthEnds (selectedMonth atau 1–12) -->
        <div class="table-section">
          <div class="table-wrapper">
            <table class="data-table laporan-bulanan">
              <thead>
                <tr>
                  <th class="col-no">No.</th>
                  <th class="col-uraian">Uraian</th>
                  <template v-for="m in visibleMonthEnds" :key="m">
                    <th class="col-bulan">{{ MONTH_NAMES[m - 1] }}</th>
                    <th class="col-r">R{{ m }}</th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in URAIAN_ROWS" :key="row.no">
                  <td class="col-no">{{ row.no }}</td>
                  <td class="col-uraian">{{ row.uraian }}</td>
                  <template v-for="monthEnd in visibleMonthEnds" :key="monthEnd">
                    <td class="col-bulan">
                      <template v-if="row.config && 'type' in row.config && row.config.type === 'unit_count'">
                        {{ getUnitCount(ratesRatiosData) }}
                      </template>
                      <template v-else-if="row.config && 'key' in row.config">
                           {{ formatNumber(getMonthlyValueByKey(ratesRatiosData, entity.name, monthEnd, row.config.key, row.config.monthField)) }}
                      </template>
                      <template v-else>—</template>
                    </td>
                    <td class="col-r">
                      {{ getRKey(row.config) != null && getRFieldForMonth(row.config, monthEnd) ? formatNumber(getMonthlyValueByKey(ratesRatiosData, entity.name, monthEnd, getRKey(row.config)!, getRFieldForMonth(row.config, monthEnd)!)) : "—" }}
                    </td>
                  </template>
                </tr>
                <!-- Subheader: Tingkat Produksi -->
                <tr>
                  <td class="col-no">No.</td>
                  <td  class="col-uraian subheader">Tingkat Produksi</td>
                  <template v-for="monthEnd in visibleMonthEnds" :key="'h-' + monthEnd">
                    <td class="col-bulan"></td>
                    <td class="col-r"></td>
                  </template>
                </tr>
                <tr v-for="row in TINGKAT_PRODUKSI_ROWS" :key="'tp-' + row.no">
                  <td class="col-no">{{ row.no }}</td>
                  <td class="col-uraian">{{ row.uraian }}</td>
                  <template v-for="monthEnd in visibleMonthEnds" :key="monthEnd">
                    <td class="col-bulan">-</td>
                    <td class="col-r">
                      {{ row.config ? formatNumber(getMonthlyValueByKey(ratesRatiosData, entity.name, monthEnd, row.config.key, row.config.rField)) : '-' }}
                    </td>
                  </template>
                </tr>
                <!-- Subheader: Ratio Produksi -->
                <tr>
                  <td class="col-no">No</td>
                  <td class="col-uraian subheader">Ratio Produksi</td>
                  <template v-for="monthEnd in visibleMonthEnds" :key="'rp-h-' + monthEnd">
                    <td class="col-bulan"></td>
                    <td class="col-r"></td>
                  </template>
                </tr>
                <tr v-for="row in RATIO_PRODUKSI_ROWS" :key="'rp-' + row.no">
                  <td class="col-no">{{ row.no }}</td>
                  <td class="col-uraian">{{ row.uraian }}</td>
                  <template v-for="monthEnd in visibleMonthEnds" :key="monthEnd">
                    <td class="col-bulan">-</td>
                    <td class="col-r">
                      {{ row.config ? formatPercentage(Number(getMonthlyValueByKey(ratesRatiosData, entity.name, monthEnd, row.config.key, row.config.rField))) : '-' }}
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Ratio Tables -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getProductRatesRatios } from "@/services/productRateService";
import { useAuthStore } from "@/stores/auth";
import {
  formatNumber,
  formatPercentage,
  isGlobalLoading,
  selectedEntityId,
  selectedMonth,
  selectedYear,
} from "@/stores/globalState";
import type {
  ProductRateData,
  ProductRatesRatiosData,
} from "@/types/productRate";
import type { RateOrRatioKey } from "@/utils/productRateMapper";
import {
  getMonthlyValueByKey,
  getUnitCount,
  mapRatesRatiosToProductRateData,
} from "@/utils/productRateMapper";
import { computed, onMounted, ref, watch } from "vue";
import ExcelJS from "exceljs";

const authStore = useAuthStore();
const apiData = ref<ProductRateData>({
  success: false,
  entity_id: "",
  entityIds: [],
  rate_satu: {},
  rate_dua: {},
  rate_tiga: {},
  rate_empat: {},
  rate_lima: {},
  rate_enam: {},
  rate_tujuh: {},
});

const loading = ref(false);

/** Raw response rates-ratios untuk tabel bulanan (pembiayaan_bulan_ini dll per month_end) */
const ratesRatiosData = ref<ProductRatesRatiosData | null>(null);

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
] as const;

/** Bulan yang ditampilkan di tabel: 1..selectedMonth jika ada filter bulan, otherwise 1..12 */
const visibleMonthEnds = computed(() => {
  const m = selectedMonth.value;
  if (m === "" || m === undefined || m === null) {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }
  const n = typeof m === "string" ? Number(m) : m;
  if (Number.isNaN(n) || n < 1) return [1];
  const max = Math.min(Math.floor(n), 12);
  return Array.from({ length: max }, (_, i) => i + 1);
});

/** Maks indeks R mengikuti visibleMonthEnds (selectedMonth), cap 11 karena API hanya _r1.._r11 */
const rMax = computed(() => {
  const arr = visibleMonthEnds.value;
  const maxMonth = arr.length ? arr[arr.length - 1] : 12;
  return Math.min(maxMonth, 11);
});

/** Kolom untuk export Excel: No., Uraian, lalu tiap bulan (nama bulan + R1, R2, ...) */
const excelColumns = computed(() => {
  const cols: string[] = ["No.", "Uraian"];
  visibleMonthEnds.value.forEach((m) => {
    cols.push(MONTH_NAMES[m - 1]);
    cols.push(`R${m}`);
  });
  return cols;
});

/** Nama file export Excel */
const excelFileName = computed(
  () =>
    `Laporan_Satuan_Pengukuran_${selectedYear.value || "All"}_${selectedMonth.value || "All"}.xlsx`
);

/** Per entity: judul + baris data. Export: judul di atas, lalu header (No., Uraian, Januari, R1...), lalu data */
type EntityExportBlock = { title: string; rows: Record<string, string | number>[] };

const excelDataByEntity = computed(() => {
  const blocks: EntityExportBlock[] = [];
  const months = visibleMonthEnds.value;
  const cols = excelColumns.value;
  const dataSource = ratesRatiosData.value;

  if (!dataSource || !apiData.value.entityIds?.length) return blocks;

  const makeRow = (cells: (string | number)[]): Record<string, string | number> => {
    const row: Record<string, string | number> = {};
    cols.forEach((col, i) => {
      row[col] = cells[i] ?? "";
    });
    return row;
  };

  apiData.value.entityIds.forEach((entity) => {
    const entityName = String(entity.name);
    const title = `${entityName} (${entity.type})`;
    const rows: Record<string, string | number>[] = [];

    // URAIAN_ROWS
    URAIAN_ROWS.forEach((row) => {
      const cells: (string | number)[] = [row.no, row.uraian];
      months.forEach((monthEnd) => {
        if (row.config && "type" in row.config && row.config.type === "unit_count") {
          cells.push(getUnitCount(dataSource));
        } else if (row.config && "key" in row.config) {
          const val = getMonthlyValueByKey(
            dataSource,
            entityName,
            monthEnd,
            row.config.key,
            row.config.monthField
          );
          cells.push(
            formatNumber(val)
          );
        } else {
          cells.push("—");
        }
        const rKey = getRKey(row.config);
        const rField = getRFieldForMonth(row.config, monthEnd);
        if (rKey != null && rField) {
          const v = getMonthlyValueByKey(
            dataSource,
            entityName,
            monthEnd,
            rKey,
            rField
          );
          cells.push(formatNumber(v));
        } else {
          cells.push("—");
        }
      });
      rows.push(makeRow(cells));
    });

    // Subheader: Tingkat Produksi
    const subhead1: (string | number)[] = ["", "Tingkat Produksi"];
    for (let i = 2; i < cols.length; i++) subhead1.push("");
    rows.push(makeRow(subhead1));

    TINGKAT_PRODUKSI_ROWS.forEach((row) => {
      const cells: (string | number)[] = [row.no, row.uraian];
      months.forEach((monthEnd) => {
        cells.push("-");
        const val = getMonthlyValueByKey(
          dataSource,
          entityName,
          monthEnd,
          row.config.key,
          row.config.rField
        );
        cells.push(formatNumber(val));
      });
      rows.push(makeRow(cells));
    });

    // Subheader: Ratio Produksi
    const subhead2: (string | number)[] = ["", "Ratio Produksi"];
    for (let i = 2; i < cols.length; i++) subhead2.push("");
    rows.push(makeRow(subhead2));

    RATIO_PRODUKSI_ROWS.forEach((row) => {
      const cells: (string | number)[] = [row.no, row.uraian];
      months.forEach((monthEnd) => {
        cells.push("-");
        const val = getMonthlyValueByKey(
          dataSource,
          entityName,
          monthEnd,
          row.config.key,
          row.config.rField
        );
        cells.push(formatPercentage(Number(val)));
      });
      rows.push(makeRow(cells));
    });

    blocks.push({ title, rows });
  });

  return blocks;
});

/** Export Excel: tiap entity = judul di atas, lalu header (No., Uraian, Januari, R1...), lalu data. Kolom nilai rata kanan. */
async function downloadExcelWithStyle() {
  const blocks = excelDataByEntity.value;
  const cols = excelColumns.value;
  if (!blocks.length || !cols.length) return;

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Laporan Satuan Pengukuran", { views: [{ state: "normal" }] });

  const thinBorder = {
    top: { style: "thin" as const },
    left: { style: "thin" as const },
    bottom: { style: "thin" as const },
    right: { style: "thin" as const },
  };

  const applyBorderToRow = (rowNumber: number) => {
    for (let c = 1; c <= cols.length; c++) {
      const cell = ws.getCell(rowNumber, c);
      cell.border = thinBorder;
    }
  };

  const applyDataRowAlignment = (
    row: { eachCell: (cb: (cell: unknown, colNumber: number) => void) => void }
  ) => {
    row.eachCell((cell: unknown, colNumber: number) => {
      const c = cell as { alignment?: { horizontal?: string } };
      if (colNumber >= 3) {
        c.alignment = { horizontal: "right" };
      } else if (colNumber === 1) {
        c.alignment = { horizontal: "center" };
      }
    });
  };

  blocks.forEach((block) => {
    // 1. Baris judul entity (di atas header), colspan 2 (No. + Uraian)
    const titleRowValues = cols.map((_, i) => (i === 0 ? block.title : ""));
    const titleRow = ws.addRow(titleRowValues);
    titleRow.font = { bold: true };
    ws.mergeCells(titleRow.number, 1, titleRow.number, 2);
    applyBorderToRow(titleRow.number);

    // 2. Baris header tabel: No., Uraian, Januari, R1, ...
    const headerRow = ws.addRow(cols);
    headerRow.font = { bold: true };
    cols.forEach((_, colIndex) => {
      const cell = ws.getCell(headerRow.number, colIndex + 1);
      cell.alignment = { horizontal: colIndex >= 2 ? "right" : "left" };
      cell.border = thinBorder;
    });

    // 3. Baris data (subheader Tingkat Produksi & Ratio Produksi: colspan 2 + bold)
    block.rows.forEach((rowObj) => {
      const rowValues = cols.map((col) => rowObj[col] ?? "");
      const uraianVal = rowObj["Uraian"];
      if (uraianVal === "Tingkat Produksi" || uraianVal === "Ratio Produksi") {
        // Teks harus di kolom pertama agar tampil setelah merge (Excel pakai nilai sel kiri-atas)
        rowValues[0] = uraianVal;
      }
      const row = ws.addRow(rowValues);
      if (uraianVal === "Tingkat Produksi" || uraianVal === "Ratio Produksi") {
        row.font = { bold: true };
        ws.mergeCells(row.number, 1, row.number, 2);
      } else {
        applyDataRowAlignment(row);
      }
      applyBorderToRow(row.number);
    });

    // 4. Satu baris kosong antar entity (diberi border juga)
    const blankRow = ws.addRow(cols.map(() => ""));
    applyBorderToRow(blankRow.number);
  });

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = excelFileName.value;
  a.click();
  URL.revokeObjectURL(url);
}

type RowConfig =
  | { key: RateOrRatioKey; monthField: string;  rFieldBase?: string }
  | { type: 'unit_count'; rKey?: RateOrRatioKey; rFieldBase?: string };

/** Field untuk kolom R(monthEnd): rFieldBase + min(monthEnd, rMax) */
function getRFieldForMonth(config: RowConfig | undefined, monthEnd: number): string | undefined {
  if (!config || !('rFieldBase' in config) || !config.rFieldBase) return undefined;
  return config.rFieldBase + String(Math.min(monthEnd, rMax.value));
}

/** 19 baris uraian sesuai gambar laporan. Kolom R1–R11 pakai average_*_r1 … average_*_r11. */
const URAIAN_ROWS: { no: number; uraian: string; config?: RowConfig }[] = [
  { no: 1, uraian: "Pembiayaan", config: { key: "rate_satu", monthField: "pembiayaan_bulan_ini", rFieldBase: "average_pembiayaan_r" } },
  { no: 2, uraian: "Penjualan", config: { key: "rate_dua", monthField: "penjualan_bulan_ini", rFieldBase: "average_penjualan_r" } },
  { no: 3, uraian: "Unit Penjualan", config: { key: "rate_dua", monthField: "unit_penjualan_bulan_ini", rFieldBase: "average_unit_penjualan_r" } },
  { no: 4, uraian: "Pendapatan Mark Up", config: { key: "rate_empat", monthField: "markup_bulan_ini", rFieldBase: "average_markup_r" } },
  { no: 5, uraian: "Pendapatan Adminitrasi" },
  { no: 6, uraian: "Pendapatan Bunga", config: { key: "ratio_empat", monthField: "realisasi_bunga_bulan_ini", rFieldBase: "average_realisasi_bunga_r" } },
  { no: 7, uraian: "Pendapatan Denda" },
  { no: 8, uraian: "Pendapatan Lain lain", config: { key: "ratio_tujuh", monthField: "jumlah_pendapatan_lain_bulan_ini", rFieldBase: "average_jumlah_pendapatan_lain_r" } },
  { no: 9, uraian: "Jumlah Pendapatan", config: { key: "ratio_tujuh", monthField: "jumlah_pendapatan_bulan_ini", rFieldBase: "average_jumlah_pendapatan_r" } },
  { no: 10, uraian: "Karyawan", config: { key: "rate_lima", monthField: "karyawan_bulan_ini", rFieldBase: "average_karyawan_r" } },
  { no: 11, uraian: "Gaji Karyawan", config: { key: "rate_lima", monthField: "gaji_bulan_ini", rFieldBase: "average_gaji_r" } },
  { no: 12, uraian: "Biaya Operasional", config: { key: "rate_enam", monthField: "operasional_bulan_ini", rFieldBase: "average_operasional_r" } },
  { no: 13, uraian: "Penyusutan Inventaris", config: { key: "rate_delapan", monthField: "penyusutan_bulan_ini", rFieldBase: "average_penyusutan_r" } },
  { no: 14, uraian: "Satuan Kerja", config: { type: "unit_count", rKey: "rate_delapan", rFieldBase: "average_satuan_kerja_r" } },
  { no: 15, uraian: "Cad. PH/Peny Stock", config: { key: "rate_sembilan", monthField: "beban_gabungan_bulan_ini", rFieldBase: "average_beban_gabungan_r" } },
  { no: 16, uraian: "Laba/Rugi", config: { key: "rate_sepuluh", monthField: "kumulatif_bulan_ini", rFieldBase: "average_kumulatif_r" } },
  { no: 17, uraian: "Realisasi Pokok", config: { key: "ratio_satu", monthField: "realisasi_pokok_bulan_ini", rFieldBase: "average_realisasi_pokok_r" } },
  { no: 18, uraian: "Kenaikan/T Macet", config: { key: "ratio_dua", monthField: "macet_lama_bulan_ini", rFieldBase: "average_macet_lama_r" } },
  { no: 19, uraian: "Saldo Pokok Piutang Akhir", config: { key: "ratio_empat", monthField: "saldo_akhir_bulan_ini", rFieldBase: "average_saldo_akhir_r" } },
];

/** Config Tingkat Produksi: hanya isi kolom R1–R12 (key + rField) */
type TingkatProduksiConfig = { key: RateOrRatioKey; rField: string };

/** 11 baris Tingkat Produksi sesuai gambar laporan */
const TINGKAT_PRODUKSI_ROWS: { no: number; uraian: string; config: TingkatProduksiConfig }[] = [
  { no: 1, uraian: "Rata-rata Pembiayaan / Unit Penjualan", config: { key: "rate_satu", rField: "pembiayaan_per_unit_penjualan" } },
  { no: 2, uraian: "Rata-rata Penjualan / Unit Penjualan", config: { key: "rate_dua", rField: "penjualan_per_unit_penjualan" } },
  { no: 3, uraian: "Rata-rata Penjualan / Karyawan", config: { key: "rate_tiga", rField: "penjualan_per_karyawan" } },
  { no: 4, uraian: "Rata-rata Mark up / Karyawan", config: { key: "rate_empat", rField: "markup_per_karyawan" } },
  { no: 5, uraian: "Rata-rata Gaji / Karyawan", config: { key: "rate_lima", rField: "gaji_per_karyawan" } },
  { no: 6, uraian: "Rata-rata Biaya Operasional / Karyawan", config: { key: "rate_enam", rField: "operasional_per_karyawan" } },
  { no: 7, uraian: "Rata-rata Penyusutan Inventaris / Karyawan", config: { key: "rate_tujuh", rField: "penyusutan_per_karyawan" } },
  { no: 8, uraian: "Rata-rata Penyusutan Inventaris / Satuan Kerja", config: { key: "rate_delapan", rField: "penyusutan_per_satuan_kerja" } },
  { no: 9, uraian: "Rata-rata Cad PH dan Peny Stock / Satuan Kerja", config: { key: "rate_sembilan", rField: "beban_gabungan_per_satuan_kerja" } },
  { no: 10, uraian: "Rata-rata Laba/rugi nett / Satuan Kerja", config: { key: "rate_sepuluh", rField: "kumulatif_per_satuan_kerja" } },
  { no: 11, uraian: "Rata-rata Laba/rugi nett / Karyawan", config: { key: "rate_sebelas", rField: "kumulatif_per_karyawan" } },
];

/** 11 baris Ratio Produksi (hanya kolom R1–R12, nilai sebagai persentase) */
const RATIO_PRODUKSI_ROWS: { no: number; uraian: string; config: TingkatProduksiConfig }[] = [
  { no: 1, uraian: "Ratio Pembiayaan / Realisasi Pokok", config: { key: "ratio_satu", rField: "pembiayaan_per_realisasi_pokok" } },
  { no: 2, uraian: "Ratio Kn /T macet / Pembiayaan", config: { key: "ratio_dua", rField: "rasio_kemacetan_pembiayaan" } },
  { no: 3, uraian: "Ratio Mark up / Pembiayaan", config: { key: "ratio_tiga", rField: "rasio_markup" } },
  { no: 4, uraian: "Ratio Pendapatan Bunga / So. Piutang Pokok Akhir", config: { key: "ratio_empat", rField: "rasio_realisasi_bunga_per_total_piutang" } },
  { no: 5, uraian: "Ratio Mark up / Jumlah Pendapatan", config: { key: "ratio_lima", rField: "rasio_markup_per_jumlah_pendapatan" } },
  { no: 6, uraian: "Ratio Pendapatan Bunga / Jumlah Pendapatan", config: { key: "ratio_enam", rField: "rasio_pendapatan_bunga_per_jumlah_pendapatan" } },
  { no: 7, uraian: "Ratio Pendapatan Lainnya / Jumlah Pendapatan", config: { key: "ratio_tujuh", rField: "rasio_pendapatan_lainnya_per_jumlah_pendapatan" } },
  { no: 8, uraian: "Ratio Gaji / Pendapatan", config: { key: "ratio_delapan", rField: "rasio_gaji_per_pendapatan" } },
  { no: 9, uraian: "Ratio Biaya Operasional / Pendapatan", config: { key: "ratio_sembilan", rField: "rasio_beban_operasional_per_pendapatan" } },
  { no: 10, uraian: "Ratio Biaya Penyusutan inventaris / Pendapatan", config: { key: "ratio_sepuluh", rField: "rasio_penyusutan_aktiva_per_jumlah_pendapatan" } },
  { no: 11, uraian: "Ratio Biaya Cad PH dan Peny Stock / Pendapatan", config: { key: "ratio_sebelas", rField: "rasio_cadangan_piutang_per_jumlah_pendapatan" } },
];

/** Key untuk kolom R: config.key atau config.rKey (unit_count) */
function getRKey(config: RowConfig | undefined): RateOrRatioKey | undefined {
  if (!config) return undefined;
  if ('rFieldBase' in config && config.rFieldBase) {
    if ('key' in config) return config.key;
    if ('rKey' in config) return config.rKey;
  }
  return undefined;
}

const fetchRateList = async (year: number | undefined, month: number | undefined) => {
  try {
    loading.value = true;
    const branchId = selectedEntityId.value ? Number(selectedEntityId.value) : undefined;
    const response = await getProductRatesRatios({
      year,
      month,
      branch_id: branchId,
    });
    if (response.success) {
      console.log(mapRatesRatiosToProductRateData(response),'xxx')
      apiData.value = mapRatesRatiosToProductRateData(response);
      ratesRatiosData.value = response;
    } else {
      ratesRatiosData.value = null;
    }
  } catch (err) {
    console.error(err);
    ratesRatiosData.value = null;
  } finally {
    loading.value = false;
    isGlobalLoading.value = false;
  }
};

watch([selectedYear, selectedMonth, selectedEntityId], () => {
  const year = selectedYear.value !== "" ? Number(selectedYear.value) : undefined;
  const month = selectedMonth.value !== "" ? Number(selectedMonth.value) : undefined;
  if (selectedEntityId.value && year && month) {
    isGlobalLoading.value = true;
    fetchRateList(year, month);
  }
});

onMounted(() => {
  if (!authStore.user?.value) return;
  const year = selectedYear.value !== "" ? Number(selectedYear.value) : undefined;
  const month = selectedMonth.value !== "" ? Number(selectedMonth.value) : undefined;
  if (selectedEntityId.value && year && month) {
    isGlobalLoading.value = true;
    fetchRateList(year, month);
  }
});
</script>

<style scoped>
.container {
  width: 100%;
  min-width: 0;
  margin: 0 auto;
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-actions h2 {
  font-size: 1.875rem;
  font-weight: bold;
  margin: 0;
}

.filter-info-section {
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.filter-info-section h3 {
  margin-bottom: 12px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.filter-info-section .range-info {
  margin: 0;
  padding: 12px;
  background-color: #eff6ff;
  border-left: 4px solid #3b82f6;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #1e40af;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-info-section .range-info i {
  font-size: 1rem;
}

.download-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-download-pdf {
  background-color: #dc2626;
}
.btn-download-pdf:hover:not(:disabled) {
  background-color: #b91c1c;
}

.btn-download {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #53ab20;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-download:hover:not(:disabled) {
  background-color: #b91c1c;
}

.btn-download:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 80px 0;
  color: #6b7280;
  font-weight: 500;
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #6b7280;
}

.entity-section {
  min-width: 0;
  margin-bottom: 40px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.entity-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #111827;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 10px;
}

.table-section {
  margin-top: 20px;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #374151;
}

.table-wrapper {
  margin-bottom: 24px;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #4b5563;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.laporan-bulanan {
  min-width: max-content;
}

.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 12px 16px;
  text-align: left;
}

.data-table thead th {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
  text-align: left;
}

.data-table tbody td {
  text-align: right;
}

.data-table tbody td:first-child {
  text-align: left;
}

.data-table tbody tr:hover {
  background-color: #f3f4f6;
}

.data-table .empty {
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

/* Tabel laporan bulanan: No, Uraian, Jan–Des + horizontal scroll, kolom pertama fixed */
.laporan-bulanan .col-no {
  width: 48px;
  min-width: 48px;
  text-align: center;
  position: sticky;
  left: 0;
  z-index: 2;
  background: #f9fafb;
}
.laporan-bulanan .col-uraian {
  min-width: 180px;
  text-align: left;
  position: sticky;
  left: 48px;
  z-index: 2;
  background: #f9fafb;
  /* Shadow di tepi kanan kolom Uraian (inset = tidak terpotong overflow) */
  box-shadow: inset -10px 0 16px -4px rgba(0, 0, 0, 0.15);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}
.laporan-bulanan tbody td.col-no {
  text-align: center;
  background: #fff;
  z-index: 2;
}
.laporan-bulanan tbody td.col-uraian {
  text-align: left;
  background: #fff;
  z-index: 2;
  box-shadow: inset -10px 0 16px -4px rgba(0, 0, 0, 0.15);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}
.laporan-bulanan thead th.col-no {
  z-index: 3;
}
.laporan-bulanan thead th.col-uraian {
  z-index: 3;
}
.laporan-bulanan tbody tr:hover td.col-no,
.laporan-bulanan tbody tr:hover td.col-uraian {
  background: #f3f4f6;
}
.laporan-bulanan tbody td.subheader {
  font-weight: 600;
  background: #f3f4f6 !important;
}
.laporan-bulanan .col-bulan {
  min-width: 100px;
  text-align: right;
}
.laporan-bulanan .col-r {
  min-width: 72px;
  text-align: right;
}
</style>
