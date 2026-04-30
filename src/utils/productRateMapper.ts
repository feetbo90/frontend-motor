import type {
  ProductRateData,
  ProductRatesRatiosData,
  ProductRatesRatiosPusatData,
  ProductRatesRatiosPusatRatesBlock,
  ProductRatesRatiosPusatRatiosBlock,
  RatesRatiosRatioItem,
  RatesRatiosUnitItem,
} from "@/types/productRate";

function mergePusatNestedToUnitItem(
  unit_id: number,
  unit_name: string,
  rate: ProductRatesRatiosPusatRatesBlock,
  ratio: ProductRatesRatiosPusatRatiosBlock
): RatesRatiosUnitItem {
  return {
    unit_id,
    unit_name,
    rate_satu: rate.rate_satu,
    rate_dua: rate.rate_dua,
    rate_tiga: rate.rate_tiga,
    rate_empat: rate.rate_empat,
    rate_lima: rate.rate_lima,
    rate_enam: rate.rate_enam,
    rate_tujuh: rate.rate_tujuh,
    rate_delapan: rate.rate_delapan ?? [],
    rate_sembilan: rate.rate_sembilan ?? [],
    rate_sepuluh: rate.rate_sepuluh ?? [],
    rate_sebelas: rate.rate_sebelas ?? [],
    ratio_satu: ratio.ratio_satu ?? [],
    ratio_dua: ratio.ratio_dua ?? [],
    ratio_tiga: ratio.ratio_tiga ?? [],
    ratio_empat: ratio.ratio_empat ?? [],
    ratio_lima: ratio.ratio_lima ?? [],
    ratio_enam: ratio.ratio_enam ?? [],
    ratio_tujuh: ratio.ratio_tujuh ?? [],
    ratio_delapan: ratio.ratio_delapan ?? [],
    ratio_sembilan: ratio.ratio_sembilan ?? [],
    ratio_sepuluh: ratio.ratio_sepuluh ?? [],
    ratio_sebelas: ratio.ratio_sebelas ?? [],
  };
}

/** Response center/rates-ratios punya pusat_name + cabangs + rate/ratio bersarang. */
export function isPusatRatesRatiosResponse(
  res: unknown
): res is ProductRatesRatiosPusatData {
  if (!res || typeof res !== "object") return false;
  const o = res as Record<string, unknown>;
  return (
    typeof o.pusat_name === "string" &&
    Array.isArray(o.cabangs) &&
    o.rate != null &&
    typeof o.rate === "object" &&
    o.ratio != null &&
    typeof o.ratio === "object"
  );
}

/**
 * Normalisasi response PUSAT ke bentuk ProductRatesRatiosData
 * agar getRatesForEntity / getMonthlyValueByKey tetap dipakai.
 */
export function normalizePusatRatesRatiosResponse(
  res: ProductRatesRatiosPusatData
): ProductRatesRatiosData {
  const pusatId = res.included_pusat_ids?.[0] ?? 0;
  const cabangUnits: RatesRatiosUnitItem[] = (res.cabangs ?? []).map((c) =>
    mergePusatNestedToUnitItem(c.cabang_id, c.cabang_name, c.rate, c.ratio)
  );
  const leafUnits: RatesRatiosUnitItem[] = (res.units ?? []).map((u) =>
    mergePusatNestedToUnitItem(u.unit_id, u.unit_name, u.rate, u.ratio)
  );

  return {
    success: res.success,
    entity_id: pusatId,
    entity_name: res.pusat_name,
    entity_type: res.pusat_type,
    year: res.year,
    selected_month: res.selected_month,
    included_branch_ids: res.included_cabang_ids ?? [],
    unit_count: res.unit_count,
    komentar: res.komentar,
    rate_satu: res.rate.rate_satu,
    rate_dua: res.rate.rate_dua,
    rate_tiga: res.rate.rate_tiga,
    rate_empat: res.rate.rate_empat,
    rate_lima: res.rate.rate_lima,
    rate_enam: res.rate.rate_enam,
    rate_tujuh: res.rate.rate_tujuh,
    rate_delapan: res.rate.rate_delapan ?? [],
    rate_sembilan: res.rate.rate_sembilan ?? [],
    rate_sepuluh: res.rate.rate_sepuluh ?? [],
    rate_sebelas: res.rate.rate_sebelas ?? [],
    ratio_satu: res.ratio.ratio_satu,
    ratio_dua: res.ratio.ratio_dua,
    ratio_tiga: res.ratio.ratio_tiga,
    ratio_empat: res.ratio.ratio_empat,
    ratio_lima: res.ratio.ratio_lima,
    ratio_enam: res.ratio.ratio_enam,
    ratio_tujuh: res.ratio.ratio_tujuh,
    ratio_delapan: res.ratio.ratio_delapan,
    ratio_sembilan: res.ratio.ratio_sembilan,
    ratio_sepuluh: res.ratio.ratio_sepuluh,
    ratio_sebelas: res.ratio.ratio_sebelas,
    units: [...cabangUnits, ...leafUnits],
  };
}

