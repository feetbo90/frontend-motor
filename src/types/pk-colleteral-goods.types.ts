

import type { ResponseData } from "./response-data.type";
export interface PkColleteralGoodsPayload {
  branch_id: number,
  year: number,
  month: number,
  unit_awal: number,
  unit_awal_data: number,
  pk_tambahan: number,
  pk_tambahan_data: number,
  terjual: number,
  terjual_data: number,
  jumlah_pk: number,
  jumlah_pk_data: number,
}

export type PkColleteralGoodsFrm = Omit<PkColleteralGoodsPayload, "branch_id">;
export interface PkColleteralGoodsData {
  id: string;
  branch_id: string;
  period_id: string;
  year: number;
  month: number;
  unit_awal: number,
  unit_awal_data: number,
  pk_tambahan: number,
  pk_tambahan_data: number,
  terjual: number,
  terjual_data: number,
  jumlah_pk: number,
  jumlah_pk_data: number,
  created_at: Date;
  updated_at: Date;
  version: string;
  is_active: boolean;
}
export interface ParamPkColleteralGoodsList {
  branch_id: number | undefined;
  year?: number;
  month?: number;
  page?: number;
}

export type GetPkColleteralGoodsList = (
  params: ParamPkColleteralGoodsList
) => Promise<ResponseData<PkColleteralGoodsData[]>>;

export type AddPkColleteralGoods = (
  payload: PkColleteralGoodsPayload
) => Promise<ResponseData<PkColleteralGoodsData>>;

export type UpdatePkColleteralGoods = (
  id: number,
  payload: PkColleteralGoodsPayload
) => Promise<ResponseData<PkColleteralGoodsData>>;

export type DeletePkColleteralGoods = (
  id: number,
) => Promise<ResponseData<string>>;
