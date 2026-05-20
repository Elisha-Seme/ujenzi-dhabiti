import { NextRequest, NextResponse } from "next/server";
import { db, sellers, products } from "@/lib/db";
import { eq, and } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [seller] = await db
      .select()
      .from(sellers)
      .where(and(eq(sellers.id, params.id), eq(sellers.status, "approved")))
      .limit(1);

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    const sellerProducts = await db
      .select()
      .from(products)
      .where(and(eq(products.sellerId, params.id), eq(products.isActive, true)));

    return NextResponse.json({ seller, products: sellerProducts });
  } catch (err) {
    console.error("[GET /api/sellers/:id]", err);
    return NextResponse.json({ error: "Failed to fetch seller" }, { status: 500 });
  }
}
