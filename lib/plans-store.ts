// Runtime source of truth for house plans: the admin-managed `house_plans` table,
// with the static HOUSE_PLANS module as seed + fallback. Every DB read is wrapped
// so the catalogue (and payment/download flow) keeps working even before the table
// is migrated/seeded.

import { db, housePlans } from "@/lib/db";
import { eq } from "drizzle-orm";
import type { HousePlanRow } from "@/lib/db";
import {
  HOUSE_PLANS,
  getPlan,
  findPlanByOrderItem,
  type HousePlan,
  type PlanCategory,
  type DeliveryMode,
} from "@/lib/house-plans";

function rowToPlan(r: HousePlanRow): HousePlan {
  return {
    id: r.id,
    name: r.name,
    category: r.category as PlanCategory,
    planType: r.planType,
    description: r.description,
    priceDigitalKES: r.priceDigitalKES,
    pricePrintKES: r.pricePrintKES,
    image: r.image ?? "",
    bedrooms: r.bedrooms ?? undefined,
    bathrooms: r.bathrooms ?? undefined,
    floors: r.floors,
    plinthAreaSqM: r.plinthAreaSqM,
    downloadFile: r.downloadFile ?? undefined,
    downloadSizeBytes: r.downloadSizeBytes ?? undefined,
  };
}

/** All purchasable plans. DB when seeded, otherwise the static catalogue. */
export async function getAllPlans(): Promise<HousePlan[]> {
  try {
    // Table exists → DB is authoritative (even if empty: admin deleted them).
    const rows = await db.select().from(housePlans);
    return rows.filter((r) => r.published).map(rowToPlan);
  } catch {
    // Table not migrated yet → fall back to the static seed so the shop still works.
    return HOUSE_PLANS;
  }
}

/** Resolve a single plan by id — DB first, static fallback. */
export async function getPlanById(id: string): Promise<HousePlan | undefined> {
  try {
    const rows = await db.select().from(housePlans).where(eq(housePlans.id, id)).limit(1);
    if (rows[0]) return rowToPlan(rows[0]);
  } catch {
    /* fall through to static */
  }
  return getPlan(id);
}

export async function isPlanIdAsync(id: string): Promise<boolean> {
  return (await getPlanById(id)) !== undefined;
}

/** Reverse-lookup an order_items.productName back to its plan + delivery mode. */
export async function findPlanByOrderItemAsync(
  productName: string
): Promise<{ plan: HousePlan; mode: DeliveryMode } | null> {
  // Static match first (covers seed plans cheaply).
  const staticMatch = findPlanByOrderItem(productName);
  if (staticMatch) return staticMatch;
  // Then DB-managed plans.
  try {
    const plans = await getAllPlans();
    for (const plan of plans) {
      if (productName === `${plan.name} (Digital download)`) return { plan, mode: "digital" };
      if (productName === `${plan.name} (Printed copy)`) return { plan, mode: "print" };
    }
  } catch {
    /* ignore */
  }
  return null;
}
