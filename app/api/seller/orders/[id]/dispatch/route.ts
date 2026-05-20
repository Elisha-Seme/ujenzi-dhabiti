import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, sellers, orders, orderItems } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { sendDispatchNotification } from "@/lib/email";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [seller] = await db.select().from(sellers).where(eq(sellers.userId, session.user.id)).limit(1);
  if (!seller) return NextResponse.json({ error: "Seller profile not found" }, { status: 404 });

  const body = await req.json();
  const trackingNumber: string | null = body.trackingNumber ?? null;

  const now = new Date();

  // Mark only this seller's items in the order as dispatched
  await db.update(orderItems).set({
    dispatched: true,
    dispatchedAt: now,
    trackingNumber,
  }).where(and(eq(orderItems.orderId, params.id), eq(orderItems.sellerId, seller.id)));

  // Check if ALL items in the order are now dispatched
  const allItems = await db.select().from(orderItems).where(eq(orderItems.orderId, params.id));
  const allDispatched = allItems.length > 0 && allItems.every((i) => i.dispatched);

  if (allDispatched) {
    await db.update(orders).set({
      status: "dispatched",
      dispatchedAt: now,
      trackingNumber: trackingNumber ?? undefined,
      updatedAt: now,
    }).where(eq(orders.id, params.id));
  }

  // Notify the buyer regardless (even partial dispatch is worth telling them)
  try {
    const [order] = await db.select().from(orders).where(eq(orders.id, params.id)).limit(1);
    if (order) {
      const buyerName = order.guestName ?? "Customer";
      const buyerEmail = order.guestEmail;
      if (buyerEmail) {
        await sendDispatchNotification(buyerEmail, buyerName, params.id, trackingNumber);
      }
    }
  } catch (emailErr) {
    // Don't fail the request if email fails
    console.error("[dispatch email]", emailErr);
  }

  return NextResponse.json({ success: true, allDispatched });
}
