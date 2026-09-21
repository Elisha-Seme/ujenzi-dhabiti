import { NextRequest, NextResponse } from "next/server";
import { db, orders, payments, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { initFlutterwavePayment } from "@/lib/flutterwave";
import { auth } from "@/lib/auth";
import { createOrderAccessToken, normalizeOrderIdentity } from "@/lib/order-access";

export async function POST(req: NextRequest) {
  try {
    const { orderId, customerPhone, customerEmail } = await req.json();
    if (!orderId) return NextResponse.json({ error: "orderId is required" }, { status: 400 });

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.status !== "pending") return NextResponse.json({ error: "Order already paid" }, { status: 400 });

    const session = await auth();
    if (order.buyerId) {
      if (session?.user?.id !== order.buyerId) {
        return NextResponse.json({ error: "You are not authorized to pay for this order" }, { status: 403 });
      }
    } else if (
      typeof customerEmail !== "string" ||
      !order.guestEmail ||
      normalizeOrderIdentity(customerEmail) !== normalizeOrderIdentity(order.guestEmail)
    ) {
      return NextResponse.json({ error: "The email used at checkout is required" }, { status: 403 });
    }

    // For logged-in users, guestEmail/guestName are null — fetch from users table
    let buyerEmail = order.guestEmail ?? "";
    let buyerName = order.guestName ?? "";
    if (order.buyerId && (!buyerEmail || !buyerName)) {
      const [user] = await db.select({ name: users.name, email: users.email })
        .from(users).where(eq(users.id, order.buyerId)).limit(1);
      if (user) {
        buyerEmail = buyerEmail || user.email;
        buyerName = buyerName || user.name;
      }
    }
    if (!buyerEmail) return NextResponse.json({ error: "Buyer email not found on order" }, { status: 400 });
    buyerName = buyerName || "Customer";

    const buyerPhone = customerPhone ?? order.guestPhone ?? "";

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const trackingToken = createOrderAccessToken(orderId, buyerEmail);
    const redirectUrl = `${baseUrl}/shop/checkout/confirm?orderId=${encodeURIComponent(orderId)}&provider=flutterwave&token=${encodeURIComponent(trackingToken)}`;

    const { paymentLink, txRef } = await initFlutterwavePayment(
      orderId,
      order.depositKES ?? order.totalKES,
      buyerEmail,
      buyerName,
      buyerPhone,
      redirectUrl
    );

    // Store the tx_ref so we can match it in the webhook
    await db.update(payments).set({ externalRef: txRef }).where(eq(payments.orderId, orderId));

    return NextResponse.json({ paymentLink });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/payments/flutterwave/initiate]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