/**
 * Map response PUSAT ke ProductRateData: entityIds = Pusat → cabang → unit;
 * rate/ratio per nama entitas.
 */
export function mapPusatRatesRatiosToProductRateData(
  res: ProductRatesRatiosPusatData
): ProductRateData {
  const cabangs = res.cabangs ?? [];
  const units = res.units ?? [];
  const entityIds = [
    {
      id: String(res.included_pusat_ids?.[0] ?? ""),
      type: res.pusat_type,
      name: res.pusat_name,
    },
    ...cabangs.map((c) => ({
      id: String(c.cabang_id),
      type: c.cabang_type,
      name: c.cabang_name,
    })),
    ...units.map((u) => ({
      id: String(u.unit_id),
      type: "UNIT" as const,
      name: u.unit_name,
    })),
  ];

  const rate_satu: ProductRateData["rate_satu"] = {};
  const rate_dua: ProductRateData["rate_dua"] = {};
  const rate_tiga: ProductRateData["rate_tiga"] = {};
  const rate_empat: ProductRateData["rate_empat"] = {};
  const rate_lima: ProductRateData["rate_lima"] = {};
  const rate_enam: ProductRateData["rate_enam"] = {};
  const rate_tujuh: ProductRateData["rate_tujuh"] = {};
  const rate_delapan: NonNullable<ProductRateData["rate_delapan"]> = {};
  const rate_sembilan: NonNullable<ProductRateData["rate_sembilan"]> = {};
  const rate_sepuluh: NonNullable<ProductRateData["rate_sepuluh"]> = {};
  const rate_sebelas: NonNullable<ProductRateData["rate_sebelas"]> = {};

  type RatioMap = { [unitName: string]: RatesRatiosRatioItem[] };
  const ratio_satu: RatioMap = {};
  const ratio_dua: RatioMap = {};
  const ratio_tiga: RatioMap = {};
  const ratio_empat: RatioMap = {};
  const ratio_lima: RatioMap = {};
  const ratio_enam: RatioMap = {};
  const ratio_tujuh: RatioMap = {};
  const ratio_delapan: RatioMap = {};
  const ratio_sembilan: RatioMap = {};
  const ratio_sepuluh: RatioMap = {};
  const ratio_sebelas: RatioMap = {};

  const assignFromNested = (
    name: string,
    rate: ProductRatesRatiosPusatRatesBlock,
    ratio: ProductRatesRatiosPusatRatiosBlock
  ) => {
    rate_satu[name] = rate.rate_satu;
    rate_dua[name] = rate.rate_dua;
    rate_tiga[name] = rate.rate_tiga;
    rate_empat[name] = rate.rate_empat;
    rate_lima[name] = rate.rate_lima;
    rate_enam[name] = rate.rate_enam;
    rate_tujuh[name] = rate.rate_tujuh;
    rate_delapan[name] = rate.rate_delapan ?? [];
    rate_sembilan[name] = rate.rate_sembilan ?? [];
    rate_sepuluh[name] = rate.rate_sepuluh ?? [];
    rate_sebelas[name] = rate.rate_sebelas ?? [];
    ratio_satu[name] = ratio.ratio_satu ?? [];
    ratio_dua[name] = ratio.ratio_dua ?? [];
    ratio_tiga[name] = ratio.ratio_tiga ?? [];
    ratio_empat[name] = ratio.ratio_empat ?? [];
    ratio_lima[name] = ratio.ratio_lima ?? [];
    ratio_enam[name] = ratio.ratio_enam ?? [];
    ratio_tujuh[name] = ratio.ratio_tujuh ?? [];
    ratio_delapan[name] = ratio.ratio_delapan ?? [];
    ratio_sembilan[name] = ratio.ratio_sembilan ?? [];
    ratio_sepuluh[name] = ratio.ratio_sepuluh ?? [];
    ratio_sebelas[name] = ratio.ratio_sebelas ?? [];
  };

  assignFromNested(res.pusat_name, res.rate, res.ratio);
  cabangs.forEach((c) => assignFromNested(c.cabang_name, c.rate, c.ratio));
  units.forEach((u) => assignFromNested(u.unit_name, u.rate, u.ratio));

  return {
    success: res.success,
    entity_id: String(res.included_pusat_ids?.[0] ?? ""),
    entityIds,
    rate_satu,
    rate_dua,
    rate_tiga,
    rate_empat,
    rate_lima,
    rate_enam,
    rate_tujuh,
    rate_delapan,
    rate_sembilan,
    rate_sepuluh,
    rate_sebelas,
    ratio_satu,
    ratio_dua,
    ratio_tiga,
    ratio_empat,
    ratio_lima,
    ratio_enam,
    ratio_tujuh,
    ratio_delapan,
    ratio_sembilan,
    ratio_sepuluh,
    ratio_sebelas,
  };
}

