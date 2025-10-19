
import type { ResponseData } from "./response-data.type";
export interface ProfitLostPayload {
  branch_id: number,
  year: number,
  month: number,
  kumulatif: number,
  penarikan: number,
  modal: number,
  bulan_ini: number,
}

export type ProfitLostFrm = Omit<ProfitLostPayload, "branch_id">;
export interface ProfitLostData {
  id: string;
  branch_id: string;
  period_id: string;
  year: number;
  month: number;
  kumulatif: number,
  penarikan: number,
  bulan_ini: number,
  modal: number,
  created_at: Date;
  updated_at: Date;
  version: string;
  is_active: boolean;
}
export interface ParamProfitLostList {
  branch_id: number | undefined;
  year?: number;
  month?: number;
  page?: number;
}

export type GetProfitLostList = (
  params: ParamProfitLostList
) => Promise<ResponseData<ProfitLostData[]>>;

export type AddProfitLost = (
  payload: ProfitLostPayload
) => Promise<ResponseData<ProfitLostData>>;

export type UpdateProfitLost = (
  id: number,
  payload: ProfitLostPayload
) => Promise<ResponseData<ProfitLostData>>;

export type DeleteProfitLost = (
  id: number,
) => Promise<ResponseData<string>>;
