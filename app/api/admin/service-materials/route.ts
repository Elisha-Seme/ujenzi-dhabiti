import { NextRequest, NextResponse } from "next/server";
import { asc, eq, inArray } from "drizzle-orm";
import { db, products, services } from "@/lib/db";
import { isAdmin } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const [serviceRows, productRows] = await Promise.all([
      db.select({ id: services.id, slug: services.slug, title: services.title, materialProductIds: services.materialProductIds })
        .from(services).orderBy(asc(services.sortOrder)),
      db.select({ id: products.id, name: products.name, category: products.category, priceKES: products.priceKES, isActive: products.isActive })
        .from(products).orderBy(asc(products.category), asc(products.name)),
    ]);
    return NextResponse.json({ services: serviceRows, products: productRows });
  } catch {
    return NextResponse.json({ error: "Could not load service materials" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body.serviceId !== "string" || !Array.isArray(body.productIds) ||
      body.productIds.length > 100 || body.productIds.some((id: unknown) => typeof id !== "string" || !id.trim())) {
    return NextResponse.json({ error: "A service and up to 100 product IDs are required" }, { status: 400 });
  }
  const productIds = Array.from(new Set<string>(body.productIds));
  try {
    const [service] = await db.select({ id: services.id }).from(services).where(eq(services.id, body.serviceId)).limit(1);
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });
    if (productIds.length) {
      const valid = await db.select({ id: products.id }).from(products).where(inArray(products.id, productIds));
      if (valid.length !== productIds.length) {
        return NextResponse.json({ error: "One or more products no longer exist" }, { status: 400 });
      }
    }
    const [updated] = await db.update(services)
      .set({ materialProductIds: productIds, updatedAt: new Date() })
      .where(eq(services.id, service.id))
      .returning({ id: services.id, materialProductIds: services.materialProductIds });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Could not save service materials" }, { status: 500 });
  }
}
