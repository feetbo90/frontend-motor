
import type { ResponseData } from "./response-data.type";

interface RateSatuItem {
  type: string;
  year: number;
  month?: number;
  month_start?: number;
  month_end?: number;
  total_pembiayaan: number;
  total_unit_jual: number;
  pembiayaan_per_unit: number;
}

interface RateDuaItem {
  year: number;
  month?: number;
  month_start?: number;
  month_end?: number;
  type: string;
  total_penjualan: number;
  total_unit: number;
  penjualan_per_unit: number;
}
interface RateTigaItem {
  year: number;
  month?: number;
  month_start?: number;
  month_end?: number;
  total_penjualan: number;
  jumlah_karyawan?: number;
  total_karyawan?: number;
  penjualan_per_karyawan: number;
  type?: string;
}

interface RateEmpatItem {
  year: number;
  month?: number;
  month_start?: number;
  month_end?: number;
  total_markup: number;
  jumlah_karyawan?: number | string;
  total_karyawan?: number;
  rate_empat?: number;
  markup_per_karyawan?: number;
}

interface RateLimaItem {
  year: number;
  month?: number;
  month_start?: number;
  month_end?: number;
  branch_id?: string;
  gaji?: number;
  total_gaji?: number;
  jumlah_karyawan?: number;
  total_karyawan?: number;
  rate_gaji_per_karyawan: number;
  type?: string;
}
interface RateEnamItem {
  year: number;
  month?: number;
  month_start?: number;
  month_end?: number;
  branch_id?: string;
  type?: string;
  jumlah_karyawan?: number;
  total_karyawan?: number;
  beban_umum_operasional?: number;
  total_beban_umum_operasional?: number;
  rate_beban_umum_operasional_per_karyawan: number;
}
interface RateTujuhItem {
  year: number;
  month?: number;
  month_start?: number;
  month_end?: number;
  branch_id?: string;
  type?: string;
  jumlah_karyawan?: number;
  total_karyawan?: number;
  penyusutan?: number;
  total_penyusutan_aktiva?: number;
  rate_penyusutan_aktiva_per_karyawan: number;
}

interface RateDelapanItem {
  type: string;
  year: number;
  month?: number;
  month_start?: number;
  month_end?: number;
  total_penyusutan_aktiva: number;
  total_unit: number;
  rate_penyusutan_aktiva_per_unit: number;
}

interface RateSembilanItem {
  type: string;
  year: number;
  month?: number;
  month_start?: number;
  month_end?: number;
  total_penyusutan_aktiva: number;
  total_cadangan_piutang: number;
  total_cadangan_stock: number;
  total_unit: number;
  rate_penyusutan_dan_cadangan_per_unit: number;
}

interface RateSepuluhItem {
  type: string;
  year: number;
  month?: number;
  month_start?: number;
  month_end?: number;
  total_kumulatif: number;
  total_unit: number;
  kumulatif_per_unit: number;
}

interface RateSebelasItem {
  type: string;
  year: number;
  month?: number;
  month_start?: number;
  month_end?: number;
  total_kumulatif: number;
  total_karyawan: number;
  kumulatif_per_karyawan: number;
}