/**
 * Transform response endpoint rates-ratios ke bentuk ProductRateData
 * agar komponen yang pakai entityIds / rate_* per unit name tetap jalan.
 */
export function mapRatesRatiosToProductRateData(
  res: ProductRatesRatiosData
): ProductRateData {
  const entityType = res.entity_type;
  const units = res.units ?? [];
  const rootEntityType =
    entityType === "CABANG" ? "CABANG" : entityType === "PUSAT" ? "PUSAT" : "UNIT";
  const entityIds =
    units.length > 0
      ? [
          { id: String(res.entity_id), type: rootEntityType, name: res.entity_name },
          ...units.map((u) => ({
            id: String(u.unit_id),
            type: "UNIT" as const,
            name: u.unit_name,
          })),
        ]
      : [
          {
            id: String(res.entity_id),
            type: rootEntityType,
            name: res.entity_name,
          },
        ];

  // Bentuk data = response API (array per entity), tanpa transform
  const rate_satu: ProductRateData["rate_satu"] = {};
  const rate_dua: ProductRateData["rate_dua"] = {};
  const rate_tiga: ProductRateData["rate_tiga"] = {};
  const rate_empat: ProductRateData["rate_empat"] = {};
  const rate_lima: ProductRateData["rate_lima"] = {};
  const rate_enam: ProductRateData["rate_enam"] = {};
  const rate_tujuh: ProductRateData["rate_tujuh"] = {};
  const rate_delapan: NonNullable<ProductRateData["rate_delapan"]> = {};
  const rate_sembilan: NonNullable<ProductRateData["rate_sembilan"]> = {};
  const rate_sepuluh: NonNullable<ProductRateData["rate_sepuluh"]> = {};
  const rate_sebelas: NonNullable<ProductRateData["rate_sebelas"]> = {};

  type RatioMap = { [unitName: string]: RatesRatiosRatioItem[] };
  const ratio_satu: RatioMap = {};
  const ratio_dua: RatioMap = {};
  const ratio_tiga: RatioMap = {};
  const ratio_empat: RatioMap = {};
  const ratio_lima: RatioMap = {};
  const ratio_enam: RatioMap = {};
  const ratio_tujuh: RatioMap = {};
  const ratio_delapan: RatioMap = {};
  const ratio_sembilan: RatioMap = {};
  const ratio_sepuluh: RatioMap = {};
  const ratio_sebelas: RatioMap = {};

  // Data di root (res.rate_satu, ...) = punya cabang/entity — simpan langsung dari response
  rate_satu[res.entity_name] = res.rate_satu;
  rate_dua[res.entity_name] = res.rate_dua;
  rate_tiga[res.entity_name] = res.rate_tiga;
  rate_empat[res.entity_name] = res.rate_empat;
  rate_lima[res.entity_name] = res.rate_lima;
  rate_enam[res.entity_name] = res.rate_enam;
  rate_tujuh[res.entity_name] = res.rate_tujuh;
  rate_delapan[res.entity_name] = res.rate_delapan ?? [];
  rate_sembilan[res.entity_name] = res.rate_sembilan ?? [];
  rate_sepuluh[res.entity_name] = res.rate_sepuluh ?? [];
  rate_sebelas[res.entity_name] = res.rate_sebelas ?? [];

  ratio_satu[res.entity_name] = res.ratio_satu ?? [];
  ratio_dua[res.entity_name] = res.ratio_dua ?? [];
  ratio_tiga[res.entity_name] = res.ratio_tiga ?? [];
  ratio_empat[res.entity_name] = res.ratio_empat ?? [];
  ratio_lima[res.entity_name] = res.ratio_lima ?? [];
  ratio_enam[res.entity_name] = res.ratio_enam ?? [];
  ratio_tujuh[res.entity_name] = res.ratio_tujuh ?? [];
  ratio_delapan[res.entity_name] = res.ratio_delapan ?? [];
  ratio_sembilan[res.entity_name] = res.ratio_sembilan ?? [];
  ratio_sepuluh[res.entity_name] = res.ratio_sepuluh ?? [];
  ratio_sebelas[res.entity_name] = res.ratio_sebelas ?? [];

  // Data di dalam units = punya masing-masing unit — simpan langsung dari response
  units.forEach((u) => {
    rate_satu[u.unit_name] = u.rate_satu;
    rate_dua[u.unit_name] = u.rate_dua;
    rate_tiga[u.unit_name] = u.rate_tiga;
    rate_empat[u.unit_name] = u.rate_empat;
    rate_lima[u.unit_name] = u.rate_lima;
    rate_enam[u.unit_name] = u.rate_enam;
    rate_tujuh[u.unit_name] = u.rate_tujuh;
    rate_delapan[u.unit_name] = u.rate_delapan ?? [];
    rate_sembilan[u.unit_name] = u.rate_sembilan ?? [];
    rate_sepuluh[u.unit_name] = u.rate_sepuluh ?? [];
    rate_sebelas[u.unit_name] = u.rate_sebelas ?? [];
    ratio_satu[u.unit_name] = u.ratio_satu ?? [];
    ratio_dua[u.unit_name] = u.ratio_dua ?? [];
    ratio_tiga[u.unit_name] = u.ratio_tiga ?? [];
    ratio_empat[u.unit_name] = u.ratio_empat ?? [];
    ratio_lima[u.unit_name] = u.ratio_lima ?? [];
    ratio_enam[u.unit_name] = u.ratio_enam ?? [];
    ratio_tujuh[u.unit_name] = u.ratio_tujuh ?? [];
    ratio_delapan[u.unit_name] = u.ratio_delapan ?? [];
    ratio_sembilan[u.unit_name] = u.ratio_sembilan ?? [];
    ratio_sepuluh[u.unit_name] = u.ratio_sepuluh ?? [];
    ratio_sebelas[u.unit_name] = u.ratio_sebelas ?? [];
  });

  const cabang =
    entityType === "CABANG"
      ? {
          name: res.entity_name,
          rate_satu: res.rate_satu,
          rate_dua: res.rate_dua,
          rate_tiga: res.rate_tiga,
          rate_empat: res.rate_empat,
          rate_lima: res.rate_lima,
          rate_enam: res.rate_enam,
          rate_tujuh: res.rate_tujuh,
          rate_delapan: res.rate_delapan,
          rate_sembilan: res.rate_sembilan,
          rate_sepuluh: res.rate_sepuluh,
          rate_sebelas: res.rate_sebelas,
        }
      : undefined;

  return {
    success: res.success,
    entity_id: String(res.entity_id),
    entityIds,
    cabang,
    rate_satu,
    rate_dua,
    rate_tiga,
    rate_empat,
    rate_lima,
    rate_enam,
    rate_tujuh,
    rate_delapan,
    rate_sembilan,
    rate_sepuluh,
    rate_sebelas,
    ratio_satu,
    ratio_dua,
    ratio_tiga,
    ratio_empat,
    ratio_lima,
    ratio_enam,
    ratio_tujuh,
    ratio_delapan,
    ratio_sembilan,
    ratio_sepuluh,
    ratio_sebelas,
  };
}

