import { z } from "zod"

export const loadComponentSchema = z.object({
  gaji: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Gaji tidak boleh negatif" }),
  admin: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Admin tidak boleh negatif" }),
  operasional: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Operasional tidak boleh negatif" }),
  bebanUmumOperasional: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Beban Umum Operasional tidak boleh negatif" }),
  penyusutanAktiva: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Penyusutan Aktiva Lain tidak boleh negatif" }),
  cadanganPiutang: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Cadangan Piutang Lain tidak boleh negatif" }),
  cadanganStock: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Cadangan Stock Lain tidak boleh negatif" }),
  total: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Total Lain tidak boleh negatif" }),
})

export type LoadComponentSchema = z.infer<typeof loadComponentSchema>
