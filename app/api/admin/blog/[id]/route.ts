import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { blogPosts, db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  const patch: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of ["slug", "title", "excerpt", "body", "coverImage", "category", "author"]) if (b[key] !== undefined) patch[key] = b[key] || null;
  if (b.tags !== undefined) patch.tags = Array.isArray(b.tags) ? b.tags : [];
  if (b.published !== undefined) {
    patch.published = !!b.published;
    patch.publishedAt = b.published ? new Date() : null;
  }
  const [row] = await db.update(blogPosts).set(patch).where(eq(blogPosts.id, params.id)).returning();
  return row ? NextResponse.json(row) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.delete(blogPosts).where(eq(blogPosts.id, params.id));
  return NextResponse.json({ success: true });
}
