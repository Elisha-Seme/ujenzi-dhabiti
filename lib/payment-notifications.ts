import { db, orders, orderItems, sellers, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { sendOrderConfirmation, sendSellerNewOrder } from "@/lib/email";

export async function notifyAfterPayment(orderId: string) {
  try {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) return;

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));

    const buyer = order.buyerId
      ? (await db.select().from(users).where(eq(users.id, order.buyerId)).limit(1))[0]
      : null;

    // Prefer the contact details captured at checkout (guest_*), fall back to
    // the linked user account if those are missing.
    const buyerEmail = order.guestEmail ?? buyer?.email ?? null;
    const buyerName = order.guestName ?? buyer?.name ?? null;
    if (!buyerEmail) {
      console.warn(`[notifyAfterPayment] No buyer email for order ${orderId} — buyer notification skipped`);
    }

    if (buyerEmail && buyerName) {
      await sendOrderConfirmation(
        buyerEmail,
        buyerName,
        orderId,
        items.map((i) => ({
          productName: i.productName,
          quantity: i.quantity,
          priceKES: i.priceKES,
        })),
        order.totalKES
      );
    }

    const sellerIds = Array.from(new Set(items.map((i) => i.sellerId).filter(Boolean) as string[]));
    for (const sellerId of sellerIds) {
      const [seller] = await db.select().from(sellers).where(eq(sellers.id, sellerId)).limit(1);
      if (!seller) continue;

      const [sellerUser] = await db.select().from(users).where(eq(users.id, seller.userId)).limit(1);
      if (!sellerUser?.email) continue;

      const sellerItems = items.filter((i) => i.sellerId === sellerId);
      await sendSellerNewOrder(
        sellerUser.email,
        seller.businessName,
        orderId,
        sellerItems.map((i) => ({
          productName: i.productName,
          quantity: i.quantity,
          priceKES: i.priceKES,
        }))
      );
    }
  } catch (err) {
    console.error("notifyAfterPayment error:", err);
  }
}
