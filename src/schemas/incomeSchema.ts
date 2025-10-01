import { z } from "zod"

export const incomeSchema = z.object({
  markupKontan: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Markup Kontan tidak boleh negatif" }),
  markupKredit: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Markup Kredit tidak boleh negatif" }),
  markupJumlah: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Jumlah Markup tidak boleh negatif" }),
  realisasiBunga: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Realisasi Bunga tidak boleh negatif" }),
  diskonBunga: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Diskon Bunga tidak boleh negatif" }),
  denda: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Denda tidak boleh negatif" }),
  administrasi: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Administrasi tidak boleh negatif" }),
  jumlahPendapatan: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Jumlah Pendapatan tidak boleh negatif" }),
})

export type IncomeSchema = z.infer<typeof incomeSchema>
