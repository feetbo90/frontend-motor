<template>
  <div class="container">
    <div class="header-actions">
      <h2>Laporan Range Satuan Pengukuran</h2>
      <button class="btn-download" @click="downloadPDF" :disabled="loading || apiData.entityIds.length < 1">
        <i class="fas fa-file-pdf"></i>
        Download PDF
      </button>
    </div>

    <!-- Range Filter -->
    <div class="range-filter-section">
      <h3>Filter Range Periode</h3>
      <p class="range-info">
        <i class="fas fa-info-circle"></i>
        Tahun diambil dari filter sidebar. Pilih range bulan di bawah ini.
      </p>
      <div class="filter-row">
        <div class="filter-group">
          <FormSelect
            id="start-month"
            label="Bulan Mulai"
            v-model="startMonth"
            placeholder="Pilih Bulan Mulai"
            :options="monthOptions"
            :allowEmpty="true"
            @update:modelValue="clearMonthError"
          />
        </div>
        <div class="filter-group">
          <FormSelect
            id="end-month"
            label="Bulan Akhir"
            v-model="endMonth"
            placeholder="Pilih Bulan Akhir"
            :options="monthOptions"
            :allowEmpty="true"
            @update:modelValue="clearMonthError"
          />
        </div>
        <div class="filter-group">
          <button @click="applyRangeFilter" class="btn-apply" type="button">
            <i class="fas fa-filter"></i>
            Terapkan Filter
          </button>
        </div>
      </div>
      <p v-if="monthRangeError" class="error-text">{{ monthRangeError }}</p>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="apiData.entityIds.length < 1" class="empty-container">
      <img src="/images/empty.png" alt="Empty State" width="400" height="400" />
      <p class="empty">Data range satuan pengukuran tidak ditemukan!</p>
    </div>
    <div v-else>
      <div v-for="entity in apiData.entityIds" :key="entity.id" class="entity-section">
        <h3 class="entity-title">{{ entity.name }} ({{ entity.type }})</h3>
        
        <!-- Rate Tables -->
        <div class="table-section">
          <h4 class="section-title">Tingkat Produksi (Rata - rata) - Range</h4>
          
          <!-- Rate 1: Rata-rata Pembiayaan / Unit Penjualan -->
          <div class="table-wrapper">
            <h5 class="table-title">Rata-rata Pembiayaan / Unit Penjualan</h5>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Periode</th>
                  <th>Total Pembiayaan</th>
                  <th>Total Unit Jual</th>
                  <th>Pembiayaan / Unit Penjualan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="getRateSatu(entity.name).length === 0">
                  <td :colspan="4" class="empty">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in getRateSatu(entity.name)" :key="`${item.year}-${item.month_start || item.month}-${item.month_end || item.month}`">
                  <td>{{ formatRangePeriod(item) }}</td>
                  <td>{{ formatCurrency(Number(item.total_pembiayaan)) }}</td>
                  <td>{{ formatCurrency(Number(item.total_unit_jual)) }}</td>
                  <td>{{ formatCurrency(Number(item.pembiayaan_per_unit)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Rate 2: Rata-rata Penjualan / Unit Penjualan -->
          <div class="table-wrapper">
            <h5 class="table-title">Rata-rata Penjualan / Unit Penjualan</h5>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Periode</th>
                  <th>Total Penjualan</th>
                  <th>Total Unit</th>
                  <th>Penjualan / Unit Penjualan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="getRateDua(entity.name).length === 0">
                  <td :colspan="4" class="empty">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in getRateDua(entity.name)" :key="`${item.year}-${item.month_start || item.month}-${item.month_end || item.month}`">
                  <td>{{ formatRangePeriod(item) }}</td>
                  <td>{{ formatCurrency(Number(item.total_penjualan)) }}</td>
                  <td>{{ formatCurrency(Number(item.total_unit)) }}</td>
                  <td>{{ formatCurrency(Number(item.penjualan_per_unit)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Rate 3: Rata-rata Penjualan / Karyawan -->
          <div class="table-wrapper">
            <h5 class="table-title">Rata-rata Penjualan / Karyawan</h5>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Periode</th>
                  <th>Total Penjualan</th>
                  <th>Jumlah Karyawan</th>
                  <th>Penjualan / Karyawan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="getRateTiga(entity.name).length === 0">
                  <td :colspan="4" class="empty">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in getRateTiga(entity.name)" :key="`${item.year}-${item.month_start || item.month}-${item.month_end || item.month}`">
                  <td>{{ formatRangePeriod(item) }}</td>
                  <td>{{ formatCurrency(Number(item.total_penjualan)) }}</td>
                  <td>{{ item.jumlah_karyawan || item.total_karyawan || 0 }}</td>
                  <td>{{ formatCurrency(Number(item.penjualan_per_karyawan)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Rate 4: Rata-rata Mark up / Karyawan -->
          <div class="table-wrapper">
            <h5 class="table-title">Rata-rata Mark up / Karyawan</h5>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Periode</th>
                  <th>Total Markup</th>
                  <th>Jumlah Karyawan</th>
                  <th>Markup / Karyawan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="getRateEmpat(entity.name).length === 0">
                  <td :colspan="4" class="empty">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in getRateEmpat(entity.name)" :key="`${item.year}-${item.month_start || item.month}-${item.month_end || item.month}`">
                  <td>{{ formatRangePeriod(item) }}</td>
                  <td>{{ formatCurrency(Number(item.total_markup)) }}</td>
                  <td>{{ typeof item.jumlah_karyawan === "string" ? Number(item.jumlah_karyawan) : item.jumlah_karyawan || item.total_karyawan || 0 }}</td>
                  <td>{{ formatCurrency(Number(item.rate_empat || item.markup_per_karyawan || 0)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Rate 5: Rata-rata Gaji / Karyawan -->
          <div class="table-wrapper">
            <h5 class="table-title">Rata-rata Gaji / Karyawan</h5>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Periode</th>
                  <th>Total Gaji</th>
                  <th>Jumlah Karyawan</th>
                  <th>Gaji / Karyawan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="getRateLima(entity.name).length === 0">
                  <td :colspan="4" class="empty">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in getRateLima(entity.name)" :key="`${item.year}-${item.month_start || item.month}-${item.month_end || item.month}`">
                  <td>{{ formatRangePeriod(item) }}</td>
                  <td>{{ formatCurrency(Number(item.gaji || item.total_gaji || 0)) }}</td>
                  <td>{{ item.jumlah_karyawan || item.total_karyawan || 0 }}</td>
                  <td>{{ formatCurrency(Number(item.rate_gaji_per_karyawan)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Rate 6: Rata-rata Biaya Operasional / Karyawan -->
          <div class="table-wrapper">
            <h5 class="table-title">Rata-rata Biaya Operasional / Karyawan</h5>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Periode</th>
                  <th>Total Beban Operasional</th>
                  <th>Jumlah Karyawan</th>
                  <th>Biaya Operasional / Karyawan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="getRateEnam(entity.name).length === 0">
                  <td :colspan="4" class="empty">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in getRateEnam(entity.name)" :key="`${item.year}-${item.month_start || item.month}-${item.month_end || item.month}`">
                  <td>{{ formatRangePeriod(item) }}</td>
                  <td>{{ formatCurrency(Number(item.beban_umum_operasional || item.total_beban_umum_operasional || 0)) }}</td>
                  <td>{{ item.jumlah_karyawan || item.total_karyawan || 0 }}</td>
                  <td>{{ formatCurrency(Number(item.rate_beban_umum_operasional_per_karyawan)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Rate 7: Rata-rata Beban Tetap / Karyawan -->
          <div class="table-wrapper">
            <h5 class="table-title">Rata-rata Beban Tetap / Karyawan</h5>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Periode</th>
                  <th>Total Penyusutan Aktiva</th>
                  <th>Jumlah Karyawan</th>
                  <th>Beban Tetap / Karyawan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="getRateTujuh(entity.name).length === 0">
                  <td :colspan="4" class="empty">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in getRateTujuh(entity.name)" :key="`${item.year}-${item.month_start || item.month}-${item.month_end || item.month}`">
                  <td>{{ formatRangePeriod(item) }}</td>
                  <td>{{ formatCurrency(Number(item.penyusutan || item.total_penyusutan_aktiva || 0)) }}</td>
                  <td>{{ item.jumlah_karyawan || item.total_karyawan || 0 }}</td>
                  <td>{{ formatCurrency(Number(item.rate_penyusutan_aktiva_per_karyawan)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getProductRateRange } from "@/services/productRateService";
import { useAuthStore } from "@/stores/auth";
import {
  formatCurrency,
  isGlobalLoading,
  selectedEntityId,
  selectedYear,
} from "@/stores/globalState";
import type { ProductRateData } from "@/types/productRate";
import { onMounted, ref, watch } from "vue";
import { useNotification } from "@/composables/useNotification";
import { useDate } from "@/composables/useDate";
import FormSelect from "@/components/FormSelect.vue";

// Import jsPDF
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const authStore = useAuthStore();
const { notifyError, notifySuccess } = useNotification();
const { monthOptions, currentMonth, getMonthName } = useDate();

// Range filter state
const startMonth = ref<string | number>(currentMonth);
const endMonth = ref<string | number>(currentMonth);
const monthRangeError = ref<string>("");

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

// Helper function to format range period
const formatRangePeriod = (item: { year: number; month?: number; month_start?: number; month_end?: number }) => {
  if (!item) return '';
  const startMonthName = getMonthName(item.month_start || item.month || 1);
  const endMonthName = getMonthName(item.month_end || item.month || 1);
  const year = item.year;
  
  if (item.month_start === item.month_end) {
    return `${startMonthName} ${year}`;
  }
  return `${startMonthName} - ${endMonthName} ${year}`;
};

// Helper methods to get rate data (with cabang support) - returns array
const getRateSatu = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  const data = isCabang
    ? apiData.value.cabang?.rate_satu
    : apiData.value.rate_satu[entityName];
  
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

const getRateDua = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  const data = isCabang
    ? apiData.value.cabang?.rate_dua
    : apiData.value.rate_dua[entityName];
  
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

const getRateTiga = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  const data = isCabang
    ? apiData.value.cabang?.rate_tiga
    : apiData.value.rate_tiga[entityName];
  
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

const getRateEmpat = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  const data = isCabang
    ? apiData.value.cabang?.rate_empat
    : apiData.value.rate_empat[entityName];
  
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

const getRateLima = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  const data = isCabang
    ? apiData.value.cabang?.rate_lima
    : apiData.value.rate_lima[entityName];
  
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

const getRateEnam = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  const data = isCabang
    ? apiData.value.cabang?.rate_enam
    : apiData.value.rate_enam[entityName];
  
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

const getRateTujuh = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  const data = isCabang
    ? apiData.value.cabang?.rate_tujuh
    : apiData.value.rate_tujuh[entityName];
  
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

const fetchRateListRange = async (year: number, monthStart: number, monthEnd: number) => {
  try {
    loading.value = true;
    const response = await getProductRateRange({
      year,
      month_start: monthStart,
      month_end: monthEnd,
      branch_id: Number(selectedEntityId.value) ?? undefined,
    });
    if (response.success) {
      apiData.value = response ?? {
        entity_id: "",
        entityIds: [],
        rate_satu: {},
        rate_dua: {},
        rate_tiga: {},
        rate_empat: {},
        rate_lima: {},
        rate_enam: {},
        rate_tujuh: {},
      };
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    isGlobalLoading.value = false;
  }
};

// Clear error when user changes month input
const clearMonthError = () => {
  monthRangeError.value = "";
};

const applyRangeFilter = async () => {
  // Clear previous errors
  monthRangeError.value = "";

  if (!selectedYear.value) {
    monthRangeError.value = "Silakan pilih tahun di filter sidebar terlebih dahulu!";
    return;
  }

  if (!startMonth.value || !endMonth.value) {
    monthRangeError.value = "Silakan lengkapi bulan mulai dan bulan akhir!";
    return;
  }

  if (!selectedEntityId.value) {
    monthRangeError.value = "Silakan pilih entity (cabang/unit) di filter sidebar terlebih dahulu!";
    return;
  }

  const year = Number(selectedYear.value);
  const startM = Number(startMonth.value);
  const endM = Number(endMonth.value);

  // Validate range - bulan mulai harus <= bulan akhir
  if (startM > endM) {
    monthRangeError.value = "Bulan mulai harus lebih kecil atau sama dengan bulan akhir!";
    return;
  }

  try {
    loading.value = true;
    isGlobalLoading.value = true;

    // Reset data
    apiData.value = {
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
    };

    // Fetch data for range
    await fetchRateListRange(year, startM, endM);

    // Clear error on success
    monthRangeError.value = "";
  } catch (err) {
    console.error(err);
    monthRangeError.value = "Gagal memuat data. Silakan coba lagi.";
  } finally {
    loading.value = false;
    isGlobalLoading.value = false;
  }
};

// Auto-apply filter when all required values are available
const checkAndApplyFilter = async () => {
  if (
    selectedYear.value &&
    startMonth.value &&
    endMonth.value &&
    selectedEntityId.value
  ) {
    await applyRangeFilter();
  }
};

const downloadPDF = () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  try {
    // Check if there's data to export
    if (!apiData.value.entityIds || apiData.value.entityIds.length === 0) {
      notifyError({ 
        title: 'Error', 
        msg: 'Tidak ada data untuk diekspor. Pastikan data sudah dimuat dengan benar.' 
      });
      return;
    }

    // Validate jsPDF is available
    if (typeof jsPDF === 'undefined') {
      throw new Error('Library jsPDF tidak ditemukan. Silakan refresh halaman atau hubungi administrator.');
    }

    // Validate autoTable is available
    if (typeof autoTable === 'undefined') {
      throw new Error('Library jspdf-autotable tidak ditemukan. Silakan refresh halaman atau hubungi administrator.');
    }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    
    let yPosition = 20;
    
    // Title
    doc.setFontSize(16);
    doc.text('Laporan Range Satuan Pengukuran', 14, yPosition);
    yPosition += 10;
    
    const year = selectedYear.value !== "" ? selectedYear.value : 'Semua';
    const monthStartName = startMonth.value ? getMonthName(Number(startMonth.value)) : 'Semua';
    const monthEndName = endMonth.value ? getMonthName(Number(endMonth.value)) : 'Semua';
    doc.setFontSize(10);
    doc.text(`Periode: ${monthStartName} - ${monthEndName} Tahun ${year}`, 14, yPosition);
    yPosition += 15;

    // Process each entity
    apiData.value.entityIds.forEach((entity) => {
      // Check if we need a new page
      if (yPosition > 180) {
        doc.addPage();
        yPosition = 20;
      }

      // Check if entity has any data
      const rateSatu = getRateSatu(entity.name);
      const rateDua = getRateDua(entity.name);
      const rateTiga = getRateTiga(entity.name);
      const rateEmpat = getRateEmpat(entity.name);
      const rateLima = getRateLima(entity.name);
      const rateEnam = getRateEnam(entity.name);
      const rateTujuh = getRateTujuh(entity.name);

      // Skip entity if no data at all
      const hasAnyData = rateSatu.length > 0 || rateDua.length > 0 || rateTiga.length > 0 || 
                        rateEmpat.length > 0 || rateLima.length > 0 || rateEnam.length > 0 || 
                        rateTujuh.length > 0;

      if (!hasAnyData) {
        return; // Skip this entity if no data
      }

      // Entity header
      doc.setFontSize(14);
      doc.text(`${entity.name} (${entity.type})`, 14, yPosition);
      yPosition += 8;

      // Rate 1: Rata-rata Pembiayaan / Unit Penjualan
      if (rateSatu.length > 0) {
        if (yPosition > 180) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(10);
        doc.text('Rata-rata Pembiayaan / Unit Penjualan', 14, yPosition);
        yPosition += 5;
        
        const rateSatuData = rateSatu.map(item => [
          formatRangePeriod(item),
          formatCurrency(Number(item.total_pembiayaan) || 0),
          formatCurrency(Number(item.total_unit_jual) || 0),
          formatCurrency(Number(item.pembiayaan_per_unit) || 0)
        ]);

        autoTable(doc, {
          head: [['Periode', 'Total Pembiayaan', 'Total Unit Jual', 'Pembiayaan / Unit Penjualan']],
          body: rateSatuData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
        const finalY = (doc as any).lastAutoTable?.finalY || yPosition + 50;
        yPosition = finalY + 10;
      }

      // Rate 2: Rata-rata Penjualan / Unit Penjualan
      if (rateDua.length > 0) {
        if (yPosition > 180) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(10);
        doc.text('Rata-rata Penjualan / Unit Penjualan', 14, yPosition);
        yPosition += 5;
        
        const rateDuaData = rateDua.map(item => [
          formatRangePeriod(item),
          formatCurrency(Number(item.total_penjualan) || 0),
          formatCurrency(Number(item.total_unit) || 0),
          formatCurrency(Number(item.penjualan_per_unit) || 0)
        ]);

        autoTable(doc, {
          head: [['Periode', 'Total Penjualan', 'Total Unit', 'Penjualan / Unit Penjualan']],
          body: rateDuaData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
        const finalY = (doc as any).lastAutoTable?.finalY || yPosition + 50;
        yPosition = finalY + 10;
      }

      // Rate 3: Rata-rata Penjualan / Karyawan
      if (rateTiga.length > 0) {
        if (yPosition > 180) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(10);
        doc.text('Rata-rata Penjualan / Karyawan', 14, yPosition);
        yPosition += 5;
        
        const rateTigaData = rateTiga.map(item => [
          formatRangePeriod(item),
          formatCurrency(Number(item.total_penjualan) || 0),
          String(item.jumlah_karyawan || item.total_karyawan || 0),
          formatCurrency(Number(item.penjualan_per_karyawan) || 0)
        ]);

        autoTable(doc, {
          head: [['Periode', 'Total Penjualan', 'Jumlah Karyawan', 'Penjualan / Karyawan']],
          body: rateTigaData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
        const finalY = (doc as any).lastAutoTable?.finalY || yPosition + 50;
        yPosition = finalY + 10;
      }

      // Rate 4: Rata-rata Mark up / Karyawan
      if (rateEmpat.length > 0) {
        if (yPosition > 180) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(10);
        doc.text('Rata-rata Mark up / Karyawan', 14, yPosition);
        yPosition += 5;
        
        const rateEmpatData = rateEmpat.map(item => [
          formatRangePeriod(item),
          formatCurrency(Number(item.total_markup) || 0),
          String(typeof item.jumlah_karyawan === "string" ? Number(item.jumlah_karyawan) : item.jumlah_karyawan || item.total_karyawan || 0),
          formatCurrency(Number(item.rate_empat || item.markup_per_karyawan || 0))
        ]);

        autoTable(doc, {
          head: [['Periode', 'Total Markup', 'Jumlah Karyawan', 'Markup / Karyawan']],
          body: rateEmpatData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
        const finalY = (doc as any).lastAutoTable?.finalY || yPosition + 50;
        yPosition = finalY + 10;
      }

      // Rate 5: Rata-rata Gaji / Karyawan
      if (rateLima.length > 0) {
        if (yPosition > 180) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(10);
        doc.text('Rata-rata Gaji / Karyawan', 14, yPosition);
        yPosition += 5;
        
        const rateLimaData = rateLima.map(item => [
          formatRangePeriod(item),
          formatCurrency(Number(item.gaji || item.total_gaji || 0)),
          String(item.jumlah_karyawan || item.total_karyawan || 0),
          formatCurrency(Number(item.rate_gaji_per_karyawan) || 0)
        ]);

        autoTable(doc, {
          head: [['Periode', 'Total Gaji', 'Jumlah Karyawan', 'Gaji / Karyawan']],
          body: rateLimaData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
        const finalY = (doc as any).lastAutoTable?.finalY || yPosition + 50;
        yPosition = finalY + 10;
      }

      // Rate 6: Rata-rata Biaya Operasional / Karyawan
      if (rateEnam.length > 0) {
        if (yPosition > 180) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(10);
        doc.text('Rata-rata Biaya Operasional / Karyawan', 14, yPosition);
        yPosition += 5;
        
        const rateEnamData = rateEnam.map(item => [
          formatRangePeriod(item),
          formatCurrency(Number(item.beban_umum_operasional || item.total_beban_umum_operasional || 0)),
          String(item.jumlah_karyawan || item.total_karyawan || 0),
          formatCurrency(Number(item.rate_beban_umum_operasional_per_karyawan) || 0)
        ]);

        autoTable(doc, {
          head: [['Periode', 'Total Beban Operasional', 'Jumlah Karyawan', 'Biaya Operasional / Karyawan']],
          body: rateEnamData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
        const finalY = (doc as any).lastAutoTable?.finalY || yPosition + 50;
        yPosition = finalY + 10;
      }

      // Rate 7: Rata-rata Beban Tetap / Karyawan
      if (rateTujuh.length > 0) {
        if (yPosition > 180) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(10);
        doc.text('Rata-rata Beban Tetap / Karyawan', 14, yPosition);
        yPosition += 5;
        
        const rateTujuhData = rateTujuh.map(item => [
          formatRangePeriod(item),
          formatCurrency(Number(item.penyusutan || item.total_penyusutan_aktiva || 0)),
          String(item.jumlah_karyawan || item.total_karyawan || 0),
          formatCurrency(Number(item.rate_penyusutan_aktiva_per_karyawan) || 0)
        ]);

        autoTable(doc, {
          head: [['Periode', 'Total Penyusutan Aktiva', 'Jumlah Karyawan', 'Beban Tetap / Karyawan']],
          body: rateTujuhData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
        const finalY = (doc as any).lastAutoTable?.finalY || yPosition + 50;
        yPosition = finalY + 10;
      }
    });

    // Save the PDF
    const fileName = `Laporan_Range_Satuan_Pengukuran_${selectedYear.value || 'All'}_${startMonth.value || 'All'}-${endMonth.value || 'All'}.pdf`;
    doc.save(fileName);
    
    // Show success notification
    notifySuccess({ 
      title: 'Berhasil', 
      msg: 'PDF berhasil diunduh. File tersimpan di folder Downloads.' 
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Terjadi kesalahan saat membuat PDF. Silakan coba lagi atau hubungi administrator.';
    
    notifyError({ 
      title: 'Error Generate PDF', 
      msg: errorMessage 
    });
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
};

// Watch for changes in required filters and auto-apply
watch([selectedYear, selectedEntityId], () => {
  checkAndApplyFilter();
});

onMounted(() => {
  if (!authStore.user?.value) return;
  // Auto-apply filter on mount if all conditions are met
  checkAndApplyFilter();
});
</script>

<style scoped>
.container {
  width: 100%;
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

.btn-download {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #dc2626;
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
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #374151;
}

.table-wrapper {
  margin-bottom: 24px;
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

.range-filter-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.range-filter-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #111827;
}

.range-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #eff6ff;
  border-left: 4px solid #3b82f6;
  border-radius: 4px;
  color: #1e40af;
  font-size: 0.875rem;
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.filter-group {
  flex: 1;
  min-width: 150px;
}

.error-text {
  margin-top: 12px;
  padding: 12px;
  font-size: 0.875rem;
  color: #dc2626;
  background-color: #fef2f2;
  border-left: 4px solid #dc2626;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-text::before {
  content: "⚠";
  font-size: 1rem;
  flex-shrink: 0;
}

.btn-apply {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
  width: 100%;
  justify-content: center;
}

.btn-apply:hover {
  background-color: #2563eb;
}
</style>
