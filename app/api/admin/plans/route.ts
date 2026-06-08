import { NextRequest, NextResponse } from "next/server";
import { db, housePlans } from "@/lib/db";
import { desc } from "drizzle-orm";
import { isAdmin, makeId } from "@/lib/admin-guard";
import { HOUSE_PLANS } from "@/lib/house-plans";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const rows = await db.select().from(housePlans).orderBy(desc(housePlans.createdAt));
    // DB is the source of truth — even an empty result is returned as-is so admins
    // can add/edit/delete freely (nothing is hard-coded once the table exists).
    return NextResponse.json(rows);
  } catch {
    // Table not migrated yet — show the static catalogue read-only so the panel
    // isn't blank. After `db:migrate` + `db:seed` these become editable rows.
    return NextResponse.json(HOUSE_PLANS.map((p) => ({ ...p, published: true, _static: true })));
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b.name || !b.category || !b.planType || !b.description) {
    return NextResponse.json({ error: "Name, category, plan type and description are required" }, { status: 400 });
  }
  const [row] = await db
    .insert(housePlans)
    .values({
      id: makeId("plan"),
      name: b.name,
      category: b.category,
      planType: b.planType,
      description: b.description,
      priceDigitalKES: Number(b.priceDigitalKES) || 0,
      pricePrintKES: Number(b.pricePrintKES) || 0,
      image: b.image ?? null,
      bedrooms: b.bedrooms != null && b.bedrooms !== "" ? Number(b.bedrooms) : null,
      bathrooms: b.bathrooms != null && b.bathrooms !== "" ? Number(b.bathrooms) : null,
      floors: Number(b.floors) || 1,
      plinthAreaSqM: Number(b.plinthAreaSqM) || 0,
      downloadFile: b.downloadFile ?? null,
      published: b.published !== false,
    })
    .returning();
  return NextResponse.json(row, { status: 201 });
}
