import { z } from "zod"

export const resourcesSchema = z.object({
  jumlahKaryawan: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Jumlah Karyawan tidak boleh negatif" }),
  formasiTenaga: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Formasi Tenaga tidak boleh negatif" }),
  pimpinan: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Pimpinan tidak boleh negatif" }),
  kasir: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Kasir tidak boleh negatif" }),
  administrasi: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Administrasi tidak boleh negatif" }),
  pdl: z.number().refine(n => !isNaN(n) && n >= 0, { message: "PDL tidak boleh negatif" }),
  formasiKurang: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Formasi Kurang tidak boleh negatif" }),
  kontrakKantor: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Kontrak Kantor tidak boleh negatif" }),
  inventarisMobil: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Inventaris Mobil tidak boleh negatif" }),
  inventarisMobilKet: z.string(),
  sisaInventarisPendirian: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Sisa Inventaris Pendirian tidak boleh negatif" }),
  penyusutanBulan: z.number().refine(n => !isNaN(n) && n >= 0, { message: "Penyusutan Bulan tidak boleh negatif" }),
})

export type ResourcesSchema = z.infer<typeof resourcesSchema>
