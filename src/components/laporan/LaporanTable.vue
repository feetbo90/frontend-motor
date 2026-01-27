<template>
  <div class="container">
    <div class="header-actions">
      <h2>Laporan Satuan Pengukuran</h2>
      <button class="btn-download" @click="downloadPDF" :disabled="loading || apiData.entityIds.length < 1">
        <i class="fas fa-file-pdf"></i>
        Download PDF
      </button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="apiData.entityIds.length < 1" class="empty-container">
      <img src="/images/empty.png" alt="Empty State" width="400" height="400" />
      <p class="empty">Data satuan pengukuran tidak ditemukan!</p>
    </div>
    <div v-else>
      <div v-for="entity in apiData.entityIds" :key="entity.id" class="entity-section">
        <h3 class="entity-title">{{ entity.name }} ({{ entity.type }})</h3>
        
        <!-- Rate Tables -->
        <div class="table-section">
          <h4 class="section-title">Tingkat Produksi (Rata - rata)</h4>
          
          <!-- Rate 1: Rata-rata Pembiayaan / Unit Penjualan -->
          <div class="table-wrapper">
            <h5 class="table-title">Rata-rata Pembiayaan / Unit Penjualan</h5>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Bulan / Tahun</th>
                  <th>Total Pembiayaan</th>
                  <th>Total Unit Jual</th>
                  <th>Pembiayaan / Unit Penjualan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="getRateSatu(entity.name).length === 0">
                  <td :colspan="4" class="empty">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in getRateSatu(entity.name)" :key="`${item.year}-${item.month}`">
                  <td>{{ item.month }}/{{ item.year }}</td>
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
                  <th>Bulan / Tahun</th>
                  <th>Total Penjualan</th>
                  <th>Total Unit</th>
                  <th>Penjualan / Unit Penjualan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="getRateDua(entity.name).length === 0">
                  <td :colspan="4" class="empty">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in getRateDua(entity.name)" :key="`${item.year}-${item.month}`">
                  <td>{{ item.month }}/{{ item.year }}</td>
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
                  <th>Bulan / Tahun</th>
                  <th>Total Penjualan</th>
                  <th>Jumlah Karyawan</th>
                  <th>Penjualan / Karyawan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="getRateTiga(entity.name).length === 0">
                  <td :colspan="4" class="empty">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in getRateTiga(entity.name)" :key="`${item.year}-${item.month}`">
                  <td>{{ item.month }}/{{ item.year }}</td>
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
                  <th>Bulan / Tahun</th>
                  <th>Total Markup</th>
                  <th>Jumlah Karyawan</th>
                  <th>Markup / Karyawan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="getRateEmpat(entity.name).length === 0">
                  <td :colspan="4" class="empty">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in getRateEmpat(entity.name)" :key="`${item.year}-${item.month}`">
                  <td>{{ item.month }}/{{ item.year }}</td>
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
                  <th>Bulan / Tahun</th>
                  <th>Total Gaji</th>
                  <th>Jumlah Karyawan</th>
                  <th>Gaji / Karyawan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="getRateLima(entity.name).length === 0">
                  <td :colspan="4" class="empty">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in getRateLima(entity.name)" :key="`${item.year}-${item.month}`">
                  <td>{{ item.month }}/{{ item.year }}</td>
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
                  <th>Bulan / Tahun</th>
                  <th>Total Beban Operasional</th>
                  <th>Jumlah Karyawan</th>
                  <th>Biaya Operasional / Karyawan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="getRateEnam(entity.name).length === 0">
                  <td :colspan="4" class="empty">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in getRateEnam(entity.name)" :key="`${item.year}-${item.month}`">
                  <td>{{ item.month }}/{{ item.year }}</td>
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
                  <th>Bulan / Tahun</th>
                  <th>Total Penyusutan Aktiva</th>
                  <th>Jumlah Karyawan</th>
                  <th>Beban Tetap / Karyawan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="getRateTujuh(entity.name).length === 0">
                  <td :colspan="4" class="empty">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in getRateTujuh(entity.name)" :key="`${item.year}-${item.month}`">
                  <td>{{ item.month }}/{{ item.year }}</td>
                  <td>{{ formatCurrency(Number(item.penyusutan || item.total_penyusutan_aktiva || 0)) }}</td>
                  <td>{{ item.jumlah_karyawan || item.total_karyawan || 0 }}</td>
                  <td>{{ formatCurrency(Number(item.rate_penyusutan_aktiva_per_karyawan)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Ratio Tables -->
        <div class="table-section" style="margin-top: 40px;">
          <h4 class="section-title">Ratio Produksi</h4>
          
          <!-- Rasio 1: Ratio Pembiayaan / Realisasi Pokok -->
          <div class="table-wrapper">
            <h5 class="table-title">Ratio Pembiayaan / Realisasi Pokok</h5>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Bulan / Tahun</th>
                  <th>Pembiayaan</th>
                  <th>Realisasi Pokok</th>
                  <th>Pembiayaan / Realisasi Pokok</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="getRasioSatu(entity.name, entity.type).length === 0">
                  <td :colspan="4" class="empty">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in getRasioSatu(entity.name, entity.type)" :key="`${item.year}-${item.month}`">
                  <td>{{ item.month }}/{{ item.year }}</td>
                  <td>{{ formatCurrency(Number(item.pembiayaan)) }}</td>
                  <td>{{ formatCurrency(Number(item.realisasi_pokok)) }}</td>
                  <td>{{ formatPercentage(Number(item.pembiayaan_per_realisasi_pokok)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Rasio 2: Ratio Kn /T Kemacetan / Pembiayaan -->
          <div class="table-wrapper">
            <h5 class="table-title">Ratio Kn /T Kemacetan / Pembiayaan</h5>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Bulan / Tahun</th>
                  <th>Kenaikan Macet</th>
                  <th>Pembiayaan</th>
                  <th>Ratio Kemacetan / Pembiayaan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="getRasioDua(entity.name, entity.type).length === 0">
                  <td :colspan="4" class="empty">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in getRasioDua(entity.name, entity.type)" :key="`${item.year}-${item.month}`">
                  <td>{{ item.month }}/{{ item.year }}</td>
                  <td>{{ formatCurrency(Number(item.cadangan_piutang)) }}</td>
                  <td>{{ formatCurrency(Number(item.tambahan)) }}</td>
                  <td>{{ formatPercentage(Number(item.rasio_kemacetan_pembiayaan)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Rasio 3: Ratio Mark up / Pembiayaan -->
          <div class="table-wrapper">
            <h5 class="table-title">Ratio Mark up / Pembiayaan</h5>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Bulan / Tahun</th>
                  <th>Total Markup</th>
                  <th>Pembiayaan</th>
                  <th>Ratio Markup</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="getRasioTiga(entity.name, entity.type).length === 0">
                  <td :colspan="4" class="empty">Data tidak ditemukan.</td>
                </tr>
                <tr v-for="item in getRasioTiga(entity.name, entity.type)" :key="`${item.year}-${item.month}`">
                  <td>{{ item.month }}/{{ item.year }}</td>
                  <td>{{ formatCurrency(Number(item.total_markup)) }}</td>
                  <td>{{ formatCurrency(Number(item.pembiayaan)) }}</td>
                  <td>{{ formatPercentage(Number(item.rasio_markup)) }}</td>
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
import { getProductRate, getProductRatio } from "@/services/productRateService";
import { useAuthStore } from "@/stores/auth";
import {
  formatCurrency,
  formatPercentage,
  isGlobalLoading,
  selectedEntityId,
  selectedMonth,
  selectedYear,
} from "@/stores/globalState";
import type { ProductRateData, ProductRatioData } from "@/types/productRate";
import { onMounted, ref, watch } from "vue";
import { useNotification } from "@/composables/useNotification";

// Import jsPDF - akan throw error jika tidak terinstall
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const authStore = useAuthStore();
const { notifyError, notifySuccess } = useNotification();
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

const apiRatioData = ref<ProductRatioData>({
  success: false,
  entity_id: "",
  entityIds: [],
  rasioSatu: {},
  rasioDua: {},
  rasioTiga: {},
  rasioEmpat: {},
  rasioLima: {},
  rasioEnam: {},
  rasioTujuh: {},
  rasioDelapan: {},
  rasioSembilan: {},
  rasioSepuluh: {},
  rasioSebelas: {},
});

const loading = ref(false);

// Helper methods to get rate data
const getRateSatu = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang
    ? apiData.value.cabang?.rate_satu || []
    : apiData.value.rate_satu[entityName] || [];
};

const getRateDua = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang ? apiData.value.cabang?.rate_dua || [] : apiData.value.rate_dua[entityName] || [];
};

const getRateTiga = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang
    ? apiData.value.cabang?.rate_tiga || []
    : apiData.value.rate_tiga[entityName] || [];
};

const getRateEmpat = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang
    ? apiData.value.cabang?.rate_empat || []
    : apiData.value.rate_empat[entityName] || [];
};

const getRateLima = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang
    ? apiData.value.cabang?.rate_lima || []
    : apiData.value.rate_lima[entityName] || [];
};

const getRateEnam = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang
    ? apiData.value.cabang?.rate_enam || []
    : apiData.value.rate_enam[entityName] || [];
};

const getRateTujuh = (entityName: string) => {
  const isCabang = apiData.value.cabang?.name === entityName;
  return isCabang
    ? apiData.value.cabang?.rate_tujuh || []
    : apiData.value.rate_tujuh[entityName] || [];
};

// Helper methods to get ratio data
const getRasioSatu = (entityName: string, entityType?: string) => {
  const isCabang = entityType === "CABANG" && apiRatioData.value.cabang;
  return isCabang
    ? apiRatioData.value.cabang?.rasioSatu || []
    : apiRatioData.value.rasioSatu[entityName] || [];
};

const getRasioDua = (entityName: string, entityType?: string) => {
  const isCabang = entityType === "CABANG" && apiRatioData.value.cabang;
  return isCabang
    ? apiRatioData.value.cabang?.rasioDua || []
    : apiRatioData.value.rasioDua[entityName] || [];
};

const getRasioTiga = (entityName: string, entityType?: string) => {
  const isCabang = entityType === "CABANG" && apiRatioData.value.cabang;
  return isCabang
    ? apiRatioData.value.cabang?.rasioTiga || []
    : apiRatioData.value.rasioTiga[entityName] || [];
};

const fetchRateList = async (year: number | undefined, month: number | undefined) => {
  try {
    loading.value = true;
    const response = await getProductRate({
      year,
      month,
      branch_id: Number(selectedEntityId.value) ?? undefined,
    });
    if (response.success) {
      apiData.value = response ?? {
        entity_id: "",
        entityIds: [],
        rate_satu: {},
        rate_tiga: {},
        rate_empat: {},
        rate_lima_enam_tujuh: {},
      };
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    isGlobalLoading.value = false;
  }
};

const fetchRatioList = async (year: number | undefined, month: number | undefined) => {
  try {
    loading.value = true;
    const response = await getProductRatio({
      year,
      month,
      branch_id: Number(selectedEntityId.value) ?? undefined,
    });
    if (response.success) {
      apiRatioData.value = response ?? {
        entity_id: "",
        entityIds: [],
        rasioSatu: {},
        rasioDua: {},
        rasioTiga: {},
        rasioEmpat: {},
        rasioLima: {},
        rasioEnam: {},
        rasioTujuh: {},
        rasioDelapan: {},
        rasioSembilan: {},
        rasioSepuluh: {},
        rasioSebelas: {},
      };
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    isGlobalLoading.value = false;
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
    doc.text('Laporan Satuan Pengukuran', 14, yPosition);
    yPosition += 10;
    
    const year = selectedYear.value !== "" ? selectedYear.value : 'Semua';
    const month = selectedMonth.value !== "" ? selectedMonth.value : 'Semua';
    doc.setFontSize(10);
    doc.text(`Periode: Bulan ${month} Tahun ${year}`, 14, yPosition);
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
      const rasioSatu = getRasioSatu(entity.name, entity.type);
      const rasioDua = getRasioDua(entity.name, entity.type);
      const rasioTiga = getRasioTiga(entity.name, entity.type);

      // Skip entity if no data at all
      const hasAnyData = rateSatu.length > 0 || rateDua.length > 0 || rateTiga.length > 0 || 
                        rateEmpat.length > 0 || rateLima.length > 0 || rateEnam.length > 0 || 
                        rateTujuh.length > 0 || rasioSatu.length > 0 || rasioDua.length > 0 || 
                        rasioTiga.length > 0;

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
          `${item.month || ''}/${item.year || ''}`,
          formatCurrency(Number(item.total_pembiayaan) || 0),
          formatCurrency(Number(item.total_unit_jual) || 0),
          formatCurrency(Number(item.pembiayaan_per_unit) || 0)
        ]);

        autoTable(doc, {
          head: [['Bulan / Tahun', 'Total Pembiayaan', 'Total Unit Jual', 'Pembiayaan / Unit Penjualan']],
          body: rateSatuData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
        // Get final Y position after table
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
          `${item.month || ''}/${item.year || ''}`,
          formatCurrency(Number(item.total_penjualan) || 0),
          formatCurrency(Number(item.total_unit) || 0),
          formatCurrency(Number(item.penjualan_per_unit) || 0)
        ]);

        autoTable(doc, {
          head: [['Bulan / Tahun', 'Total Penjualan', 'Total Unit', 'Penjualan / Unit Penjualan']],
          body: rateDuaData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
        // Get final Y position after table
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
          `${item.month || ''}/${item.year || ''}`,
          formatCurrency(Number(item.total_penjualan) || 0),
          String(item.jumlah_karyawan || item.total_karyawan || 0),
          formatCurrency(Number(item.penjualan_per_karyawan) || 0)
        ]);

        autoTable(doc, {
          head: [['Bulan / Tahun', 'Total Penjualan', 'Jumlah Karyawan', 'Penjualan / Karyawan']],
          body: rateTigaData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
        // Get final Y position after table
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
          `${item.month || ''}/${item.year || ''}`,
          formatCurrency(Number(item.total_markup) || 0),
          String(typeof item.jumlah_karyawan === "string" ? Number(item.jumlah_karyawan) : item.jumlah_karyawan || item.total_karyawan || 0),
          formatCurrency(Number(item.rate_empat || item.markup_per_karyawan || 0))
        ]);

        autoTable(doc, {
          head: [['Bulan / Tahun', 'Total Markup', 'Jumlah Karyawan', 'Markup / Karyawan']],
          body: rateEmpatData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
        // Get final Y position after table
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
          `${item.month || ''}/${item.year || ''}`,
          formatCurrency(Number(item.gaji || item.total_gaji || 0)),
          String(item.jumlah_karyawan || item.total_karyawan || 0),
          formatCurrency(Number(item.rate_gaji_per_karyawan) || 0)
        ]);

        autoTable(doc, {
          head: [['Bulan / Tahun', 'Total Gaji', 'Jumlah Karyawan', 'Gaji / Karyawan']],
          body: rateLimaData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
        // Get final Y position after table
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
          `${item.month || ''}/${item.year || ''}`,
          formatCurrency(Number(item.beban_umum_operasional || item.total_beban_umum_operasional || 0)),
          String(item.jumlah_karyawan || item.total_karyawan || 0),
          formatCurrency(Number(item.rate_beban_umum_operasional_per_karyawan) || 0)
        ]);

        autoTable(doc, {
          head: [['Bulan / Tahun', 'Total Beban Operasional', 'Jumlah Karyawan', 'Biaya Operasional / Karyawan']],
          body: rateEnamData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
        // Get final Y position after table
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
          `${item.month || ''}/${item.year || ''}`,
          formatCurrency(Number(item.penyusutan || item.total_penyusutan_aktiva || 0)),
          String(item.jumlah_karyawan || item.total_karyawan || 0),
          formatCurrency(Number(item.rate_penyusutan_aktiva_per_karyawan) || 0)
        ]);

        autoTable(doc, {
          head: [['Bulan / Tahun', 'Total Penyusutan Aktiva', 'Jumlah Karyawan', 'Beban Tetap / Karyawan']],
          body: rateTujuhData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
        // Get final Y position after table
        const finalY = (doc as any).lastAutoTable?.finalY || yPosition + 50;
        yPosition = finalY + 10;
      }

      // Ratio Section - only show if there's at least one ratio with data
      const hasRatioData = rasioSatu.length > 0 || rasioDua.length > 0 || rasioTiga.length > 0;
      
      if (hasRatioData) {
        if (yPosition > 180) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(11);
        doc.text('Ratio Produksi', 14, yPosition);
        yPosition += 6;

        // Rasio 1: Ratio Pembiayaan / Realisasi Pokok
        if (rasioSatu.length > 0) {
        if (yPosition > 180) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(10);
        doc.text('Ratio Pembiayaan / Realisasi Pokok', 14, yPosition);
        yPosition += 5;
        
        const rasioSatuData = rasioSatu.map(item => {
          const percentageValue = typeof item.pembiayaan_per_realisasi_pokok === 'string' 
            ? parseFloat(item.pembiayaan_per_realisasi_pokok) 
            : Number(item.pembiayaan_per_realisasi_pokok) || 0;
          return [
            `${item.month || ''}/${item.year || ''}`,
            formatCurrency(Number(item.pembiayaan) || 0),
            formatCurrency(Number(item.realisasi_pokok) || 0),
            formatPercentage(percentageValue)
          ];
        });

        autoTable(doc, {
          head: [['Bulan / Tahun', 'Pembiayaan', 'Realisasi Pokok', 'Pembiayaan / Realisasi Pokok']],
          body: rasioSatuData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
          // Get final Y position after table
          const finalY = (doc as any).lastAutoTable?.finalY || yPosition + 50;
          yPosition = finalY + 10;
        }

        // Rasio 2: Ratio Kn /T Kemacetan / Pembiayaan
        if (rasioDua.length > 0) {
        if (yPosition > 180) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(10);
        doc.text('Ratio Kn /T Kemacetan / Pembiayaan', 14, yPosition);
        yPosition += 5;
        
        const rasioDuaData = rasioDua.map(item => {
          const percentageValue = typeof item.rasio_kemacetan_pembiayaan === 'string' 
            ? parseFloat(item.rasio_kemacetan_pembiayaan) 
            : Number(item.rasio_kemacetan_pembiayaan) || 0;
          return [
            `${item.month || ''}/${item.year || ''}`,
            formatCurrency(Number(item.cadangan_piutang) || 0),
            formatCurrency(Number(item.tambahan) || 0),
            formatPercentage(percentageValue)
          ];
        });

        autoTable(doc, {
          head: [['Bulan / Tahun', 'Kenaikan Macet', 'Pembiayaan', 'Ratio Kemacetan / Pembiayaan']],
          body: rasioDuaData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
          // Get final Y position after table
          const finalY = (doc as any).lastAutoTable?.finalY || yPosition + 50;
          yPosition = finalY + 10;
        }

        // Rasio 3: Ratio Mark up / Pembiayaan
        if (rasioTiga.length > 0) {
        if (yPosition > 180) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(10);
        doc.text('Ratio Mark up / Pembiayaan', 14, yPosition);
        yPosition += 5;
        
        const rasioTigaData = rasioTiga.map(item => {
          const percentageValue = typeof item.rasio_markup === 'string' 
            ? parseFloat(item.rasio_markup) 
            : Number(item.rasio_markup) || 0;
          return [
            `${item.month || ''}/${item.year || ''}`,
            formatCurrency(Number(item.total_markup) || 0),
            formatCurrency(Number(item.pembiayaan) || 0),
            formatPercentage(percentageValue)
          ];
        });

        autoTable(doc, {
          head: [['Bulan / Tahun', 'Total Markup', 'Pembiayaan', 'Ratio Markup']],
          body: rasioTigaData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
          // Get final Y position after table
          const finalY = (doc as any).lastAutoTable?.finalY || yPosition + 50;
          yPosition = finalY + 10;
        }
      }
    });

    // Save the PDF
    const fileName = `Laporan_Satuan_Pengukuran_${selectedYear.value || 'All'}_${selectedMonth.value || 'All'}.pdf`;
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

watch([selectedYear, selectedMonth, selectedEntityId], () => {
  const year = selectedYear.value !== "" ? Number(selectedYear.value) : undefined;
  const month = selectedMonth.value !== "" ? Number(selectedMonth.value) : undefined;
  if (selectedEntityId.value && year && month) {
    isGlobalLoading.value = true;
    fetchRateList(year, month);
    fetchRatioList(year, month);
  }
});

onMounted(() => {
  if (!authStore.user?.value) return;
  const year = selectedYear.value !== "" ? Number(selectedYear.value) : undefined;
  const month = selectedMonth.value !== "" ? Number(selectedMonth.value) : undefined;
  if (selectedEntityId.value && year && month) {
    isGlobalLoading.value = true;
    fetchRateList(year, month);
    fetchRatioList(year, month);
  }
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
</style>
