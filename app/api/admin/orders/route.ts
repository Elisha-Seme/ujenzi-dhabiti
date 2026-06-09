import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, orders, orderItems, users } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const orderRows = await db
    .select({
      id: orders.id,
      buyerId: orders.buyerId,
      buyerName: users.name,
      buyerEmail: users.email,
      status: orders.status,
      paymentMethod: orders.paymentMethod,
      guestName: orders.guestName,
      guestEmail: orders.guestEmail,
      guestPhone: orders.guestPhone,
      deliveryAddress: orders.deliveryAddress,
      deliveryCity: orders.deliveryCity,
      deliveryCounty: orders.deliveryCounty,
      subtotalKES: orders.subtotalKES,
      platformFeeKES: orders.platformFeeKES,
      totalKES: orders.totalKES,
      depositKES: orders.depositKES,
      trackingNumber: orders.trackingNumber,
      dispatchedAt: orders.dispatchedAt,
      deliveredAt: orders.deliveredAt,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .leftJoin(users, eq(orders.buyerId, users.id));

  const orderIds = orderRows.map((o) => o.id);
  const items = orderIds.length
    ? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
    : [];
  const result = orderRows
    .map((order) => ({
      ...order,
      customerName: order.buyerName ?? order.guestName,
      customerEmail: order.buyerEmail ?? order.guestEmail,
      items: items.filter((item) => item.orderId === order.id),
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(result);
}