// CabangData & ProductRateData pakai bentuk response API (RatesRatios*Item[]) - didefinisikan di bawah
interface CabangData {
  name: string;
  rate_satu: RatesRatiosRateSatuItem[];
  rate_dua: RatesRatiosRateDuaItem[];
  rate_tiga: RatesRatiosRateTigaItem[];
  rate_empat: RatesRatiosRateEmpatItem[];
  rate_lima: RatesRatiosLimaItem[];
  rate_enam: RatesRatiosEnamItem[];
  rate_tujuh: RatesRatiosTujuhItem[];
  rate_delapan?: RatesRatiosRateDelapanItem[];
  rate_sembilan?: RatesRatiosRateSembilanItem[];
  rate_sepuluh?: RatesRatiosRateSepuluhItem[];
  rate_sebelas?: RatesRatiosRateSebelasItem[];
}
export interface ProductRateData {
  success?: boolean;
  entity_id: string;
  entityIds: entityIds[];
  cabang?: CabangData;
  rate_satu: { [unitName: string]: RatesRatiosRateSatuItem[] };
  rate_dua: { [unitName: string]: RatesRatiosRateDuaItem[] };
  rate_tiga: { [unitName: string]: RatesRatiosRateTigaItem[] };
  rate_empat: { [unitName: string]: RatesRatiosRateEmpatItem[] };
  rate_lima: { [unitName: string]: RatesRatiosLimaItem[] };
  rate_enam: { [unitName: string]: RatesRatiosEnamItem[] };
  rate_tujuh: { [unitName: string]: RatesRatiosTujuhItem[] };
  rate_delapan?: { [unitName: string]: RatesRatiosRateDelapanItem[] };
  rate_sembilan?: { [unitName: string]: RatesRatiosRateSembilanItem[] };
  rate_sepuluh?: { [unitName: string]: RatesRatiosRateSepuluhItem[] };
  rate_sebelas?: { [unitName: string]: RatesRatiosRateSebelasItem[] };
  ratio_satu?: { [unitName: string]: RatesRatiosRatioItem[] };
  ratio_dua?: { [unitName: string]: RatesRatiosRatioItem[] };
  ratio_tiga?: { [unitName: string]: RatesRatiosRatioItem[] };
  ratio_empat?: { [unitName: string]: RatesRatiosRatioItem[] };
  ratio_lima?: { [unitName: string]: RatesRatiosRatioItem[] };
  ratio_enam?: { [unitName: string]: RatesRatiosRatioItem[] };
  ratio_tujuh?: { [unitName: string]: RatesRatiosRatioItem[] };
  ratio_delapan?: { [unitName: string]: RatesRatiosRatioItem[] };
  ratio_sembilan?: { [unitName: string]: RatesRatiosRatioItem[] };
  ratio_sepuluh?: { [unitName: string]: RatesRatiosRatioItem[] };
  ratio_sebelas?: { [unitName: string]: RatesRatiosRatioItem[] };
}

// Ratio Interfaces
interface RasioSatuItem {
  type: string;
  year: number;
  month: number;
  pembiayaan: number;
  realisasi_pokok: number;
  pembiayaan_per_realisasi_pokok: string;
}

interface RasioTigaItem {
  type: string;
  year: number;
  month: number;
  total_markup: string;
  pembiayaan: string;
  rasio_markup: string;
}

interface RasioEmpatItem {
  type: string;
  year: number;
  month: number;
  realisasi_bunga: string;
  total: string;
  rasio_realisasi_bunga_per_total_piutang: string;
}

interface RasioLimaItem {
  type: string;
  year: number;
  month: number;
  jumlah_pendapatan: string;
  total_markup: string;
  rasio_markup_per_jumlah_pendapatan: string;
}

interface RasioEnamItem {
  type: string;
  year: number;
  month: number;
  jumlah_pendapatan: string;
  realisasi_bunga: string;
  rasio_pendapatan_bunga_per_jumlah_pendapatan: string;
}

interface RasioTujuhItem {
  type: string;
  year: number;
  month: number;
  jumlah_pendapatan: string;
  jumlah_pendapatan_lain:string
  denda: string;
  administrasi: string;
  rasio_pendapatan_lainnya_per_jumlah_pendapatan: string;
}

interface RasioDelapanItem {
  type: string;
  year: number;
  month: number;
  jumlah_pendapatan: string;
  gaji: number;
  rasio_gaji_per_pendapatan: string;
}

interface RasioSembilanItem {
  type: string;
  year: number;
  month: number;
  jumlah_pendapatan: string;
  beban_umum_operasional: string;
  rasio_beban_operasional_per_pendapatan: string;
}

interface RasioDuaItem {
  type: string;
  year: number;
  month: number;
  macet_lama: string;
  stock_kredit: string;
  leasing: string;
  rasio_kemacetan_pembiayaan: string;
  cadangan_piutang:string;
  tambahan:string
}

interface RasioSepuluhItem {
  type: string;
  year: number;
  month: number;
  jumlah_pendapatan: string;
  penyusutan_aktiva: string;
  rasio_penyusutan_aktiva_per_jumlah_pendapatan: string;
}

interface RasioSebelasItem {
  type: string;
  year: number;
  month: number;
  jumlah_pendapatan: string;
  cadangan_piutang: string;
  rasio_cadangan_piutang_per_jumlah_pendapatan: string;
}

