
import type { ResponseData } from "./response-data.type";
export interface AccountReceivableTurnOverPayload {
  branch_id: number,
  year: number,
  month: number,
  lancar: number,
  kurang_lancar: number,
  ragu_ragu: number,
  macet_baru: number,
  macet_lama: number,
  total_piutang: number,
}

export type AccountReceivableTurnOverFrm = Omit<AccountReceivableTurnOverPayload, "branch_id">;
export interface AccountReceivableTurnOverData {
  id: string;
  branch_id: string;
  period_id: string;
  year: number;
  month: number;
  lancar: number,
  kurang_lancar: number,
  ragu_ragu: number,
  macet_baru: number,
  macet_lama: number,
  total_piutang: number,
  created_at: Date;
  updated_at: Date;
  version: string;
  is_active: boolean;
}
export interface ParamAccountReceivableTurnOverList {
  branch_id: number | undefined;
  year?: number;
  month?: number;
  page?: number;
}

export type GetAccountReceivableTurnOverList = (
  params: ParamAccountReceivableTurnOverList
) => Promise<ResponseData<AccountReceivableTurnOverData[]>>;

export type AddAccountReceivableTurnOver = (
  payload: AccountReceivableTurnOverPayload
) => Promise<ResponseData<AccountReceivableTurnOverData>>;

export type UpdateAccountReceivableTurnOver = (
  id: number,
  payload: AccountReceivableTurnOverPayload
) => Promise<ResponseData<AccountReceivableTurnOverData>>;

export type DeleteAccountReceivableTurnOver = (
  id: number,
) => Promise<ResponseData<string>>;
