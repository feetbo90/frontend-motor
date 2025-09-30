import type { ResponseData } from "./response-data.type";
export interface LoadComponentPayload {
  branch_id: number,
  year: number,
  month: number,
  gaji: number,
  admin: number,
  operasional: number,
  beban_umum_operasional: number,
  penyusutan_aktiva: number,
  cadangan_piutang: number,
  cadangan_stock: number,
  total: number,
}

export type LoadComponentFrm = Omit<LoadComponentPayload, "branch_id">;
export interface LoadComponentData {
  id: string;
  branch_id: string;
  period_id: string;
  year: number;
  month: number;
  gaji: number,
  admin: number,
  operasional: number,
  beban_umum_operasional: number,
  penyusutan_aktiva: number,
  cadangan_piutang: number,
  cadangan_stock: number,
  total: number,
  created_at: Date;
  updated_at: Date;
  version: string;
  is_active: boolean;
}
export interface ParamLoadComponentList {
  branch_id: number | undefined;
  year?: number;
  month?: number;
  page?: number;
}

export type GetLoadComponentList = (
  params: ParamLoadComponentList
) => Promise<ResponseData<LoadComponentData[]>>;

export type AddLoadComponent = (
  payload: LoadComponentPayload
) => Promise<ResponseData<LoadComponentData>>;

export type UpdateLoadComponent = (
  id: number,
  payload: LoadComponentPayload
) => Promise<ResponseData<LoadComponentData>>;

export type DeleteLoadComponent = (
  id: number,
) => Promise<ResponseData<string>>;
