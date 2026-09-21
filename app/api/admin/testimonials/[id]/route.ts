import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, testimonials } from "@/lib/db";
import { isAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  const patch: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of ["quote", "authorName", "authorRole", "company", "image"]) if (b[key] !== undefined) patch[key] = b[key] || null;
  if (b.rating !== undefined) patch.rating = b.rating == null || b.rating === "" ? null : Math.max(1, Math.min(5, Number(b.rating)));
  if (b.published !== undefined) patch.published = !!b.published;
  if (b.sortOrder !== undefined) patch.sortOrder = Number(b.sortOrder) || 0;
  const [row] = await db.update(testimonials).set(patch).where(eq(testimonials.id, params.id)).returning();
  return row ? NextResponse.json(row) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.delete(testimonials).where(eq(testimonials.id, params.id));
  return NextResponse.json({ success: true });
}
