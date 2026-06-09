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
    if (rows.length) return NextResponse.json({ zones: rows });
  } catch {
    /* fall through to static */
  }
  return NextResponse.json({ zones: DELIVERY_ZONES });
}
