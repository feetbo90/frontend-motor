
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
  jumlah_karyawan: number;
  penjualan_per_karyawan: number;
}

interface RateEmpatItem {
  year: number;
  month: number;
  total_markup: number;
  jumlah_karyawan: number;
  rate_empat: number;
}

interface RateLimaItem {
  year: number;
  month: number;
  branch_id: string;
  gaji: number;
  jumlah_karyawan: number;
  rate_gaji_per_karyawan: number;
  type: string;
}
interface RateEnamItem {
  year: number;
  month: number;
  branch_id: string;
  type: string;
  jumlah_karyawan:number;
  rate_beban_umum_operasional_per_karyawan:number
}
interface RateTujuhItem {
  year: number;
  month: number;
  branch_id: string;
  type: string;
  jumlah_karyawan:number;
  penyusutan:number
  rate_penyusutan_aktiva_per_karyawan:number
}

export interface ProductRateData {
  success?: boolean;
  entity_id: string;
  entityIds: entityIds[];
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
  rate_enam:{
    [unitName: string]: RateEnamItem[];
  }
  rate_tujuh:{
    [unitName: string]: RateTujuhItem[];
  }
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
