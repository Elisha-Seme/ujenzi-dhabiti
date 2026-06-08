import { NextRequest, NextResponse } from "next/server";
import { db, housePlans } from "@/lib/db";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/admin-guard";

const NUMERIC = ["priceDigitalKES", "pricePrintKES", "bedrooms", "bathrooms", "floors", "plinthAreaSqM", "downloadSizeBytes"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  const patch: Record<string, unknown> = { updatedAt: new Date() };
  for (const k of ["name", "category", "planType", "description", "image", "downloadFile"]) {
    if (b[k] !== undefined) patch[k] = b[k];
  }
  for (const k of NUMERIC) {
    if (b[k] !== undefined) patch[k] = b[k] === "" || b[k] === null ? null : Number(b[k]);
  }
  if (b.published !== undefined) patch.published = !!b.published;

  const [row] = await db.update(housePlans).set(patch).where(eq(housePlans.id, params.id)).returning();
  if (!row) {
    return NextResponse.json(
      { error: "This plan is part of the built-in catalogue. Run the seed migration to make it editable." },
      { status: 404 }
    );
  }
  return NextResponse.json(row);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.delete(housePlans).where(eq(housePlans.id, params.id));
  return NextResponse.json({ success: true });
}
