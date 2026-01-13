import { z } from "zod"

export const profitLostSchema = z.object({
  kumulatif: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Kumulatif tidak boleh negatif" }),
  penarikan: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Penarikan tidak boleh negatif" }),
  modal: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Modal tidak boleh negatif" }),
  bulanIni: z.number().refine(n => !isNaN(n), { message: "Laba Rugi Bulan ini harus berupa angka" }),
})

export type ProfitLostSchema = z.infer<typeof profitLostSchema>
