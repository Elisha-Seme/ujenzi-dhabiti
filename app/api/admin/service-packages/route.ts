import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db, serviceMaterialPackages } from "@/lib/db";
import { isAdmin, makeId } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await db.select().from(serviceMaterialPackages).orderBy(asc(serviceMaterialPackages.sortOrder)));
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  if (!body.serviceSlug || !body.title) return NextResponse.json({ error: "Service and title are required" }, { status: 400 });
  const [row] = await db.insert(serviceMaterialPackages).values({
    id: makeId("pkg"),
    serviceSlug: body.serviceSlug,
    subsectionId: body.subsectionId || null,
    title: body.title,
    description: body.description || null,
    productIds: Array.isArray(body.productIds) ? body.productIds : [],
    quantityGuidance: body.quantityGuidance || null,
    published: body.published !== false,
    sortOrder: Number(body.sortOrder) || 0,
  }).returning();
  return NextResponse.json(row, { status: 201 });
}
