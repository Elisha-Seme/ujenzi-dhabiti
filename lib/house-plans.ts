// Single-vendor house-plans catalogue (sold by Ujenzi Dhabiti).
// Static + server-trusted: order prices are validated against this module on the
// server, never the client. When the catalogue moves to the DB, swap getPlan().

export type DeliveryMode = "digital" | "print";

export type PlanCategory =
  | "Bungalow"
  | "Townhouse"
  | "Maisonette"
  | "Villa"
  | "Apartment"
  | "Commercial";

export const PLAN_CATEGORIES: PlanCategory[] = [
  "Bungalow",
  "Townhouse",
  "Maisonette",
  "Villa",
  "Apartment",
  "Commercial",
];

export interface HousePlan {
  id: string;
  name: string;
  category: PlanCategory;
  planType: string; // more specific label, e.g. "Three-Bedroom Bungalow"
  description: string;
  priceDigitalKES: number;
  pricePrintKES: number;
  image: string;
  bedrooms?: number;
  bathrooms?: number;
  floors: number;
  plinthAreaSqM: number;
  // Filename in /public/plans/ delivered for digital purchases.
  // Plans without a downloadFile are catalogue-only until artwork arrives.
  downloadFile?: string;
  downloadSizeBytes?: number;
}

export const PLATFORM_FEE_PERCENT = 3;

