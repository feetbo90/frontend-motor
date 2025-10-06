
export interface ParamsExport {
  type?: string;
  year?: number;
  month?: number;
}

type ExportResullt = {
  barangPk: unknown
  beban: unknown
  pendapatan: unknown
  pendapatanLain: unknown
  penjualan: unknown
  piutang: unknown
  sirkulasiPiutang: unknown
  sirkulasiStock: unknown
  sumberDaya: unknown
}
export type ExportResponse = {
  message: string
  result: ExportResullt

}
export type GetExport = (
  params: ParamsExport
) => Promise<ExportResullt>;

export type PostImport = (
  file: File
) => Promise<ExportResponse>;
