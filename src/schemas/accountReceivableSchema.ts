import { z } from "zod"

export const accountReceivableSchema = z.object({
  saldoAwal: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Saldo Awal tidak boleh negatif" }),
  tambahan: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Tambahan tidak boleh negatif" }),
  realisasiPokok: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Realisasi Pokok tidak boleh negatif" }),
  realisasiBunga: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Realisasi Bunga tidak boleh negatif" }),
  jumlahAngsuran: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Jumlah Angsuran Lain tidak boleh negatif" }),
  saldoAkhir: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Saldo Akhir Lain tidak boleh negatif" }),
})

export type AccountReceivableSchema = z.infer<typeof accountReceivableSchema>
