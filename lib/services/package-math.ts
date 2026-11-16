// Pure maths for the service package builder. No prices are invented here:
// a labour item without an admin rate is "priced after site visit" (null).
import type { LabourUnit } from "./labour";
import type { AreaMode } from "./package-links";

export type PackageGroup = "work" | "design" | "materials" | "delivery";
export const PACKAGE_GROUPS: readonly PackageGroup[] = ["work", "design", "materials", "delivery"];

export interface PackageItem {
  id: string;
  group: PackageGroup;
  label: string;
  kind: "labour" | "plan" | "material" | "delivery";
  /** KES per unit (labour/material). null = no admin rate / priced elsewhere. */
  rateKES: number | null;
  unit: LabourUnit | "each" | null;
  defaultQty: number;
  /** House plans only: price per format. */
  options?: { digitalKES: number; printKES: number };
  /** Optional context shown under the label (e.g. plan category, product unit). */
  detail?: string;
  /** Materials only: how many m² one unit covers (drives quantity from area). */
  coverageSqmPerUnit?: number;
  /** Materials and plans: what the cart needs to add this line. */
  cart?: { productId: string; name: string; unit: string; image: string };
  /** Optional deep link (plan detail page, product page). */
  href?: string;
}

export type LineSelection = { qty: number; mode?: "digital" | "print" };
export type Selection = Record<string, LineSelection>;

const SQFT_TO_SQM = 0.092903;
const MAX_AREA_SQM = 1_000_000;
const MAX_QTY = 100_000;
const WASTAGE = 1.1;

/** Turns the raw area field into square metres: finite, >= 0, capped. */
export function sanitiseArea(raw: string, unit: "sqm" | "sqft"): number {
  const value = Number(String(raw).trim());
  if (!Number.isFinite(value) || value <= 0) return 0;
  const sqm = unit === "sqft" ? value * SQFT_TO_SQM : value;
  return Math.min(sqm, MAX_AREA_SQM);
}

export function clampQty(raw: unknown): number {
  const value = Math.floor(Number(raw));
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.min(value, MAX_QTY);
}

/** Units needed to cover an area with a 10% wastage allowance (coverage services only). */
export function materialQuantity(areaSqm: number, coverage: number | undefined, mode: AreaMode): number {
  if (mode === "floor" || !coverage || coverage <= 0 || !(areaSqm > 0)) return 1;
  return clampQty(Math.ceil((areaSqm * WASTAGE) / coverage));
}

/** Whether a labour line needs a quantity input (lump sums don't). */
export function needsQuantity(item: PackageItem): boolean {
  if (item.kind === "material") return true;
  return item.kind === "labour" && item.rateKES !== null && (item.unit === "sqm" || item.unit === "m" || item.unit === "item");
}

/** Line total in KES, or null when the line is priced after a site visit. */
export function lineTotal(item: PackageItem, sel: LineSelection | undefined): number | null {
  if (item.kind === "plan") {
    if (!item.options) return null;
    return sel?.mode === "print" ? item.options.printKES : item.options.digitalKES;
  }
  if (item.kind === "delivery") return null;
  if (item.rateKES === null) return null;
  if (item.unit === "lump") return item.rateKES;
  return item.rateKES * clampQty(sel?.qty ?? item.defaultQty);
}

export function isPhysical(item: PackageItem, sel: LineSelection | undefined): boolean {
  return item.kind === "material" || (item.kind === "plan" && sel?.mode === "print");
}

export interface PackageTotals {
  byGroup: Record<PackageGroup, number>;
  /** Selected lines that carry a real price, per group (0 = show "site visit", not KES 0). */
  pricedCount: Record<PackageGroup, number>;
  total: number;
  unpricedCount: number;
  physicalSelected: boolean;
  selectedCount: number;
}

export function computeTotals(items: PackageItem[], selection: Selection, deliveryFeeKES: number | null = null): PackageTotals {
  const byGroup: Record<PackageGroup, number> = { work: 0, design: 0, materials: 0, delivery: 0 };
  const pricedCount: Record<PackageGroup, number> = { work: 0, design: 0, materials: 0, delivery: 0 };
  let unpricedCount = 0;
  let physicalSelected = false;
  let selectedCount = 0;

  for (const item of items) {
    if (item.kind === "delivery") continue;
    const sel = selection[item.id];
    if (!sel) continue;
    selectedCount++;
    if (isPhysical(item, sel)) physicalSelected = true;
    const amount = lineTotal(item, sel);
    if (amount === null) unpricedCount++;
    else { byGroup[item.group] += amount; pricedCount[item.group]++; }
  }

  if (physicalSelected && deliveryFeeKES !== null && deliveryFeeKES > 0 && items.some((i) => i.kind === "delivery")) {
    byGroup.delivery = deliveryFeeKES;
    pricedCount.delivery = 1;
  }

  const total = byGroup.work + byGroup.design + byGroup.materials + byGroup.delivery;
  return { byGroup, pricedCount, total, unpricedCount, physicalSelected, selectedCount };
}

