import type { ResponseData } from "./response-data.type";
export interface AccountReceivablePayload {
  branch_id: number,
  year: number,
  month: number,
  saldo_awal: number;
  tambahan: number;
  realisasi_pokok: number;
  realisasi_bunga: number;
  jumlah_angsuran: number;
  saldo_akhir: number;
}

export type AccountReceivableFrm = Omit<AccountReceivablePayload, "branch_id">;
export interface AccountReceivableData {
  id: string;
  branch_id: string;
  period_id: string;
  year: number;
  month: number;
  saldo_awal: number;
  tambahan: number;
  realisasi_pokok: number;
  realisasi_bunga: number;
  jumlah_angsuran: number;
  saldo_akhir: number;
  created_at: Date;
  updated_at: Date;
  version: string;
  is_active: boolean;
}
export interface ParamAccountReceivableList {
  branch_id: number | undefined;
  year?: number;
  month?: number;
  page?: number;
}

export type GetAccountReceivableList = (
  params: ParamAccountReceivableList
) => Promise<ResponseData<AccountReceivableData[]>>;

export type AddAccountReceivable = (
  payload: AccountReceivablePayload
) => Promise<ResponseData<AccountReceivableData>>;

export type UpdateAccountReceivable = (
  id: number,
  payload: AccountReceivablePayload
) => Promise<ResponseData<AccountReceivableData>>;

export type DeleteAccountReceivable = (
  id: number,
) => Promise<ResponseData<string>>;
