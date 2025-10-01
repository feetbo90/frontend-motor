import { z } from "zod"

export const pkColleteralGoodsSchema = z.object({
  unitAwal: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Unit Aawal tidak boleh negatif" }),
  unitAwalData: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Unit Awal Data Lancar tidak boleh negatif" }),
  pkTambahan: z.number().refine(n => !isNaN(n) && n >= 0, { message: "PK Tambahan tidak boleh negatif" }),
  pkTambahanData: z.number().refine(n => !isNaN(n) && n >= 0, { message: "PK Tambahan Data tidak boleh negatif" }),
  terjual: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Terjual tidak boleh negatif" }),
  terjualData: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Terjual Data tidak boleh negatif" }),
  jumlahPk: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Jumlah PK tidak boleh negatif" }),
  jumlahPkData: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Jumlah PK Data tidak boleh negatif" }),
})

export type PkColleteralGoodsSchema = z.infer<typeof pkColleteralGoodsSchema>
