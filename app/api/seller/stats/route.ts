import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, sellers, products, orders, orderItems } from "@/lib/db";
import { eq, and, inArray, sql } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [seller] = await db.select().from(sellers).where(eq(sellers.userId, session.user.id)).limit(1);
  if (!seller) return NextResponse.json({ error: "Seller profile not found" }, { status: 404 });

  const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(products)
    .where(and(eq(products.sellerId, seller.id), eq(products.isActive, true)));

  const myItems = await db.select().from(orderItems).where(eq(orderItems.sellerId, seller.id));

  const totalRevenue = myItems.reduce((sum, i) => sum + i.priceKES * i.quantity, 0);
  const totalItemsSold = myItems.reduce((sum, i) => sum + i.quantity, 0);

  const orderIds = Array.from(new Set(myItems.map((i) => i.orderId)));
  let pendingCount = 0;

  if (orderIds.length) {
    const parentOrders = await db.select({ status: orders.status }).from(orders)
      .where(inArray(orders.id, orderIds));
    pendingCount = parentOrders.filter((o) => o.status === "paid" || o.status === "processing").length;
  }

  return NextResponse.json({
    activeProducts: Number(productCount?.count ?? 0),
    totalRevenue,
    totalItemsSold,
    pendingOrders: pendingCount,
    sellerName: seller.businessName,
    status: seller.status,
    verified: seller.verified,
  });
}
