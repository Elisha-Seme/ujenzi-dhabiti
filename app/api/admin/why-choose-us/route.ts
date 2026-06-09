import { NextRequest, NextResponse } from "next/server";
import { db, whyChooseUs } from "@/lib/db";
import { asc } from "drizzle-orm";
import { isAdmin, makeId } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const rows = await db.select().from(whyChooseUs).orderBy(asc(whyChooseUs.sortOrder));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b.title || !b.description) {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
  }
  const [row] = await db
    .insert(whyChooseUs)
    .values({
      id: makeId("cho"),
      title: b.title,
      description: b.description,
      iconName: b.iconName ?? "Layers",
      sortOrder: Number(b.sortOrder) || 0,
    })
    .returning();
  return NextResponse.json(row, { status: 201 });
}
