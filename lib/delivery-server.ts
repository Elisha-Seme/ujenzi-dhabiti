// Server-only: published delivery fees merged over the static 47-county
// placeholders. Kept out of lib/delivery.ts because that module is imported
// by client components and must not pull in the database client.
import { asc, eq } from "drizzle-orm";
import { db, deliveryZones } from "@/lib/db";
import { DELIVERY_ZONES, type DeliveryZone } from "@/lib/delivery";

export type PublishedZone = Required<DeliveryZone>;

export async function getPublishedDeliveryZones(): Promise<PublishedZone[]> {
  try {
    const rows = await db
      .select({ county: deliveryZones.county, feeKES: deliveryZones.feeKES })
      .from(deliveryZones)
      .where(eq(deliveryZones.published, true))
      .orderBy(asc(deliveryZones.sortOrder), asc(deliveryZones.feeKES));
    const configured = new Map(rows.map((row) => [row.county.toLowerCase(), row.feeKES]));
    return DELIVERY_ZONES.map((fallback) => ({
      county: fallback.county,
      feeKES: configured.get(fallback.county.toLowerCase()) ?? fallback.feeKES,
      isConfigured: configured.has(fallback.county.toLowerCase()),
    }));
  } catch {
    return DELIVERY_ZONES.map((zone) => ({ county: zone.county, feeKES: zone.feeKES, isConfigured: false }));
  }
}
