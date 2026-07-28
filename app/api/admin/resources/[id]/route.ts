import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, resourceArticles } from "@/lib/db";
import { isAdmin } from "@/lib/admin-guard";
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 }); const b = await req.json();
  const [current] = await db.select().from(resourceArticles).where(eq(resourceArticles.id, params.id));
  const [row] = await db.update(resourceArticles).set({ slug: b.slug, title: b.title, summary: b.summary, body: b.body, coverImage: b.coverImage || null, author: b.author, category: b.category, tags: Array.isArray(b.tags) ? b.tags : [], seoTitle: b.seoTitle || null, seoDescription: b.seoDescription || null, published: !!b.published, publishedAt: b.published ? current?.publishedAt ?? new Date() : null, updatedAt: new Date() }).where(eq(resourceArticles.id, params.id)).returning(); return NextResponse.json(row);
}
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) { if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 }); await db.delete(resourceArticles).where(eq(resourceArticles.id, params.id)); return NextResponse.json({ success: true }); }
