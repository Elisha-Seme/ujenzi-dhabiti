import { NextRequest, NextResponse } from "next/server";
import { db, services, serviceSubsections } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { isAdmin, makeId } from "@/lib/admin-guard";
import { parseLabourInput } from "@/lib/services/labour";
import { isMissingColumnError, LABOUR_MIGRATION_MESSAGE, readSubsections } from "@/lib/services/subsections-read";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const rows = await readSubsections();
  rows.sort((a, b) => a.serviceSlug.localeCompare(b.serviceSlug) || a.sortOrder - b.sortOrder);
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
  const labour = parseLabourInput(b.labourRateKES, b.labourUnit);
  if (!labour.ok) return NextResponse.json({ error: labour.error }, { status: 400 });
  try {
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
        labourRateKES: labour.labourRateKES,
        labourUnit: labour.labourUnit,
        sortOrder: Number(b.sortOrder) || 0,
      })
      .returning();
    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    if (isMissingColumnError(err)) return NextResponse.json({ error: LABOUR_MIGRATION_MESSAGE }, { status: 503 });
    throw err;
  }
}