interface CabangRatioData {
  rasioSatu?: RasioSatuItem[];
  rasioDua?: RasioDuaItem[];
  rasioTiga?: RasioTigaItem[];
  rasioEmpat?: RasioEmpatItem[];
  rasioLima?: RasioLimaItem[];
  rasioEnam?: RasioEnamItem[];
  rasioTujuh?: RasioTujuhItem[];
  rasioDelapan?: RasioDelapanItem[];
  rasioSembilan?: RasioSembilanItem[];
  rasioSepuluh?: RasioSepuluhItem[];
  rasioSebelas?: RasioSebelasItem[];
}

export interface ProductRatioData {
  success?: boolean;
  entity_id: string;
  entityIds: entityIds[];
  cabang?: CabangRatioData;
  rasioSatu: {
    [unitName: string]: RasioSatuItem[];
  };
  rasioDua: {
    [unitName: string]: RasioDuaItem[];
  };
  rasioTiga: {
    [unitName: string]: RasioTigaItem[];
  };
  rasioEmpat: {
    [unitName: string]: RasioEmpatItem[];
  };
  rasioLima: {
    [unitName: string]: RasioLimaItem[];
  };
  rasioEnam: {
    [unitName: string]: RasioEnamItem[];
  };
  rasioTujuh: {
    [unitName: string]: RasioTujuhItem[];
  };
  rasioDelapan: {
    [unitName: string]: RasioDelapanItem[];
  };
  rasioSembilan: {
    [unitName: string]: RasioSembilanItem[];
  };
  rasioSepuluh: {
    [unitName: string]: RasioSepuluhItem[];
  };
  rasioSebelas: {
    [unitName: string]: RasioSebelasItem[];
  };
}
export interface entityIds{
    id: string;
    type: string;
    name: string;
}

export interface ParamsProductRate {
  branch_id: number | undefined;
  year?: number | undefined;
  month?: number| undefined;
  month_start?: number | undefined;
  month_end?: number | undefined;
}

export type GetProductRateList = (
  params: ParamsProductRate
) => Promise<ProductRateData>;

export type GetProductRatioList = (
  params: ParamsProductRate
) => Promise<ProductRatioData>;

// --- Response types untuk endpoint rates-ratios (rate-ratio/{branch_id}/descendants/rates-ratios) ---
export interface RatesRatiosRateSatuItem {
  month_end: number;
  pembiayaan_bulan_ini: number;
  unit_penjualan_bulan_ini: number;
  total_pembiayaan: number;
  total_unit_penjualan: number;
  pembiayaan_per_unit_penjualan: number;
  [key: string]: number; // average_pembiayaan_r1..r11, average_unit_penjualan_r1..r11
}

export interface RatesRatiosRateDuaItem {
  month_end: number;
  penjualan_bulan_ini: number;
  unit_penjualan_bulan_ini: number;
  total_penjualan: number;
  total_unit_penjualan: number;
  penjualan_per_unit_penjualan: number;
  [key: string]: number;
}

export interface RatesRatiosRateTigaItem {
  month_end: number;
  penjualan_bulan_ini: number;
  karyawan_bulan_ini: number;
  total_penjualan: number;
  total_karyawan: number;
  penjualan_per_karyawan: number;
  [key: string]: number;
}

export interface RatesRatiosRateEmpatItem {
  month_end: number;
  markup_bulan_ini: number;
  karyawan_bulan_ini: number;
  total_markup: number;
  total_karyawan: number;
  markup_per_karyawan: number;
  [key: string]: number;
}

export interface RatesRatiosLimaItem {
  month_end: number;
  gaji_bulan_ini: number;
  karyawan_bulan_ini: number;
  total_gaji: number;
  total_karyawan: number;
  gaji_per_karyawan: number;
  [key: string]: number;
}

export interface RatesRatiosEnamItem {
  month_end: number;
  operasional_bulan_ini: number;
  karyawan_bulan_ini: number;
  total_operasional: number;
  total_karyawan: number;
  operasional_per_karyawan: number;
  [key: string]: number;
}

export interface RatesRatiosTujuhItem {
  month_end: number;
  penyusutan_bulan_ini: number;
  karyawan_bulan_ini: number;
  total_penyusutan: number;
  total_karyawan: number;
  penyusutan_per_karyawan: number;
  [key: string]: number;
}

export interface RatesRatiosRateDelapanItem {
  month_end: number;
  penyusutan_bulan_ini: number;
  total_penyusutan: number;
  average_penyusutan_r1: number;
  average_satuan_kerja_r1: number;
  total_satuan_kerja: number;
  penyusutan_per_satuan_kerja: number;
  [key: string]: number;
}

