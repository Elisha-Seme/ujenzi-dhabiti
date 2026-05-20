import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, sellers, products } from "@/lib/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

async function getSellerForUser(userId: string) {
  const [seller] = await db.select().from(sellers).where(eq(sellers.userId, userId)).limit(1);
  return seller ?? null;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const seller = await getSellerForUser(session.user.id);
  if (!seller) return NextResponse.json({ error: "Seller profile not found" }, { status: 404 });

  const rows = await db.select().from(products).where(eq(products.sellerId, seller.id));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const seller = await getSellerForUser(session.user.id);
  if (!seller) return NextResponse.json({ error: "Seller profile not found" }, { status: 404 });
  if (seller.status !== "approved") return NextResponse.json({ error: "Seller not approved" }, { status: 403 });

  const body = await req.json();
  const { name, category, description, priceKES, unit, stock, images, specs } = body;

  if (!name || !category || !description || !priceKES || !unit) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [product] = await db.insert(products).values({
    id: randomUUID(),
    sellerId: seller.id,
    name: String(name).trim(),
    category: String(category).trim(),
    description: String(description).trim(),
    priceKES: Math.round(Number(priceKES)),
    unit: String(unit).trim(),
    stock: Number(stock) || 0,
    images: Array.isArray(images) ? images : [],
    specs: specs ?? {},
    isActive: true,
  }).returning();

  return NextResponse.json(product, { status: 201 });
}
