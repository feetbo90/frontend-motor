import { z } from "zod"

export const salesSchema = z.object({
  kontan: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Kontan tidak boleh negatif" }),
  unit_jualkontan: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Unit Jual Kontan tidak boleh negatif" }),
  unit_jualkredit: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Unit Jual Kredit tidak boleh negatif" }),
  unit_jualleasing: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Unit Jual Leasing tidak boleh negatif" }),
  kredit: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Kredit tidak boleh negatif" }),
  leasing: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Leasing tidak boleh negatif" })
})

export type SalesSchema = z.infer<typeof salesSchema>
