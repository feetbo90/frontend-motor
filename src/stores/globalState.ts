import { ref, computed } from 'vue'
import { useDate } from '@/composables/useDate'

// Global state untuk filter periode
// export const selectedYear = ref(new Date().getFullYear())
// export const selectedMonth = ref(new Date().getMonth() + 1)
export const selectedYear = ref<string | number>('')
export const selectedMonth = ref<string | number>('')
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
const { getCurrentDate } = useDate()
const currentDate = getCurrentDate()

export const produksiData = ref({
  penjualan: {
    kontan: 0,
    kredit: 0,
    leasing: 0,
    tahun: currentDate.tahun,
    bulan: currentDate.bulan
  },
  pendapatan: {
    markupKontan: 0,
    markupKredit: 0,
    realisasiBunga: 0,
    diskonBunga: 0,
    denda: 0,
    administrasi: 0,
    tahun: currentDate.tahun,
    bulan: currentDate.bulan
  },
  pendapatanLain: {
    penjualanPK: 0,
    komisi: 0,
    dendaKeterlambatan: 0,
    diskonDenda: 0,
    jumlahPendapatanLain: 0,
    tahun: currentDate.tahun,
    bulan: currentDate.bulan
  },
  piutang: {
    saldoAwal: 0,
    tambahan: 0,
    realisasiPokok: 0,
    realisasiBunga: 0,
    jumlahAngsuran: 0,
    saldoAkhir: 0,
    tahun: currentDate.tahun,
    bulan: currentDate.bulan
  },
  sirkulasiPiutang: {
    lancar: 0,
    kurangLancar: 0,
    raguRagu: 0,
    macetBaru: 0,
    macetLama: 0,
    totalPiutang: 0,
    tahun: currentDate.tahun,
    bulan: currentDate.bulan
  },
  sirkulasiStock: {
    unitAwal: 0,
    pembelianTambahan: 0,
    unitTerjual: 0,
    unitStokAkhir: 0,
    tahun: currentDate.tahun,
    bulan: currentDate.bulan
  },
  barangPK: {
    unitAwal: 0,
    pkTambahan: 0,
    unitTerjual: 0,
    unitPK: 0,
    tahun: currentDate.tahun,
    bulan: currentDate.bulan
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
  totalBeban: 0,
  tahun: currentDate.tahun,
  bulan: currentDate.bulan
})

// Computed values
export const currentPeriod = computed(() => {
  const { getMonthName } = useDate()
  const yearNumber = typeof selectedYear.value === 'string' ? Number(selectedYear.value) : selectedYear.value
  const monthNumber = typeof selectedMonth.value === 'string' ? Number(selectedMonth.value) : selectedMonth.value
  if (!yearNumber || !monthNumber) return 'Pilih periode'
  return `${getMonthName(monthNumber)} ${yearNumber}`
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