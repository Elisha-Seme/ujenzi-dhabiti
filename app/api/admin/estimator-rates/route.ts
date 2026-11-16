import { NextRequest, NextResponse } from "next/server";
import { db, estimatorRates } from "@/lib/db";
import { isAdmin, makeId } from "@/lib/admin-guard";
export async function GET() { if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 }); return NextResponse.json(await db.select().from(estimatorRates)); }
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json(); if (!b.buildingType || !b.finishLevel || Number(b.ratePerSqM) <= 0) return NextResponse.json({ error: "Building type, finish and positive rate required" }, { status: 400 });
  const [row] = await db.insert(estimatorRates).values({ id: makeId("rate"), buildingType: b.buildingType, finishLevel: b.finishLevel, ratePerSqM: Number(b.ratePerSqM), labourPercent: Number(b.labourPercent) || 0, wastagePercent: Number(b.wastagePercent) || 0, locationFactor: Number(b.locationFactor) || 100, notes: b.notes || null, published: b.published !== false }).returning();
  return NextResponse.json(row, { status: 201 });
}
