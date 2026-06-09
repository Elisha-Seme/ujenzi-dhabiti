import { NextRequest, NextResponse } from "next/server";
import { db, serviceSubsections } from "@/lib/db";
import { asc } from "drizzle-orm";
import { isAdmin, makeId } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const rows = await db.select().from(serviceSubsections).orderBy(asc(serviceSubsections.serviceSlug), asc(serviceSubsections.sortOrder));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b.title || !b.serviceSlug || !b.sectionId || !b.body) {
    return NextResponse.json({ error: "Title, serviceSlug, sectionId, and body are required" }, { status: 400 });
  }
  const [row] = await db
    .insert(serviceSubsections)
    .values({
      id: makeId("sub"),
      serviceSlug: b.serviceSlug,
      sectionId: b.sectionId,
      title: b.title,
      body: b.body,
      planType: b.planType || null,
      bullets: Array.isArray(b.bullets) ? b.bullets : [],
      sortOrder: Number(b.sortOrder) || 0,
    })
    .returning();
  return NextResponse.json(row, { status: 201 });
}
