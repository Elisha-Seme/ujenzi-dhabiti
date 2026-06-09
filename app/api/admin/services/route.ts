import { NextRequest, NextResponse } from "next/server";
import { db, services } from "@/lib/db";
import { asc } from "drizzle-orm";
import { isAdmin, makeId } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const rows = await db.select().from(services).orderBy(asc(services.sortOrder));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b.title || !b.slug || !b.description) {
    return NextResponse.json({ error: "Title, slug, and description are required" }, { status: 400 });
  }
  const [row] = await db
    .insert(services)
    .values({
      id: makeId("srv"),
      slug: b.slug,
      title: b.title,
      description: b.description,
      iconName: b.iconName ?? "Layout",
      image: b.image ?? "",
      quoteType: b.quoteType ?? b.title,
      includes: Array.isArray(b.includes) ? b.includes : [],
      materials: Array.isArray(b.materials) ? b.materials : [],
      sortOrder: Number(b.sortOrder) || 0,
      published: b.published !== false,
    })
    .returning();
  return NextResponse.json(row, { status: 201 });
}
