import type { ResponseData } from "./response-data.type";
export interface ResourcesPayload {
    branch_id: number,
    year: number,
    month: number,
    jumlah_karyawan: number,
    formasi_tenaga: number,
    pimpinan: number,
    kasir: number,
    administrasi: number,
    pdl: number,
    formasi_kurang: number,
    kontrak_kantor: number,
    inventaris_mobil: number,
    inventaris_mobil_ket: string;
    sisa_inventaris_pendirian: number,
    penyusutan_bulan: number,
}

export type ResourcesFrm = Omit<ResourcesPayload, "branch_id">;
export interface ResourcesData {
    id: string;
    branch_id: string;
    period_id: string;
    year: number;
    month: number;
    jumlah_karyawan: number,
    formasi_tenaga: number,
    pimpinan: number,
    kasir: number,
    administrasi: number,
    pdl: number,
    formasi_kurang: number,
    kontrak_kantor: number,
    inventaris_mobil: number,
    inventaris_mobil_ket: string,
    sisa_inventaris_pendirian: number,
    penyusutan_bulan: number,
    created_at: Date;
    updated_at: Date;
    version: string;
    is_active: boolean;
}
export interface ParamResourcesList {
    branch_id: number | undefined;
    year?: number;
    month?: number;
    page?: number;
}

export type GetResourcesList = (
    params: ParamResourcesList
) => Promise<ResponseData<ResourcesData[]>>;

export type AddResources = (
    payload: ResourcesPayload
) => Promise<ResponseData<ResourcesData>>;

export type UpdateResources = (
    id: number,
    payload: ResourcesPayload
) => Promise<ResponseData<ResourcesData>>;

export type DeleteResources = (
    id: number,
) => Promise<ResponseData<string>>;
