import { z } from "zod"

export const salesSchema = z.object({
  kontan: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Kontan tidak boleh negatif" }),
  kredit: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Kredit tidak boleh negatif" }),
  leasing: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Leasing tidak boleh negatif" })
})

export type SalesSchema = z.infer<typeof salesSchema>
