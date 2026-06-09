import { NextRequest, NextResponse } from "next/server";
import { db, products } from "@/lib/db";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/admin-guard";

const NUMERIC = ["priceKES", "stock"];

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();

  const patch: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of ["name", "category", "description", "unit", "images", "specs", "brand", "materialType", "isActive"]) {
    if (b[key] !== undefined) patch[key] = b[key];
  }
  for (const key of NUMERIC) {
    if (b[key] !== undefined) patch[key] = Number(b[key]) || 0;
  }

  const [row] = await db.update(products).set(patch).where(eq(products.id, params.id)).returning();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.delete(products).where(eq(products.id, params.id));
  return NextResponse.json({ ok: true });
}
