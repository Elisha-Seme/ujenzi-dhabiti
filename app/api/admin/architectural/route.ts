import { NextRequest, NextResponse } from "next/server";
import { db, architecturalServices } from "@/lib/db";
import { desc } from "drizzle-orm";
import { isAdmin, makeId } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const rows = await db
    .select()
    .from(architecturalServices)
    .orderBy(desc(architecturalServices.sortOrder), desc(architecturalServices.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b.title || !b.body) {
    return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
  }
  const [row] = await db
    .insert(architecturalServices)
    .values({
      id: makeId("arch"),
      title: b.title,
      summary: b.summary ?? null,
      body: b.body,
      image: b.image ?? null,
      published: b.published !== false,
      sortOrder: Number(b.sortOrder) || 0,
    })
    .returning();
  return NextResponse.json(row, { status: 201 });
}
