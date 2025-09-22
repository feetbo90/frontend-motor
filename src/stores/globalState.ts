import { ref, computed } from 'vue'

// Global state untuk filter periode
export const selectedYear = ref(new Date().getFullYear())
export const selectedMonth = ref(new Date().getMonth() + 1)
export const selectedCabang = ref('')
export const selectedUnit = ref('')

// Dummy User information
export const userInfo = ref({
  name: 'Admin Pandu Motor',
  role: 'unit',//role yang tersedia [unit, cabang, pusat]
  email: 'admin@pandumotor.com',
  avatar: null,
  lastLogin: new Date().toLocaleDateString('id-ID')
})

// Data store untuk dashboard
export const dashboardData = ref({
  totalPenjualan: 250000000,
  totalBeban: 180000000,
  labaRugi: 70000000,
  totalKaryawan: 25,
  totalPiutang: 150000000
})

// Data untuk produksi
export const produksiData = ref({
  penjualan: {
    kontan: 0,
    kredit: 0,
    leasing: 0
  },
  pendapatan: {
    markupKontan: 0,
    markupKredit: 0,
    realisasiBunga: 0,
    diskonBunga: 0,
    denda: 0,
    administrasi: 0
  },
  pendapatanLain: {
    penjualanPK: 0,
    komisi: 0,
    dendaKeterlambatan: 0,
    diskonDenda: 0,
    jumlahPendapatanLain: 0
  },
  piutang: {
    saldoAwal: 0,
    tambahan: 0,
    realisasiPokok: 0,
    realisasiBunga: 0,
    jumlahAngsuran: 0,
    saldoAkhir: 0
  },
  sirkulasiPiutang: {
    lancar: 0,
    kurangLancar: 0,
    raguRagu: 0,
    macetBaru: 0,
    macetLama: 0,
    totalPiutang: 0
  },
  sirkulasiStock: {
    unitAwal: 0,
    pembelianTambahan: 0,
    unitTerjual: 0,
    unitStokAkhir: 0
  },
  barangPK: {
    unitAwal: 0,
    pkTambahan: 0,
    unitTerjual: 0,
    unitPK: 0
  }
})

// Data untuk beban
export const bebanData = ref({
  gajiInsentif: 0,
  bebanUmum: 0,
  bebanOperasional: 0,
  jumlahBebanUmumOps: 0,
  bebanPenyusutan: 0,
  cadanganPHPiutang: 0,
  cadanganPHStok: 0,
  totalBeban: 0
})

// Computed values
export const currentPeriod = computed(() => {
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return `${months[selectedMonth.value - 1]} ${selectedYear.value}`
})
// currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}