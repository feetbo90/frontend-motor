
import type { ResponseData } from "./response-data.type";
export interface CashFlowPayload {
  branch_id: number,
  year: number,
  month: number,
  kas_tunai: number,
  rekening_bank: number,
  bon_karyawan: number,
  bon_pusat: number,
  bon_operasional: number,
  bon_gantung: number,
  jumlah_kas_lancar:number,
  jumlah_kas_macet:number,
  saldo_akhir:number,
}

export type CashFlowFrm = Omit<CashFlowPayload, "branch_id">;
export interface CashFlowData {
  id: string;
  branch_id: string;
  period_id: string;
  year: number;
  month: number;
  kas_tunai: number,
  rekening_bank: number,
  bon_karyawan: number,
  bon_pusat: number,
  bon_operasional: number,
  bon_gantung: number,
  jumlah_kas_lancar:number,
  jumlah_kas_macet:number,
  saldo_akhir:number,
  created_at: Date;
  updated_at: Date;
  version: string;
  is_active: boolean;
}
export interface ParamCashFlowList {
  branch_id: number | undefined;
  year?: number;
  month?: number;
  page?: number;
}

export type GetCashFlowList = (
  params: ParamCashFlowList
) => Promise<ResponseData<CashFlowData[]>>;

export type AddCashFlow = (
  payload: CashFlowPayload
) => Promise<ResponseData<CashFlowData>>;

export type UpdateCashFlow = (
  id: number,
  payload: CashFlowPayload
) => Promise<ResponseData<CashFlowData>>;

export type DeleteCashFlow = (
  id: number,
) => Promise<ResponseData<string>>;
