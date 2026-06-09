import { NextRequest, NextResponse } from "next/server";
import { db, products } from "@/lib/db";
import { desc } from "drizzle-orm";
import { isAdmin, makeId } from "@/lib/admin-guard";
import { PRODUCTS } from "@/lib/products";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const rows = await db.select().from(products).orderBy(desc(products.createdAt));
    return NextResponse.json(rows);
  } catch {
    // Table not reachable — show the static catalogue read-only so the panel isn't blank.
    return NextResponse.json(
      PRODUCTS.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        description: p.description,
        priceKES: p.priceKES,
        unit: p.unit,
        stock: p.inStock ? 1 : 0,
        images: [p.image],
        specs: p.specs ?? null,
        isActive: true,
        _static: true,
      }))
    );
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b.name || !b.category || !b.description || !b.unit) {
    return NextResponse.json({ error: "Name, category, unit and description are required" }, { status: 400 });
  }
  const [row] = await db
    .insert(products)
    .values({
      id: makeId("prod"),
      sellerId: null, // single-vendor: Ujenzi Dhabiti's own stock
      name: b.name,
      category: b.category,
      description: b.description,
      priceKES: Number(b.priceKES) || 0,
      unit: b.unit,
      stock: Number(b.stock) || 0,
      images: Array.isArray(b.images) ? b.images : [],
      specs: b.specs && typeof b.specs === "object" ? b.specs : {},
      isActive: b.isActive !== false,
    })
    .returning();
  return NextResponse.json(row, { status: 201 });
}