export const HOUSE_PLANS: HousePlan[] = [
  // ─── Bungalows ──────────────────────────────────────────────
  {
    id: "plan-bng-001",
    name: "Savannah 3-Bedroom Bungalow",
    category: "Bungalow",
    planType: "Three-Bedroom Bungalow",
    description: "A compact, family-friendly bungalow with an open-plan living and dining area, master en-suite, and a covered veranda. Designed for efficient single-storey living on a modest plot.",
    priceDigitalKES: 4500,
    pricePrintKES: 7500,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=700&q=70&auto=format&fit=crop",
    bedrooms: 3,
    bathrooms: 2,
    floors: 1,
    plinthAreaSqM: 110,
    downloadFile: "30x50-Model-landscape.pdf",
    downloadSizeBytes: 317414,
  },
  {
    id: "plan-bng-002",
    name: "Acacia 2-Bedroom Bungalow",
    category: "Bungalow",
    planType: "Two-Bedroom Bungalow",
    description: "An affordable starter or rental bungalow with a practical layout, separate kitchen, and ample natural lighting. Ideal for rural and peri-urban plots.",
    priceDigitalKES: 3500,
    pricePrintKES: 6000,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=70&auto=format&fit=crop",
    bedrooms: 2,
    bathrooms: 1,
    floors: 1,
    plinthAreaSqM: 78,
    downloadFile: "20x45-Model.pdf",
    downloadSizeBytes: 158318,
  },
  // ─── Townhouses ─────────────────────────────────────────────
  {
    id: "plan-twn-001",
    name: "Ridgeview 4-Bedroom Townhouse",
    category: "Townhouse",
    planType: "Four-Bedroom Townhouse",
    description: "A double-storey townhouse for gated developments, featuring all-bedroom en-suites, a DSQ, and a private courtyard. Optimised for estate and shared-infrastructure builds.",
    priceDigitalKES: 7500,
    pricePrintKES: 12000,
    image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=700&q=70&auto=format&fit=crop",
    bedrooms: 4,
    bathrooms: 4,
    floors: 2,
    plinthAreaSqM: 185,
  },
  // ─── Maisonettes ────────────────────────────────────────────
  {
    id: "plan-mai-001",
    name: "Tamarind 4-Bedroom Maisonette",
    category: "Maisonette",
    planType: "Four-Bedroom Maisonette",
    description: "A spacious multi-level maisonette with a double-height living room, study, and roof terrace. Clear separation between living and private zones maximises comfort and value.",
    priceDigitalKES: 8500,
    pricePrintKES: 13500,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=70&auto=format&fit=crop",
    bedrooms: 4,
    bathrooms: 3,
    floors: 2,
    plinthAreaSqM: 210,
  },
  // ─── Villas ─────────────────────────────────────────────────
  {
    id: "plan-vil-001",
    name: "Serengeti 5-Bedroom Villa",
    category: "Villa",
    planType: "Five-Bedroom Luxury Villa",
    description: "A premium villa with expansive open-plan living, a chef's kitchen, home office, swimming-pool provision, and landscaped grounds. Built for high-end and diaspora investment projects.",
    priceDigitalKES: 15000,
    pricePrintKES: 24000,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=700&q=70&auto=format&fit=crop",
    bedrooms: 5,
    bathrooms: 5,
    floors: 2,
    plinthAreaSqM: 360,
  },
  // ─── Apartments ─────────────────────────────────────────────
  {
    id: "plan-apt-studio",
    name: "Urban Studio / Bedsitter Block",
    category: "Apartment",
    planType: "Studio Apartment / Bedsitter",
    description: "A high-density studio block plan optimised for rental yield — compact, functional units with shared circulation, ideal for student and young-professional markets.",
    priceDigitalKES: 9500,
    pricePrintKES: 15000,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&q=70&auto=format&fit=crop",
    floors: 4,
    plinthAreaSqM: 600,
    downloadFile: "15x30-ft-Best-House-Plan-Model.pdf",
    downloadSizeBytes: 206207,
  },
  {
    id: "plan-apt-1br",
    name: "Metro One-Bedroom Apartment Block",
    category: "Apartment",
    planType: "One-Bedroom Apartments",
    description: "A one-bedroom apartment block with practical unit layouts, separate kitchen and living areas, and strong long-term rental appeal in urban and peri-urban areas.",
    priceDigitalKES: 11000,
    pricePrintKES: 17500,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&q=70&auto=format&fit=crop",
    bedrooms: 1,
    bathrooms: 1,
    floors: 5,
    plinthAreaSqM: 820,
  },
  {
    id: "plan-apt-2br",
    name: "Parkside Two-Bedroom Apartment Block",
    category: "Apartment",
    planType: "Two-Bedroom Apartments",
    description: "A two-bedroom apartment development designed for small families and shared living, balancing privacy, comfort, and occupancy efficiency.",
    priceDigitalKES: 13000,
    pricePrintKES: 20000,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=70&auto=format&fit=crop",
    bedrooms: 2,
    bathrooms: 2,
    floors: 6,
    plinthAreaSqM: 1100,
  },
  // ─── Commercial ─────────────────────────────────────────────
  {
    id: "plan-com-office",
    name: "Summit Office Block",
    category: "Commercial",
    planType: "Multi-Storey Office Building",
    description: "A modern office block plan with flexible floor plates, efficient vertical circulation, and a professional façade treatment — built to support evolving workplace models.",
    priceDigitalKES: 22000,
    pricePrintKES: 34000,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&q=70&auto=format&fit=crop",
    floors: 6,
    plinthAreaSqM: 2400,
  },
  {
    id: "plan-com-warehouse",
    name: "Logistix Warehouse & Yard",
    category: "Commercial",
    planType: "Warehouse & Industrial Facility",
    description: "A high-capacity warehouse plan with high load-bearing structure, efficient loading/offloading access, optimised storage flow, and fire-compliant layouts.",
    priceDigitalKES: 18000,
    pricePrintKES: 28000,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700&q=70&auto=format&fit=crop",
    floors: 1,
    plinthAreaSqM: 1800,
  },
];

const PLAN_MAP: Record<string, HousePlan> = Object.fromEntries(
  HOUSE_PLANS.map((p) => [p.id, p])
);

export function getPlan(id: string): HousePlan | undefined {
  return PLAN_MAP[id];
}

export function isPlanId(id: string): boolean {
  return id in PLAN_MAP;
}

export function planPrice(plan: HousePlan, mode: DeliveryMode): number {
  return mode === "digital" ? plan.priceDigitalKES : plan.pricePrintKES;
}

// Stable display suffix the orders API appends to plan items so we can
// recover the plan + delivery mode from the snapshot later.
export function planSnapshotName(plan: HousePlan, mode: DeliveryMode): string {
  return `${plan.name} (${mode === "digital" ? "Digital download" : "Printed copy"})`;
}

// Reverse-lookup an order_items.productName back to the plan + mode it
// represents. Returns null for material items or unrecognised snapshots.
export function findPlanByOrderItem(productName: string): { plan: HousePlan; mode: DeliveryMode } | null {
  for (const plan of HOUSE_PLANS) {
    if (productName === planSnapshotName(plan, "digital")) return { plan, mode: "digital" };
    if (productName === planSnapshotName(plan, "print")) return { plan, mode: "print" };
  }
  return null;
}
