import { NextRequest, NextResponse } from "next/server";
import { db, whyChooseUs } from "@/lib/db";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  const patch: Record<string, unknown> = {};
  for (const k of ["title", "description", "iconName"]) {
    if (b[k] !== undefined) patch[k] = b[k];
  }
  if (b.sortOrder !== undefined) patch.sortOrder = Number(b.sortOrder) || 0;

  const [row] = await db.update(whyChooseUs).set(patch).where(eq(whyChooseUs.id, params.id)).returning();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.delete(whyChooseUs).where(eq(whyChooseUs.id, params.id));
  return NextResponse.json({ success: true });
}
