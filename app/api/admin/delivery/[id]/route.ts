import { NextRequest, NextResponse } from "next/server";
import { db, deliveryZones } from "@/lib/db";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  const patch: Record<string, unknown> = { updatedAt: new Date() };
  if (b.county !== undefined) patch.county = String(b.county).trim();
  if (b.region !== undefined) patch.region = b.region ? String(b.region).trim() : null;
  if (b.feeKES !== undefined) patch.feeKES = Number(b.feeKES) || 0;
  if (b.published !== undefined) patch.published = !!b.published;
  if (b.sortOrder !== undefined) patch.sortOrder = Number(b.sortOrder) || 0;

  const [row] = await db.update(deliveryZones).set(patch).where(eq(deliveryZones.id, params.id)).returning();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.delete(deliveryZones).where(eq(deliveryZones.id, params.id));
  return NextResponse.json({ ok: true });
}
