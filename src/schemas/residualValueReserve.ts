import { z } from "zod"

export const residualValueReserveSchema = z.object({
  cadanganPiutang: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Cadangan Piutang tidak boleh negatif" }),
  macetReal: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Macet Real tidak boleh negatif" }),
  surplusDevist: z.number().refine(n => !isNaN(n), { message: "Surplus Devisit harus berupa angka" }),
  cadanganStock: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Cadangan Stock tidak boleh negatif" }),
  //cadanganStockData: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Cadangan Stock Data tidak boleh negatif" }),
  //totalReserves: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Total Reserves tidak boleh negatif" }),
})

export type ResidualValueReserveSchema = z.infer<typeof residualValueReserveSchema>
