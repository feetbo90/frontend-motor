import { z } from "zod"

export const cashFlowSchema = z.object({
  kasTunai: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Kas Tunai tidak boleh negatif" }),
  rekeningBank: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Rekening Bank tidak boleh negatif" }),
  bonKaryawan: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Bon Karyawan tidak boleh negatif" }),
  bonPusat: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Bon Pusat tidak boleh negatif" }),
  bonOperasional: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Bon Operasional tidak boleh negatif" }),
  bonGantung: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Bon Gantung tidak boleh negatif" }),
  jumlahKasLancar: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Jumlah Kas Lancar tidak boleh negatif" }),
  jumlahKasMacet: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Jumlah Kas Macet tidak boleh negatif" }),
  saldoAkhir: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Saldo Akhir tidak boleh negatif" }),
})

export type CashFlowSchema = z.infer<typeof cashFlowSchema>
