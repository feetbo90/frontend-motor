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
  role: 'UNIT',//role yang tersedia [unit, cabang, pusat]
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
    unit_jualkontan:0,
    unit_jualkredit:0,
    unit_jualleasing:0,
    tahun: currentDate.year,
    bulan: currentDate.month
  },
  pendapatan: {
    markup_kontan: 0,
    markup_kredit: 0,
    markup_jumlah: 0,
    realisasi_bunga: 0,
    diskon_bunga: 0,
    denda: 0,
    administrasi: 0,
    jumlah_pendapatan: 0,
    year: currentDate.year,
    month: currentDate.month
  },
  pendapatanLain: {
    penjualan_pk: 0,
    komisi: 0,
    denda_keterlambatan: 0,
    diskon_denda: 0,
    jumlah_pendapatan_lain: 0,
    year: currentDate.year,
    month: currentDate.month
  },
  piutang: {
    saldo_awal: 0,
    tambahan: 0,
    realisasi_pokok: 0,
    realisasi_bunga: 0,
    jumlah_angsuran: 0,
    saldo_akhir: 0,
    year: currentDate.year,
    month: currentDate.month
  },
  sirkulasiPiutang: {
    lancar: 0,
    kurang_lancar: 0,
    ragu_ragu: 0,
    macet_baru: 0,
    macet_lama: 0,
    total_piutang: 0,
    year: currentDate.year,
    month: currentDate.month
  },
  sirkulasiStock: {
    unit_awal: 0,
    unit_awal_data: 0,
    pembelian_tambahan: 0,
    pembelian_tambahan_data: 0,
    mutasi_masuk: 0,
    mutasi_keluar: 0,
    terjual: 0,
    terjual_data: 0,
    unit_akhir: 0,
    unit_akhir_data: 0,
    year: currentDate.year,
    month: currentDate.month
  },
  barangPK: {
    unit_awal: 0,
    unit_awal_data: 0,
    pk_tambahan: 0,
    pk_tambahan_data: 0,
    terjual: 0,
    terjual_data: 0,
    jumlah_pk: 0,
    jumlah_pk_data: 0,
    year: currentDate.year,
    month: currentDate.month
  }
})

// Data untuk beban
export const bebanData = ref({
  gaji: 0,
  admin: 0,
  operasional: 0,
  beban_umum_operasional: 0,
  penyusutan_aktiva: 0,
  cadangan_piutang: 0,
  cadangan_stock: 0,
  total: 0,
  year: currentDate.year,
  month: currentDate.month
})

// Data untuk laba rugi
export const labaRugiData = ref({
  kumulatif: 0,
  penarikan: 0,
  modal: 0,
  year:currentDate.year,
  month:currentDate.month
})

// Data untuk cadangan
export const cadanganData = ref({
  cadangan_piutang: 0,
  macet_real: 0,
  surplus_devist: 0,
  cadangan_stock: 0,
  cadangan_stock_data: 0,
  year:currentDate.year,
  month:currentDate.month
})

// Data untuk sumber daya

export const sumberDayaData = ref({
  jumlah_karyawan: 0,
  formasi_tenaga:0,
  pimpinan:0,
  kasir: 0,
  administrasi: 0,
  pdl: 0,
  formasi_kurang: 0,
  kontrak_kantor:0,
  inventaris_mobil:0,
  inventaris_mobil_ket:'',
  sisa_inventaris_pendirian:0,
  penyusutan_bulan:0,
  year:currentDate.year,
  month:currentDate.month

})

// Data untuk kas/keuangan
export const cashFlowData = ref({
  kas_tunai: 0,
  rekening_bank: 0,
  bon_karyawan: 0,
  bon_pusat: 0,
  bon_operasional: 0,
  bon_gantung: 0,
  jumlah_kas_lancar:0,
  jumlah_kas_macet:0,
  saldo_akhir:0,
  year:currentDate.year,
  month:currentDate.month
})

// Global loading state
export const isGlobalLoading = ref(false)

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