/** Nilai untuk bulan tertentu dari array rate (item.month_end === monthEnd) */
function getMonthlyValue(
  rateArray: Array<Record<string, number>> | undefined,
  monthEnd: number,
  field: string
): number {
  if (!rateArray?.length) return 0;
  const item = rateArray.find((r) => r.month_end === monthEnd);
  return item && field in item ? Number(item[field]) : 0;
}

type EntityRates =
  | RatesRatiosUnitItem
  | Pick<
      ProductRatesRatiosData,
      | "rate_satu"
      | "rate_dua"
      | "rate_tiga"
      | "rate_empat"
      | "rate_lima"
      | "rate_enam"
      | "rate_tujuh"
      | "rate_delapan"
      | "rate_sembilan"
      | "rate_sepuluh"
      | "rate_sebelas"
      | "ratio_satu"
      | "ratio_dua"
      | "ratio_tiga"
      | "ratio_empat"
      | "ratio_lima"
      | "ratio_enam"
      | "ratio_tujuh"
      | "ratio_delapan"
      | "ratio_sembilan"
      | "ratio_sepuluh"
      | "ratio_sebelas"
    >;

/** Data rate & ratio per entity: data di root = cabang/entity, data di units = per unit */
function getRatesForEntity(
  data: ProductRatesRatiosData | null,
  entityName: string
): EntityRates | null {
  if (!data) return null;
  const rootRates = {
    rate_satu: data.rate_satu,
    rate_dua: data.rate_dua,
    rate_tiga: data.rate_tiga,
    rate_empat: data.rate_empat,
    rate_lima: data.rate_lima,
    rate_enam: data.rate_enam,
    rate_tujuh: data.rate_tujuh,
    rate_delapan: data.rate_delapan,
    rate_sembilan: data.rate_sembilan,
    rate_sepuluh: data.rate_sepuluh,
    rate_sebelas: data.rate_sebelas,
    ratio_satu: data.ratio_satu,
    ratio_dua: data.ratio_dua,
    ratio_tiga: data.ratio_tiga,
    ratio_empat: data.ratio_empat,
    ratio_lima: data.ratio_lima,
    ratio_enam: data.ratio_enam,
    ratio_tujuh: data.ratio_tujuh,
    ratio_delapan: data.ratio_delapan,
    ratio_sembilan: data.ratio_sembilan,
    ratio_sepuluh: data.ratio_sepuluh,
    ratio_sebelas: data.ratio_sebelas,
  };
  const units = data.units ?? [];
  if (units.length > 0) {
    const unit = units.find((u) => u.unit_name === entityName);
    if (unit) return unit;
    // entityName = cabang/entity (bukan unit): pakai data di root
    if (entityName === data.entity_name) return rootRates;
    return null;
  }
  return rootRates;
}

