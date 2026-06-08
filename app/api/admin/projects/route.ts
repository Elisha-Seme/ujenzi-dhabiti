import { NextRequest, NextResponse } from "next/server";
import { db, projects } from "@/lib/db";
import { desc } from "drizzle-orm";
import { isAdmin, makeId } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const rows = await db.select().from(projects).orderBy(desc(projects.sortOrder), desc(projects.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b.title || !b.description) {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
  }
  const [row] = await db
    .insert(projects)
    .values({
      id: makeId("proj"),
      title: b.title,
      location: b.location ?? null,
      category: b.category ?? "Building",
      propertyType: b.propertyType ?? null,
      description: b.description,
      scope: b.scope ?? null,
      coverImage: b.coverImage ?? null,
      images: Array.isArray(b.images) ? b.images : [],
      materialsUsed: Array.isArray(b.materialsUsed) ? b.materialsUsed : [],
      featured: !!b.featured,
      published: b.published !== false,
      sortOrder: Number(b.sortOrder) || 0,
    })
    .returning();
  return NextResponse.json(row, { status: 201 });
}
