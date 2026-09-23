import { NextRequest, NextResponse } from "next/server";
import { db, services, serviceSubsections } from "@/lib/db";
import { and, asc, eq } from "drizzle-orm";
import { isAdmin, makeId } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const rows = await db.select().from(serviceSubsections).orderBy(asc(serviceSubsections.serviceSlug), asc(serviceSubsections.sortOrder));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if ([b.title, b.serviceSlug, b.sectionId, b.body].some((v) => typeof v !== "string" || !v.trim())) {
    return NextResponse.json({ error: "Title, serviceSlug, sectionId, and body are required" }, { status: 400 });
  }
  const serviceSlug = b.serviceSlug.trim();
  const sectionId = b.sectionId.trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sectionId)) {
    return NextResponse.json({ error: "Section Anchor ID must be a lowercase URL slug" }, { status: 400 });
  }
  const [parent] = await db.select({ id: services.id }).from(services).where(eq(services.slug, serviceSlug)).limit(1);
  if (!parent) return NextResponse.json({ error: "Parent service not found" }, { status: 400 });
  const [duplicate] = await db.select({ id: serviceSubsections.id }).from(serviceSubsections)
    .where(and(eq(serviceSubsections.serviceSlug, serviceSlug), eq(serviceSubsections.sectionId, sectionId))).limit(1);
  if (duplicate) return NextResponse.json({ error: "This section anchor already exists for the selected service" }, { status: 409 });
  const [row] = await db
    .insert(serviceSubsections)
    .values({
      id: makeId("sub"),
      serviceSlug,
      sectionId,
      title: b.title.trim(),
      body: b.body.trim(),
      planType: b.planType || null,
      bullets: Array.isArray(b.bullets) ? b.bullets : [],
      sortOrder: Number(b.sortOrder) || 0,
    })
    .returning();
  return NextResponse.json(row, { status: 201 });
}
