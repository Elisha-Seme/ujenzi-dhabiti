import { db, orders, orderItems, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { sendOrderConfirmation } from "@/lib/email";
import { findPlanByOrderItemAsync } from "@/lib/plans-store";
import { buildDownloadUrl } from "@/lib/download-tokens";

const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

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
      // Build signed download links for any digital plan items with a real asset.
      const downloads = (
        await Promise.all(
          items.map(async (i) => {
            const match = await findPlanByOrderItemAsync(i.productName);
            if (!match || match.mode !== "digital" || !match.plan.downloadFile) return null;
            return { label: match.plan.name, url: buildDownloadUrl(BASE_URL, orderId, match.plan.id) };
          })
        )
      ).filter((d): d is { label: string; url: string } => d !== null);

      const deposit =
        order.depositKES != null && order.depositKES < order.totalKES
          ? { depositKES: order.depositKES, balanceKES: order.totalKES - order.depositKES }
          : null;

      await sendOrderConfirmation(
        buyerEmail,
        buyerName,
        orderId,
        items.map((i) => ({
          productName: i.productName,
          quantity: i.quantity,
          priceKES: i.priceKES,
        })),
        order.totalKES,
        downloads,
        deposit
      );
    }
  } catch (err) {
    console.error("notifyAfterPayment error:", err);
  }
}
