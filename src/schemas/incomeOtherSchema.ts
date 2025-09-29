import { z } from "zod"

export const otherIncomeSchema = z.object({
  penjualanPk: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Penjualan PK tidak boleh negatif" }),
  komisi: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Komisi tidak boleh negatif" }),
  dendaKeterlambatan: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Denda Keterlambatan tidak boleh negatif" }),
  diskonDenda: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Diskon Denda tidak boleh negatif" }),
  jumlahPendapatanLain: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Jumlah Pendapatan Lain tidak boleh negatif" }),
})

export type OtherIncomeSchema = z.infer<typeof otherIncomeSchema>
