import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { blogPosts, db } from "@/lib/db";
import { isAdmin, makeId } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)));
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b.slug || !b.title || !b.excerpt || !b.body || !b.author) return NextResponse.json({ error: "Slug, title, excerpt, body, and author are required" }, { status: 400 });
  const published = !!b.published;
  const [row] = await db.insert(blogPosts).values({
    id: makeId("post"),
    slug: String(b.slug).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    title: String(b.title).trim(),
    excerpt: String(b.excerpt).trim(),
    body: String(b.body),
    coverImage: b.coverImage || null,
    category: b.category || "Resources",
    tags: Array.isArray(b.tags) ? b.tags : [],
    author: String(b.author).trim(),
    published,
    publishedAt: published ? new Date() : null,
  }).returning();
  return NextResponse.json(row, { status: 201 });
}
