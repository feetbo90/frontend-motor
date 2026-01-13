
import type { ResponseData } from "./response-data.type";

interface RateSatuItem {
  type: string;
  year: number;
  month: number;
  total_pembiayaan: number;
  total_unit_jual: number;
  pembiayaan_per_unit: number;
}

interface RateDuaItem {
  year: number;
  month: number;
  type: string;
  total_penjualan: number;
  total_unit: number;
  penjualan_per_unit: number;
}
interface RateTigaItem {
  year: number;
  month: number;
  total_penjualan: number;
  jumlah_karyawan?: number;
  total_karyawan?: number;
  penjualan_per_karyawan: number;
  type?: string;
}

interface RateEmpatItem {
  year: number;
  month: number;
  total_markup: number;
  jumlah_karyawan?: number | string;
  total_karyawan?: number;
  rate_empat?: number;
  markup_per_karyawan?: number;
}

interface RateLimaItem {
  year: number;
  month: number;
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
  month: number;
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
  month: number;
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
  month: number;
  total_penyusutan_aktiva: number;
  total_unit: number;
  rate_penyusutan_aktiva_per_unit: number;
}

interface RateSembilanItem {
  type: string;
  year: number;
  month: number;
  total_penyusutan_aktiva: number;
  total_cadangan_piutang: number;
  total_cadangan_stock: number;
  total_unit: number;
  rate_penyusutan_dan_cadangan_per_unit: number;
}

interface RateSepuluhItem {
  type: string;
  year: number;
  month: number;
  total_kumulatif: number;
  total_unit: number;
  kumulatif_per_unit: number;
}

interface RateSebelasItem {
  type: string;
  year: number;
  month: number;
  total_kumulatif: number;
  total_karyawan: number;
  kumulatif_per_karyawan: number;
}

interface CabangData {
  name: string;
  rate_satu: RateSatuItem[];
  rate_dua: RateDuaItem[];
  rate_tiga: RateTigaItem[];
  rate_empat: RateEmpatItem[];
  rate_lima: RateLimaItem[];
  rate_enam: RateEnamItem[];
  rate_tujuh: RateTujuhItem[];
  rate_delapan?: RateDelapanItem[];
  rate_sembilan?: RateSembilanItem[];
  rate_sepuluh?: RateSepuluhItem[];
  rate_sebelas?: RateSebelasItem[];
}
export interface ProductRateData {
  success?: boolean;
  entity_id: string;
  entityIds: entityIds[];
  cabang?: CabangData;
  rate_satu: {
    [unitName: string]: RateSatuItem[];
  };
  rate_dua: {
    [unitName: string]: RateDuaItem[];
  };
  rate_tiga: {
    [unitName: string]: RateTigaItem[];
  };
  rate_empat: {
    [unitName: string]: RateEmpatItem[];
  };
  rate_lima: {
    [unitName: string]: RateLimaItem[];
  };
  rate_enam: {
    [unitName: string]: RateEnamItem[];
  };
  rate_tujuh: {
    [unitName: string]: RateTujuhItem[];
  };
  rate_delapan?: {
    [unitName: string]: RateDelapanItem[];
  };
  rate_sembilan?: {
    [unitName: string]: RateSembilanItem[];
  };
  rate_sepuluh?: {
    [unitName: string]: RateSepuluhItem[];
  };
  rate_sebelas?: {
    [unitName: string]: RateSebelasItem[];
  };
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
}

export type GetProductRateList = (
  params: ParamsProductRate
) => Promise<ProductRateData>;

export type GetProductRatioList = (
  params: ParamsProductRate
) => Promise<ProductRatioData>;
