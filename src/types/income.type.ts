import type { ResponseData } from "./response-data.type";
export interface IncomePayload {
  branch_id: number,
  year: number,
  month: number,
  markup_kontan: number;
  markup_kredit: number;
  markup_jumlah: number;
  realisasi_bunga: number;
  diskon_bunga: number;
  denda: number;
  administrasi: number;
  jumlah_pendapatan: number;
}

export type IncomeFrm = Omit<IncomePayload, "branch_id">;
export interface IncomeData {
  id: string;
  branch_id: string;
  period_id: string;
  year: number;
  month: number;
  markup_kontan: string;
  markup_kredit: string;
  markup_jumlah: string;
  realisasi_bunga: string;
  diskon_bunga: string;
  denda: string;
  administrasi: string;
  jumlah_pendapatan: string;
  created_at: Date;
  updated_at: Date;
  version: string;
  is_active: boolean;
}
export interface ParamIncomeList {
  branch_id: number | undefined;
  year?: number;
  month?: number;
  page?: number;
}

export type GetIncomeList = (
  params: ParamIncomeList
) => Promise<ResponseData<IncomeData[]>>;

export type AddIncome = (
  payload: IncomePayload
) => Promise<ResponseData<IncomeData>>;

export type UpdateIncome = (
  id: number,
  payload: IncomePayload
) => Promise<ResponseData<IncomeData>>;
