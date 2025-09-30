import { z } from "zod"

export const accountReceivableTurnOverSchema = z.object({
  lancar: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Lancar tidak boleh negatif" }),
  kurangLancar: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Kurang Lancar tidak boleh negatif" }),
  raguRagu: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Ragu-ragu tidak boleh negatif" }),
  macetBaru: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Macet Baru tidak boleh negatif" }),
  macetLama: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Macet Lama Lain tidak boleh negatif" }),
  totalPiutang: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Total Piutang Lain tidak boleh negatif" }),
})

export type AccountReceivableTurnOverSchema = z.infer<typeof accountReceivableTurnOverSchema>
