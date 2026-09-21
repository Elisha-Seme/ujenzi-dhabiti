import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db, testimonials } from "@/lib/db";
import { isAdmin, makeId } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await db.select().from(testimonials).orderBy(asc(testimonials.sortOrder)));
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b.quote || !b.authorName) return NextResponse.json({ error: "Quote and author name are required" }, { status: 400 });
  const [row] = await db.insert(testimonials).values({
    id: makeId("testimonial"),
    quote: String(b.quote).trim(),
    authorName: String(b.authorName).trim(),
    authorRole: b.authorRole || null,
    company: b.company || null,
    rating: b.rating == null || b.rating === "" ? null : Math.max(1, Math.min(5, Number(b.rating))),
    image: b.image || null,
    published: !!b.published,
    sortOrder: Number(b.sortOrder) || 0,
  }).returning();
  return NextResponse.json(row, { status: 201 });
}
