import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, estimatorRates } from "@/lib/db";
import { isAdmin } from "@/lib/admin-guard";
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 }); const b = await req.json();
  const [row] = await db.update(estimatorRates).set({ buildingType: b.buildingType, finishLevel: b.finishLevel, ratePerSqM: Number(b.ratePerSqM), labourPercent: Number(b.labourPercent) || 0, wastagePercent: Number(b.wastagePercent) || 0, locationFactor: Number(b.locationFactor) || 100, notes: b.notes || null, published: b.published !== false, updatedAt: new Date() }).where(eq(estimatorRates.id, params.id)).returning(); return NextResponse.json(row);
}
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) { if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 }); await db.delete(estimatorRates).where(eq(estimatorRates.id, params.id)); return NextResponse.json({ success: true }); }
