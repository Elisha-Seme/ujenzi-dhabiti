import { NextRequest, NextResponse } from "next/server";
import { db, services, serviceSubsections } from "@/lib/db";
import { and, eq, ne } from "drizzle-orm";
import { isAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const [existing] = await db.select().from(serviceSubsections).where(eq(serviceSubsections.id, params.id)).limit(1);
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

  const [row] = await db.update(serviceSubsections).set(patch).where(eq(serviceSubsections.id, params.id)).returning();
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.delete(serviceSubsections).where(eq(serviceSubsections.id, params.id));
  return NextResponse.json({ success: true });
}
