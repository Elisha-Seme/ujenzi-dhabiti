import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, serviceMaterialPackages } from "@/lib/db";
import { isAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const [row] = await db.update(serviceMaterialPackages).set({
    serviceSlug: body.serviceSlug,
    subsectionId: body.subsectionId || null,
    title: body.title,
    description: body.description || null,
    productIds: Array.isArray(body.productIds) ? body.productIds : [],
    quantityGuidance: body.quantityGuidance || null,
    published: body.published !== false,
    sortOrder: Number(body.sortOrder) || 0,
    updatedAt: new Date(),
  }).where(eq(serviceMaterialPackages.id, params.id)).returning();
  return NextResponse.json(row);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.delete(serviceMaterialPackages).where(eq(serviceMaterialPackages.id, params.id));
  return NextResponse.json({ success: true });
}
