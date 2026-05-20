import { NextRequest, NextResponse } from "next/server";
import { db, products, sellers } from "@/lib/db";
import { eq, and, gte, lte, ilike, or, asc, desc } from "drizzle-orm";
import { PRODUCTS as STATIC_PRODUCTS } from "@/lib/products";
import { SELLERS as STATIC_SELLERS } from "@/lib/sellers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.trim();
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStockOnly = searchParams.get("inStock") === "true";
    const sortBy = searchParams.get("sort") ?? "name";
    const sellerId = searchParams.get("sellerId");

    // Build filter conditions
    const conditions = [eq(products.isActive, true)];

    if (category && category !== "All") {
      conditions.push(eq(products.category, category));
    }
    if (sellerId) {
      conditions.push(eq(products.sellerId, sellerId));
    }
    if (minPrice) {
      conditions.push(gte(products.priceKES, Number(minPrice)));
    }
    if (maxPrice) {
      conditions.push(lte(products.priceKES, Number(maxPrice)));
    }
    if (inStockOnly) {
      conditions.push(gte(products.stock, 1));
    }
    if (search) {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`),
          ilike(products.category, `%${search}%`)
        )!
      );
    }

    const orderBy =
      sortBy === "price-asc" ? asc(products.priceKES) :
      sortBy === "price-desc" ? desc(products.priceKES) :
      sortBy === "newest" ? desc(products.createdAt) :
      asc(products.name);

    const rows = await db
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
        sellerId: products.sellerId,
        sellerName: sellers.businessName,
        sellerVerified: sellers.verified,
        sellerRating: sellers.rating,
        sellerReviewCount: sellers.reviewCount,
      })
      .from(products)
      .innerJoin(sellers, eq(products.sellerId, sellers.id))
      .where(and(...conditions))
      .orderBy(orderBy);

    // Client-side relevance re-ranking happens in the browser for search
    return NextResponse.json({ products: rows });
  } catch (err) {
    console.error("[GET /api/products]", err);
    return NextResponse.json({ products: getStaticProductsFallback(req) });
  }
}

function getStaticProductsFallback(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category");
  const search = searchParams.get("search")?.trim().toLowerCase();
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const inStockOnly = searchParams.get("inStock") === "true";
  const sellerId = searchParams.get("sellerId");
  const sortBy = searchParams.get("sort") ?? "name";

  let rows = STATIC_PRODUCTS.filter((product) => {
    if (category && category !== "All" && product.category !== category) return false;
    if (sellerId && product.sellerId !== sellerId) return false;
    if (minPrice && product.priceKES < Number(minPrice)) return false;
    if (maxPrice && product.priceKES > Number(maxPrice)) return false;
    if (inStockOnly && !product.inStock) return false;
    if (search) {
      const seller = STATIC_SELLERS.find((s) => s.id === product.sellerId);
      const specText = product.specs ? Object.values(product.specs).join(" ") : "";
      const haystack = `${product.name} ${product.category} ${product.description} ${specText} ${seller?.name ?? ""}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  }).map((product) => {
    const seller = STATIC_SELLERS.find((s) => s.id === product.sellerId);
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      priceKES: product.priceKES,
      unit: product.unit,
      stock: product.inStock ? 1 : 0,
      images: [product.image],
      specs: product.specs ?? null,
      sellerId: product.sellerId,
      sellerName: seller?.name ?? "Unknown Seller",
      sellerVerified: seller?.verified ?? false,
      sellerRating: seller ? Math.round(seller.rating * 10) : 0,
      sellerReviewCount: seller?.reviewCount ?? 0,
    };
  });

  rows = rows.sort((a, b) => {
    if (sortBy === "price-asc") return a.priceKES - b.priceKES;
    if (sortBy === "price-desc") return b.priceKES - a.priceKES;
    return a.name.localeCompare(b.name);
  });

  return rows;
}
