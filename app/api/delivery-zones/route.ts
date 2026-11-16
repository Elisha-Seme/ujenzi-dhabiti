import { NextResponse } from "next/server";
import { getPublishedDeliveryZones } from "@/lib/delivery-server";

export const dynamic = "force-dynamic";

// Public: published delivery rates for the estimator. DB first, static fallback.
export async function GET() {
  return NextResponse.json({ zones: await getPublishedDeliveryZones() });
}