export interface RatesRatiosRateSembilanItem {
  month_end: number;
  beban_gabungan_bulan_ini: number;
  total_beban_gabungan: number;
  average_beban_gabungan_r1: number;
  average_satuan_kerja_r1: number;
  total_satuan_kerja: number;
  beban_gabungan_per_satuan_kerja: number;
  [key: string]: number;
}

export interface RatesRatiosRateSepuluhItem {
  month_end: number;
  kumulatif_bulan_ini: number;
  total_kumulatif: number;
  average_kumulatif_r1: number;
  average_satuan_kerja_r1: number;
  total_satuan_kerja: number;
  kumulatif_per_satuan_kerja: number;
  [key: string]: number;
}

export interface RatesRatiosRateSebelasItem {
  month_end: number;
  kumulatif_bulan_ini: number;
  karyawan_bulan_ini: number;
  total_kumulatif: number;
  total_karyawan: number;
  kumulatif_per_karyawan: number;
  [key: string]: number;
}

/** Item untuk ratio_satu .. ratio_sebelas (month_end + field dinamis) */
export interface RatesRatiosRatioItem {
  month_end: number;
  [key: string]: number;
}

export interface RatesRatiosUnitItem {
  unit_id: number;
  unit_name: string;
  rate_satu: RatesRatiosRateSatuItem[];
  rate_dua: RatesRatiosRateDuaItem[];
  rate_tiga: RatesRatiosRateTigaItem[];
  rate_empat: RatesRatiosRateEmpatItem[];
  rate_lima: RatesRatiosLimaItem[];
  rate_enam: RatesRatiosEnamItem[];
  rate_tujuh: RatesRatiosTujuhItem[];
  rate_delapan: RatesRatiosRateDelapanItem[];
  rate_sembilan: RatesRatiosRateSembilanItem[];
  rate_sepuluh: RatesRatiosRateSepuluhItem[];
  rate_sebelas: RatesRatiosRateSebelasItem[];
  ratio_satu?: RatesRatiosRatioItem[];
  ratio_dua?: RatesRatiosRatioItem[];
  ratio_tiga?: RatesRatiosRatioItem[];
  ratio_empat?: RatesRatiosRatioItem[];
  ratio_lima?: RatesRatiosRatioItem[];
  ratio_enam?: RatesRatiosRatioItem[];
  ratio_tujuh?: RatesRatiosRatioItem[];
  ratio_delapan?: RatesRatiosRatioItem[];
  ratio_sembilan?: RatesRatiosRatioItem[];
  ratio_sepuluh?: RatesRatiosRatioItem[];
  ratio_sebelas?: RatesRatiosRatioItem[];
}

export interface ProductRatesRatiosData {
  success?: boolean;
  entity_id: number;
  entity_name: string;
  entity_type: string;
  year: number;
  selected_month: number;
  included_branch_ids: number[];
  unit_count: number;
  komentar?: string;
  rate_satu: RatesRatiosRateSatuItem[];
  rate_dua: RatesRatiosRateDuaItem[];
  rate_tiga: RatesRatiosRateTigaItem[];
  rate_empat: RatesRatiosRateEmpatItem[];
  rate_lima: RatesRatiosLimaItem[];
  rate_enam: RatesRatiosEnamItem[];
  rate_tujuh: RatesRatiosTujuhItem[];
  rate_delapan: RatesRatiosRateDelapanItem[];
  rate_sembilan: RatesRatiosRateSembilanItem[];
  rate_sepuluh: RatesRatiosRateSepuluhItem[];
  rate_sebelas: RatesRatiosRateSebelasItem[];
  ratio_satu?: RatesRatiosRatioItem[];
  ratio_dua?: RatesRatiosRatioItem[];
  ratio_tiga?: RatesRatiosRatioItem[];
  ratio_empat?: RatesRatiosRatioItem[];
  ratio_lima?: RatesRatiosRatioItem[];
  ratio_enam?: RatesRatiosRatioItem[];
  ratio_tujuh?: RatesRatiosRatioItem[];
  ratio_delapan?: RatesRatiosRatioItem[];
  ratio_sembilan?: RatesRatiosRatioItem[];
  ratio_sepuluh?: RatesRatiosRatioItem[];
  ratio_sebelas?: RatesRatiosRatioItem[];
  units: RatesRatiosUnitItem[];
}

export type GetProductRatesRatiosList = (
  params: ParamsProductRate
) => Promise<ProductRatesRatiosData>;
