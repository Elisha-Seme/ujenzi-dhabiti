import { NextResponse } from "next/server";
import { db, deliveryZones } from "@/lib/db";
import { asc, eq } from "drizzle-orm";
import { DELIVERY_ZONES } from "@/lib/delivery";

export const dynamic = "force-dynamic";

// Public: published delivery rates for the estimator. DB first, static fallback.
export async function GET() {
  try {
    const rows = await db
      .select({ county: deliveryZones.county, feeKES: deliveryZones.feeKES })
      .from(deliveryZones)
      .where(eq(deliveryZones.published, true))
      .orderBy(asc(deliveryZones.sortOrder), asc(deliveryZones.feeKES));
    const configured = new Map(rows.map((row) => [row.county.toLowerCase(), row.feeKES]));
    return NextResponse.json({
      zones: DELIVERY_ZONES.map((fallback) => ({
        county: fallback.county,
        feeKES: configured.get(fallback.county.toLowerCase()) ?? fallback.feeKES,
        isConfigured: configured.has(fallback.county.toLowerCase()),
      })),
    });
  } catch {
    /* fall through to static */
  }
  return NextResponse.json({ zones: DELIVERY_ZONES });
}
