import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, orders, orderItems } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orderRows = await db.select().from(orders).where(eq(orders.buyerId, session.user.id));
  if (!orderRows.length) return NextResponse.json([]);

  const orderIds = orderRows.map((o) => o.id);
  const items = await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds));

  const result = orderRows
    .map((order) => ({
      ...order,
      items: items.filter((item) => item.orderId === order.id),
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(result);
}
