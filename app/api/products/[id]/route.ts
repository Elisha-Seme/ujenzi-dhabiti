import { NextRequest, NextResponse } from "next/server";
import { db, products } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getProduct } from "@/lib/products";

export const dynamic = "force-dynamic";

// Single materials product — DB first, static catalogue as fallback.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [row] = await db
      .select({
        id: products.id,
        name: products.name,
        category: products.category,
        description: products.description,
        priceKES: products.priceKES,
        unit: products.unit,
        stock: products.stock,
        images: products.images,
        specs: products.specs,
        coverageSqmPerUnit: products.coverageSqmPerUnit,
        brand: products.brand,
        materialType: products.materialType,
      })
      .from(products)
      .where(eq(products.id, params.id))
      .limit(1);
    if (row) return NextResponse.json(row);
  } catch {
    /* fall through to static */
  }

  const p = getProduct(params.id);
  if (!p) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    priceKES: p.priceKES,
    unit: p.unit,
    stock: p.inStock ? 100 : 0,
    images: [p.image],
    specs: p.specs ?? null,
    coverageSqmPerUnit: p.coverageSqmPerUnit ?? null,
    brand: p.brand ?? null,
    materialType: p.materialType ?? null,
  });
}
