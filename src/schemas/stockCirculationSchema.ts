import { z } from "zod"

export const stockCirculationSchema = z.object({
  unitAwal: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Unit Aawal tidak boleh negatif" }),
  unitAwalData: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Unit Awal Data Lancar tidak boleh negatif" }),
  pembelianTambahan: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Pembelian Tambahan tidak boleh negatif" }),
  pembelianTambahanData: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Pembelian Tambahan Data tidak boleh negatif" }),
  mutasiMasuk: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Mutasi Masuk tidak boleh negatif" }),
  mutasiKeluar: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Mutasi Keluar Lain tidak boleh negatif" }),
  terjual: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Terjual tidak boleh negatif" }),
  terjualData: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Terjual Data tidak boleh negatif" }),
  unitAkhir: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Unit Akhir tidak boleh negatif" }),
  unitAkhirData: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Unit Akhir Data tidak boleh negatif" }),
})

export type StockCirculationSchema = z.infer<typeof stockCirculationSchema>
