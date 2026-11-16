import { NextRequest, NextResponse } from "next/server";
import { db, services, serviceSubsections } from "@/lib/db";
import { and, eq, ne } from "drizzle-orm";
import { isAdmin } from "@/lib/admin-guard";
import { parseLabourInput } from "@/lib/services/labour";
import { isMissingColumnError, LABOUR_MIGRATION_MESSAGE } from "@/lib/services/subsections-read";

export async function PATCH(req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  // Explicit columns: a bare select() would also read the 0016 labour columns.
  const [existing] = await db
    .select({ id: serviceSubsections.id, serviceSlug: serviceSubsections.serviceSlug, sectionId: serviceSubsections.sectionId })
    .from(serviceSubsections).where(eq(serviceSubsections.id, params.id)).limit(1);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const required = ["serviceSlug", "sectionId", "title", "body"] as const;
  for (const key of required) {
    if (b[key] !== undefined && (typeof b[key] !== "string" || !b[key].trim())) {
      return NextResponse.json({ error: `${key} is required` }, { status: 400 });
    }
  }
  const serviceSlug = b.serviceSlug?.trim() ?? existing.serviceSlug;
  const sectionId = b.sectionId?.trim() ?? existing.sectionId;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sectionId)) {
    return NextResponse.json({ error: "Section Anchor ID must be a lowercase URL slug" }, { status: 400 });
  }
  const [parent] = await db.select({ id: services.id }).from(services).where(eq(services.slug, serviceSlug)).limit(1);
  if (!parent) return NextResponse.json({ error: "Parent service not found" }, { status: 400 });
  const [duplicate] = await db.select({ id: serviceSubsections.id }).from(serviceSubsections)
    .where(and(eq(serviceSubsections.serviceSlug, serviceSlug), eq(serviceSubsections.sectionId, sectionId), ne(serviceSubsections.id, params.id))).limit(1);
  if (duplicate) return NextResponse.json({ error: "This section anchor already exists for the selected service" }, { status: 409 });

  const patch: Record<string, unknown> = { updatedAt: new Date(), serviceSlug, sectionId };
  for (const key of ["title", "body"] as const) {
    if (b[key] !== undefined) patch[key] = b[key].trim();
  }
  if (b.planType !== undefined) patch.planType = b.planType || null;
  if (b.bullets !== undefined) patch.bullets = Array.isArray(b.bullets) ? b.bullets : [];
  if (b.sortOrder !== undefined) patch.sortOrder = Number(b.sortOrder) || 0;
  if (b.labourRateKES !== undefined || b.labourUnit !== undefined) {
    const labour = parseLabourInput(b.labourRateKES, b.labourUnit);
    if (!labour.ok) return NextResponse.json({ error: labour.error }, { status: 400 });
    patch.labourRateKES = labour.labourRateKES;
    patch.labourUnit = labour.labourUnit;
  }

  try {
    const [row] = await db.update(serviceSubsections).set(patch).where(eq(serviceSubsections.id, params.id)).returning();
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    if (isMissingColumnError(err)) return NextResponse.json({ error: LABOUR_MIGRATION_MESSAGE }, { status: 503 });
    throw err;
  }
}

export async function DELETE(_req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.delete(serviceSubsections).where(eq(serviceSubsections.id, params.id));
  return NextResponse.json({ success: true });
}