export type RateOrRatioKey = keyof Pick<
  EntityRates,
  | "rate_satu" | "rate_dua" | "rate_tiga" | "rate_empat" | "rate_lima" | "rate_enam"
  | "rate_tujuh" | "rate_delapan" | "rate_sembilan" | "rate_sepuluh" | "rate_sebelas"
  | "ratio_satu" | "ratio_dua" | "ratio_tiga" | "ratio_empat" | "ratio_lima" | "ratio_enam"
  | "ratio_tujuh" | "ratio_delapan" | "ratio_sembilan" | "ratio_sepuluh" | "ratio_sebelas"
>;

/** Generic: ambil nilai per month dari rate/ratio (untuk kolom bulanan atau R) */
export function getMonthlyValueByKey(
  data: ProductRatesRatiosData | null,
  entityName: string,
  monthEnd: number,
  key: RateOrRatioKey,
  fieldKey: string
): number {
  const rates = getRatesForEntity(data, entityName);
  const arr = rates?.[key];
  if (!arr) return 0;
  return getMonthlyValue(arr, monthEnd, fieldKey);
}

/** Generic: ambil nilai kolom R1–R12 dari rate tertentu (key per month_end) */
export function getAverageRForRate(
  data: ProductRatesRatiosData | null,
  entityName: string,
  monthEnd: number,
  rateKey: keyof Pick<
    EntityRates,
    | "rate_satu"
    | "rate_dua"
    | "rate_tiga"
    | "rate_empat"
    | "rate_lima"
    | "rate_enam"
    | "rate_tujuh"
    | "rate_delapan"
    | "rate_sembilan"
    | "rate_sepuluh"
    | "rate_sebelas"
  >,
  fieldKey: string
): number {
  return getMonthlyValueByKey(data, entityName, monthEnd, rateKey, fieldKey);
}

/** Untuk baris Satuan Kerja: ambil unit_count (nilai sama tiap bulan) */
export function getUnitCount(data: ProductRatesRatiosData | null): number {
  return data?.unit_count ?? 0;
}
