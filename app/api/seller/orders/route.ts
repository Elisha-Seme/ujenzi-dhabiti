import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, sellers, orders, orderItems } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [seller] = await db.select().from(sellers).where(eq(sellers.userId, session.user.id)).limit(1);
  if (!seller) return NextResponse.json({ error: "Seller profile not found" }, { status: 404 });

  // Get all order items belonging to this seller
  const myItems = await db.select().from(orderItems).where(eq(orderItems.sellerId, seller.id));

  if (!myItems.length) return NextResponse.json([]);

  // Fetch the parent orders
  const orderIds = Array.from(new Set(myItems.map((i) => i.orderId)));
  const parentOrders = await db.select().from(orders).where(inArray(orders.id, orderIds));

  // Merge: attach only this seller's items to each order
  const result = parentOrders.map((order) => ({
    ...order,
    items: myItems.filter((i) => i.orderId === order.id),
  }));

  // Sort newest first
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(result);
}
