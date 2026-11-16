// Labour pricing units for service sub-sections. Rates are set by the admin;
// a sub-service without a rate is shown as "Priced after site visit".

export type LabourUnit = "sqm" | "m" | "item" | "lump";

export const LABOUR_UNITS: readonly LabourUnit[] = ["sqm", "m", "item", "lump"];

export const LABOUR_UNIT_LABEL: Record<LabourUnit, string> = {
  sqm: "per m²",
  m: "per metre",
  item: "per item",
  lump: "lump sum",
};

export function isLabourUnit(value: unknown): value is LabourUnit {
  return typeof value === "string" && (LABOUR_UNITS as readonly string[]).includes(value);
}

export type LabourInputResult =
  | { ok: true; labourRateKES: number | null; labourUnit: LabourUnit | null }
  | { ok: false; error: string };

/** Validates the admin's labour rate + unit form values. */
export function parseLabourInput(rate: unknown, unit: unknown): LabourInputResult {
  const rawUnit = typeof unit === "string" ? unit.trim() : unit ?? "";
  if (rawUnit !== "" && !isLabourUnit(rawUnit)) {
    return { ok: false, error: "Labour unit must be per m², per metre, per item or lump sum" };
  }
  const labourUnit = rawUnit === "" ? null : (rawUnit as LabourUnit);

  const rawRate = typeof rate === "string" ? rate.trim() : rate;
  if (rawRate === "" || rawRate === null || rawRate === undefined) {
    return { ok: true, labourRateKES: null, labourUnit };
  }
  const value = Number(rawRate);
  if (!Number.isInteger(value) || value < 0) {
    return { ok: false, error: "Labour rate must be a whole number of KES (0 or more)" };
  }
  if (!labourUnit) return { ok: false, error: "Choose a labour unit for the rate" };
  return { ok: true, labourRateKES: value, labourUnit };
}
