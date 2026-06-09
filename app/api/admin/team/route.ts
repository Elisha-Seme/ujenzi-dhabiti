import { NextRequest, NextResponse } from "next/server";
import { db, teamMembers } from "@/lib/db";
import { asc } from "drizzle-orm";
import { isAdmin, makeId } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const rows = await db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b.name || !b.title) {
    return NextResponse.json({ error: "Name and title are required" }, { status: 400 });
  }
  const [row] = await db
    .insert(teamMembers)
    .values({
      id: makeId("team"),
      name: b.name,
      title: b.title,
      image: b.image || null,
      sortOrder: Number(b.sortOrder) || 0,
    })
    .returning();
  return NextResponse.json(row, { status: 201 });
}
