import { NextRequest, NextResponse } from "next/server";
import { db, orders, payments, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { initFlutterwavePayment } from "@/lib/flutterwave";

export async function POST(req: NextRequest) {
  try {
    const { orderId, customerPhone } = await req.json();
    if (!orderId) return NextResponse.json({ error: "orderId is required" }, { status: 400 });

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.status !== "pending") return NextResponse.json({ error: "Order already paid" }, { status: 400 });

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
    const redirectUrl = `${baseUrl}/shop/checkout/confirm?orderId=${orderId}&provider=flutterwave`;

    const { paymentLink, txRef } = await initFlutterwavePayment(
      orderId,
      order.totalKES,
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
