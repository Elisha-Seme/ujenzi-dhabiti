import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, sellers, products } from "@/lib/db";
import { eq, and } from "drizzle-orm";

async function getSellerForUser(userId: string) {
  const [seller] = await db.select().from(sellers).where(eq(sellers.userId, userId)).limit(1);
  return seller ?? null;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const seller = await getSellerForUser(session.user.id);
  if (!seller) return NextResponse.json({ error: "Seller profile not found" }, { status: 404 });

  const [existing] = await db.select().from(products)
    .where(and(eq(products.id, params.id), eq(products.sellerId, seller.id)))
    .limit(1);

  if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const body = await req.json();
  const { name, category, description, priceKES, unit, stock, images, specs, isActive } = body;

  const [updated] = await db.update(products).set({
    ...(name !== undefined && { name: String(name).trim() }),
    ...(category !== undefined && { category: String(category).trim() }),
    ...(description !== undefined && { description: String(description).trim() }),
    ...(priceKES !== undefined && { priceKES: Math.round(Number(priceKES)) }),
    ...(unit !== undefined && { unit: String(unit).trim() }),
    ...(stock !== undefined && { stock: Number(stock) }),
    ...(images !== undefined && { images: Array.isArray(images) ? images : [] }),
    ...(specs !== undefined && { specs }),
    ...(isActive !== undefined && { isActive: Boolean(isActive) }),
    updatedAt: new Date(),
  }).where(and(eq(products.id, params.id), eq(products.sellerId, seller.id))).returning();

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const seller = await getSellerForUser(session.user.id);
  if (!seller) return NextResponse.json({ error: "Seller profile not found" }, { status: 404 });

  const deleted = await db.delete(products)
    .where(and(eq(products.id, params.id), eq(products.sellerId, seller.id)))
    .returning();

  if (!deleted.length) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
