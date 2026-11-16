// Linking rules for the service package builder: which house plans,
// architectural add-ons, materials and related services each service offers.
// Pure data + functions (no DB) so they are unit-tested and easy to change.
import { PLAN_CATEGORIES, type PlanCategory } from "../house-plans";
import type { ProductCategory } from "../products";

export type AreaMode = "floor" | "coverage";

/** Services measured by building floor area rather than surface coverage. */
const FLOOR_AREA_SERVICES = new Set(["building-works", "architectural"]);

export function areaModeForService(slug: string): AreaMode {
  return FLOOR_AREA_SERVICES.has(slug) ? "floor" : "coverage";
}

export function areaLabelForService(slug: string): string {
  return areaModeForService(slug) === "floor" ? "Floor area" : "Area to be covered";
}

const RESIDENTIAL: PlanCategory[] = ["Bungalow", "Townhouse", "Maisonette", "Villa", "Apartment"];

/** Parses a subsection's planType: comma list of categories, or Residential / Commercial. */
export function expandPlanTypes(planType: string | null): PlanCategory[] {
  if (!planType) return [];
  const out = new Set<PlanCategory>();
  for (const raw of planType.split(",")) {
    const name = raw.trim().toLowerCase();
    if (!name) continue;
    if (name === "residential") RESIDENTIAL.forEach((c) => out.add(c));
    const match = PLAN_CATEGORIES.find((c) => c.toLowerCase() === name);
    if (match) out.add(match);
  }
  return [...out];
}

/** Services that offer the whole plan catalogue. */
const ALL_PLANS_SERVICES = new Set(["building-works", "architectural"]);

export function planCategoriesForService(slug: string, subsectionPlanTypes: (string | null)[]): PlanCategory[] {
  if (ALL_PLANS_SERVICES.has(slug)) return [...PLAN_CATEGORIES];
  const out = new Set<PlanCategory>();
  for (const planType of subsectionPlanTypes) expandPlanTypes(planType).forEach((c) => out.add(c));
  return PLAN_CATEGORIES.filter((c) => out.has(c));
}

/** Architectural sub-services (by sectionId) offered as add-ons on other services. */
const ARCHITECTURAL_ADDONS: Record<string, string[] | "all"> = {
  "building-works": "all",
  "civil-works": ["structural-engineering"],
  "interior-design": ["architectural-design"],
};

export function architecturalSectionIdsForService(slug: string): string[] | "all" {
  return ARCHITECTURAL_ADDONS[slug] ?? [];
}

const MATERIAL_CATEGORIES: Record<string, ProductCategory[]> = {
  "gypsum-ceilings": ["Gypsum & Ceilings"],
  "paint-finishes": ["Paint & Finishes"],
  flooring: ["Flooring"],
  "cabro-road-works": ["Cabro & Road Works"],
  plumbing: ["Plumbing"],
  "building-works": ["Structural Materials", "Hardware", "Electrical", "Plumbing"],
  "civil-works": ["Cabro & Road Works", "Structural Materials"],
  "interior-design": ["Gypsum & Ceilings", "Hardware", "Electrical"],
  architectural: [],
};

/** Suggested product categories, used only when the admin hasn't curated materials. */
export function materialCategoriesForService(slug: string): ProductCategory[] {
  return [...(MATERIAL_CATEGORIES[slug] ?? [])];
}

/** Groups of services commonly bought together; every member relates to the others. */
const RELATED_GROUPS: string[][] = [
  ["flooring", "paint-finishes", "gypsum-ceilings", "interior-design"],
  ["building-works", "architectural", "civil-works"],
  ["cabro-road-works", "civil-works", "plumbing"],
  ["building-works", "plumbing", "flooring", "paint-finishes"],
];

export function relatedServiceSlugs(slug: string): string[] {
  const out = new Set<string>();
  for (const group of RELATED_GROUPS) {
    if (group.includes(slug)) group.forEach((s) => s !== slug && out.add(s));
  }
  return [...out];
}
