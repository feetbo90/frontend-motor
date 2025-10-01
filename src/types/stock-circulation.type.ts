
import type { ResponseData } from "./response-data.type";
export interface StockCirculationPayload {
  branch_id: number,
  year: number,
  month: number,
  unit_awal: number,
  unit_awal_data: number,
  pembelian_tambahan: number,
  pembelian_tambahan_data: number,
  mutasi_masuk: number,
  mutasi_keluar: number,
  terjual: number,
  terjual_data: number,
  unit_akhir: number,
  unit_akhir_data: number,
}

export type StockCirculationFrm = Omit<StockCirculationPayload, "branch_id">;
export interface StockCirculationData {
  id: string;
  branch_id: string;
  period_id: string;
  year: number;
  month: number;
  unit_awal: number,
  unit_awal_data: number,
  pembelian_tambahan: number,
  pembelian_tambahan_data: number,
  mutasi_masuk: number,
  mutasi_keluar: number,
  terjual: number,
  terjual_data: number,
  unit_akhir: number,
  unit_akhir_data: number,
  created_at: Date;
  updated_at: Date;
  version: string;
  is_active: boolean;
}
export interface ParamStockCirculationList {
  branch_id: number | undefined;
  year?: number;
  month?: number;
  page?: number;
}

export type GetStockCirculationList = (
  params: ParamStockCirculationList
) => Promise<ResponseData<StockCirculationData[]>>;

export type AddStockCirculation = (
  payload: StockCirculationPayload
) => Promise<ResponseData<StockCirculationData>>;

export type UpdateStockCirculation = (
  id: number,
  payload: StockCirculationPayload
) => Promise<ResponseData<StockCirculationData>>;

export type DeleteStockCirculation = (
  id: number,
) => Promise<ResponseData<string>>;
