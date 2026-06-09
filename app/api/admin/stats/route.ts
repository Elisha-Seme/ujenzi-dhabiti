import { NextRequest, NextResponse } from "next/server";
import { db, companyStats } from "@/lib/db";
import { asc } from "drizzle-orm";
import { isAdmin, makeId } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const rows = await db.select().from(companyStats).orderBy(asc(companyStats.sortOrder));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b.value || !b.label) {
    return NextResponse.json({ error: "Value and label are required" }, { status: 400 });
  }
  const [row] = await db
    .insert(companyStats)
    .values({
      id: makeId("stat"),
      value: b.value,
      label: b.label,
      sortOrder: Number(b.sortOrder) || 0,
    })
    .returning();
  return NextResponse.json(row, { status: 201 });
}
