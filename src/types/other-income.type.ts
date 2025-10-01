
import type { ResponseData } from "./response-data.type";
export interface OtherIncomePayload {
  branch_id: number,
  year: number,
  month: number,
  penjualan_pk: number;
  komisi: number;
  denda_keterlambatan: number;
  diskon_denda: number;
  jumlah_pendapatan_lain: number;
}

export type OtherIncomeFrm = Omit<OtherIncomePayload, "branch_id">;
export interface OtherIncomeData {
  id: string;
  branch_id: string;
  period_id: string;
  year: number;
  month: number;
  penjualan_pk: number;
  komisi: number;
  denda_keterlambatan: number;
  diskon_denda: number;
  jumlah_pendapatan_lain: number;
  created_at: Date;
  updated_at: Date;
  version: string;
  is_active: boolean;
}
export interface ParamOtherIncomeList {
  branch_id: number | undefined;
  year?: number;
  month?: number;
  page?: number;
}

export type GetOtherIncomeList = (
  params: ParamOtherIncomeList
) => Promise<ResponseData<OtherIncomeData[]>>;

export type AddOtherIncome = (
  payload: OtherIncomePayload
) => Promise<ResponseData<OtherIncomeData>>;

export type UpdateOtherIncome = (
  id: number,
  payload: OtherIncomePayload
) => Promise<ResponseData<OtherIncomeData>>;

export type DeleteOtherIncome = (
  id: number,
) => Promise<ResponseData<string>>;
