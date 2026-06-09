import { NextRequest, NextResponse } from "next/server";
import { db, services } from "@/lib/db";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  const patch: Record<string, unknown> = { updatedAt: new Date() };
  for (const k of ["slug", "title", "description", "iconName", "image", "quoteType"]) {
    if (b[k] !== undefined) patch[k] = b[k];
  }
  if (b.includes !== undefined) patch.includes = Array.isArray(b.includes) ? b.includes : [];
  if (b.materials !== undefined) patch.materials = Array.isArray(b.materials) ? b.materials : [];
  if (b.sortOrder !== undefined) patch.sortOrder = Number(b.sortOrder) || 0;
  if (b.published !== undefined) patch.published = !!b.published;

  const [row] = await db.update(services).set(patch).where(eq(services.id, params.id)).returning();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.delete(services).where(eq(services.id, params.id));
  return NextResponse.json({ success: true });
}
