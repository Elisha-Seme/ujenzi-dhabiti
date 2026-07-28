import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db, resourceArticles } from "@/lib/db";
import { isAdmin, makeId } from "@/lib/admin-guard";
export async function GET() { if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 }); return NextResponse.json(await db.select().from(resourceArticles).orderBy(desc(resourceArticles.createdAt))); }
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 }); const b = await req.json();
  if (!b.slug || !/^[a-z0-9-]+$/.test(b.slug) || !b.title || !b.summary || !b.body || !b.author || !b.category) return NextResponse.json({ error: "Valid slug and all required content fields are required" }, { status: 400 });
  const [row] = await db.insert(resourceArticles).values({ id: makeId("article"), slug: b.slug, title: b.title, summary: b.summary, body: b.body, coverImage: b.coverImage || null, author: b.author, category: b.category, tags: Array.isArray(b.tags) ? b.tags : [], seoTitle: b.seoTitle || null, seoDescription: b.seoDescription || null, published: !!b.published, publishedAt: b.published ? new Date() : null }).returning();
  return NextResponse.json(row, { status: 201 });
}