/** True when nothing selected has a price yet, so "KES 0" would be misleading. */
export function totalIsUnconfirmed(totals: PackageTotals): boolean {
  return totals.total === 0 && totals.unpricedCount > 0;
}

/** Restores a saved selection, keeping only items still offered and valid values. */
export function restoreSelection(raw: unknown, items: PackageItem[]): Selection {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const byId = new Map(items.map((item) => [item.id, item]));
  const out: Selection = {};
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    const item = byId.get(id);
    if (!item || item.kind === "delivery" || !value || typeof value !== "object") continue;
    const { qty, mode } = value as { qty?: unknown; mode?: unknown };
    if (item.kind === "plan") out[id] = { qty: 1, mode: mode === "print" ? "print" : "digital" };
    else out[id] = { qty: clampQty(qty) };
  }
  return out;
}

export function formatKES(amount: number): string {
  return `KES ${Math.round(amount).toLocaleString("en-KE")}`;
}

const UNIT_TEXT: Record<string, string> = { sqm: "m²", m: "m", item: "item(s)", each: "", lump: "" };

export interface QuoteMessageInput {
  serviceTitle: string;
  areaSqm: number;
  areaLabel: string;
  county: string | null;
  items: PackageItem[];
  selection: Selection;
  deliveryFeeKES?: number | null;
  notes?: string;
}

/** Plain-text, itemised package description sent through the contact pipeline. */
export function formatQuoteMessage(input: QuoteMessageInput): string {
  const { items, selection } = input;
  const totals = computeTotals(items, selection, input.deliveryFeeKES ?? null);
  const groupTitle: Record<PackageGroup, string> = { work: "Work items", design: "Design & plans", materials: "Materials", delivery: "Delivery" };
  const lines: string[] = [`Package quote request — ${input.serviceTitle}`, ""];

  for (const group of PACKAGE_GROUPS) {
    const chosen = items.filter((item) => item.group === group && item.kind !== "delivery" && selection[item.id]);
    if (chosen.length === 0) continue;
    lines.push(`${groupTitle[group]}:`);
    for (const item of chosen) {
      const sel = selection[item.id];
      const amount = lineTotal(item, sel);
      if (amount === null) {
        lines.push(`- ${item.label} — Priced after site visit`);
      } else if (item.kind === "plan") {
        lines.push(`- ${item.label} (${sel.mode === "print" ? "Printed copy" : "Digital download"}) — ${formatKES(amount)}`);
      } else if (item.unit === "lump") {
        lines.push(`- ${item.label} — lump sum ${formatKES(amount)}`);
      } else {
        const qty = clampQty(sel.qty);
        const unit = UNIT_TEXT[item.unit ?? "each"] ?? "";
        lines.push(`- ${item.label} — ${qty}${unit ? ` ${unit}` : ""} × ${formatKES(item.rateKES ?? 0)} = ${formatKES(amount)}`);
      }
    }
    lines.push("");
  }

  if (totals.physicalSelected && totals.byGroup.delivery > 0) {
    lines.push(`Delivery${input.county ? ` to ${input.county}` : ""}: ${formatKES(totals.byGroup.delivery)} (estimate)`, "");
  }

  lines.push(`Indicative total: ${totalIsUnconfirmed(totals) ? "To be confirmed after site visit" : formatKES(totals.total)}`);
  if (totals.unpricedCount > 0) lines.push(`${totals.unpricedCount} item(s) priced after site visit`);
  lines.push(`${input.areaLabel}: ${Math.round(input.areaSqm * 100) / 100} m²`);
  lines.push(`County: ${input.county ?? "Not specified"}`);
  if (input.notes?.trim()) lines.push("", `Notes: ${input.notes.trim()}`);
  lines.push("", "Indicative only — final pricing is confirmed after a site assessment.");
  return lines.join("\n");
}
