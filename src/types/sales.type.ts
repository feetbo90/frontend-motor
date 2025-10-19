export interface SalesData {
  tahun: number
  bulan: number
  kontan: number
  kredit: number
  leasing: number,
  unit_jualkontan:number;
  unit_jualkredit:number;
  unit_jualleasing:number;
}
export interface SalesPayload {
  branch_id: number,
  year: number,
  month: number,
  kontan: number,
  kredit: number,
  leasing: number,
  unit_jualkontan:number;
  unit_jualkredit:number;
  unit_jualleasing:number;
  jumlah: number
  period_id?: number//TODO: delete nanti dihapus dari BE
}
export interface SalesResponse {
  id: number;
  branch_id: string;
  period_id: string;
  kontan: number;
  kredit: number;
  leasing: number;
  jumlah: number;
  unit_jualkontan:number;
  unit_jualkredit:number;
  unit_jualleasing:number;
  created_at: string;
  updated_at: string;
  year: number | null;
  month: number | null;
  version: number;
  is_active: boolean;
}
export interface DeleteSalesResponse {
  message: string
}
export interface SalesListResponse {
  message: string;
  period_id: string | null;
  data: SalesResponse[];
  total: number;
  totalPages: number;
  currentPage: number;
}