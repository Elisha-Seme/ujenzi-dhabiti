import { NextRequest, NextResponse } from "next/server";
import { db, deliveryZones } from "@/lib/db";
import { asc } from "drizzle-orm";
import { isAdmin, makeId } from "@/lib/admin-guard";
import { DELIVERY_ZONES } from "@/lib/delivery";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const rows = await db.select().from(deliveryZones).orderBy(asc(deliveryZones.sortOrder), asc(deliveryZones.county));
    return NextResponse.json(rows);
  } catch {
    // Table not migrated yet — show the static rates read-only.
    return NextResponse.json(
      DELIVERY_ZONES.map((z, i) => ({ id: `static-${i}`, county: z.county, region: null, feeKES: z.feeKES, published: true, _static: true }))
    );
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b.county || b.feeKES == null) {
    return NextResponse.json({ error: "County and fee are required" }, { status: 400 });
  }
  const [row] = await db
    .insert(deliveryZones)
    .values({
      id: makeId("zone"),
      county: String(b.county).trim(),
      region: b.region ? String(b.region).trim() : null,
      feeKES: Number(b.feeKES) || 0,
      published: b.published !== false,
      sortOrder: Number(b.sortOrder) || 0,
    })
    .returning();
  return NextResponse.json(row, { status: 201 });
}
