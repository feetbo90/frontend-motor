
import type { ResponseData } from "./response-data.type";
export interface ResidualValueReservePayload {
  branch_id: number,
  year: number,
  month: number,
  cadangan_piutang: number,
  macet_real: number,
  surplus_devist: number,
  cadangan_stock: number,
  cadangan_stock_data: number,
}

export type ResidualValueReserveFrm = Omit<ResidualValueReservePayload, "branch_id">;
export interface ResidualValueReserveData {
  id: string;
  branch_id: string;
  period_id: string;
  year: number;
  month: number;
  cadangan_piutang: number,
  macet_real: number,
  surplus_devist: number,
  cadangan_stock: number,
  cadangan_stock_data: number,
  created_at: Date;
  updated_at: Date;
  version: string;
  is_active: boolean;
}
export interface ParamResidualValueReserveList {
  branch_id: number | undefined;
  year?: number;
  month?: number;
  page?: number;
}

export type GetResidualValueReserveList = (
  params: ParamResidualValueReserveList
) => Promise<ResponseData<ResidualValueReserveData[]>>;

export type AddResidualValueReserve = (
  payload: ResidualValueReservePayload
) => Promise<ResponseData<ResidualValueReserveData>>;

export type UpdateResidualValueReserve = (
  id: number,
  payload: ResidualValueReservePayload
) => Promise<ResponseData<ResidualValueReserveData>>;

export type DeleteResidualValueReserve = (
  id: number,
) => Promise<ResponseData<string>>;
