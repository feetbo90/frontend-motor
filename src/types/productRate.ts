
import type { ResponseData } from "./response-data.type";

interface RateSatuDuaItem {
  type: string;
  year: number;
  month: number;
  total_pembiayaan: string;
  total_unit_jual: string;
  pembiayaan_per_unit: number;
  total_penjualan: string;
  total_unit: string;
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

interface ProductRateData {
  entity_id: string;
  entityIds: {
    id: string;
    type: string;
    name: string;
  }[];
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


export interface ParamsProductRate {
  branch_id: number | undefined;
  year?: number | undefined;
  month?: number| undefined;
}

export type GetProductRateList = (
  params: ParamsProductRate
) => Promise<ResponseData<ProductRateData[]>>;
