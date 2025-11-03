
import type { ResponseData } from "./response-data.type";

interface RateSatuDuaItem {
  type: string;
  year: number;
  month: number;
  total_pembiayaan: number;
  total_unit_jual: number;
  pembiayaan_per_unit: number;
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

interface RateLimaEnamTujuhItem {
  year: number;
  month: number;
  gaji: number;
  beban_umum_operasional: number;
  penyusutan_aktiva: number;
  jumlah_karyawan: number;
  rate_gaji_per_karyawan: number;
  rate_beban_umum_operasional_per_karyawan: number;
  rate_penyusutan_aktiva_per_karyawan: number;
}

export interface ProductRateData {
  success?: boolean;
  entity_id: string;
  entityIds: entityIds[];
  rate_satu_dua: {
    [unitName: string]: RateSatuDuaItem[];
  };
  rate_tiga: {
    [unitName: string]: RateTigaItem[];
  };
  rate_empat: {
    [unitName: string]: RateEmpatItem[];
  };
  rate_lima_enam_tujuh: {
    [unitName: string]: RateLimaEnamTujuhItem[];
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
