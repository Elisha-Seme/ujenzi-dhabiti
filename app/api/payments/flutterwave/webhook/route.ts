import { NextRequest, NextResponse } from "next/server";
import { db, payments, orders } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { verifyFlutterwaveTransaction } from "@/lib/flutterwave";
import { notifyAfterPayment } from "@/lib/payment-notifications";

export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature
    const hash = req.headers.get("verif-hash");
    const expectedHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
    if (hash !== expectedHash) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (body.event !== "charge.completed") {
      return NextResponse.json({ received: true });
    }

    const { id: transactionId, tx_ref, meta } = body.data ?? {};
    const orderId = meta?.orderId ?? tx_ref?.split("-")[1];

    if (!orderId) return NextResponse.json({ received: true });

    // Bind the provider event to the exact pending Flutterwave payment before
    // changing any order state. Never use a webhook-supplied order ID alone.
    const [payment] = await db
      .select()
      .from(payments)
      .where(and(eq(payments.orderId, orderId), eq(payments.provider, "flutterwave")))
      .limit(1);
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!payment || !order || payment.status === "success" || order.status === "paid") {
      return NextResponse.json({ received: true });
    }

    // Double-verify with Flutterwave API (never trust webhook payload alone)
    const verified = await verifyFlutterwaveTransaction(String(transactionId));
    if (verified.status !== "successful") {
      await db.update(payments).set({ status: "failed", metadata: body }).where(eq(payments.id, payment.id));
      return NextResponse.json({ received: true });
    }

    const expectedAmount = order.depositKES ?? order.totalKES;
    if (
      !payment.externalRef ||
      typeof tx_ref !== "string" ||
      verified.txRef !== payment.externalRef ||
      tx_ref !== payment.externalRef ||
      verified.amountKES !== payment.amountKES ||
      verified.amountKES !== expectedAmount ||
      verified.currency !== "KES"
    ) {
      console.error("[flutterwave/webhook] payment verification mismatch", { orderId, paymentId: payment.id });
      await db.update(payments).set({
        status: "failed",
        metadata: { ...body, _reason: "verification_mismatch" },
      }).where(eq(payments.id, payment.id));
      return NextResponse.json({ received: true });
    }

    const now = new Date();
    await db.update(payments).set({
      status: "success",
      externalRef: payment.externalRef,
      paidAt: now,
      metadata: body,
    }).where(eq(payments.id, payment.id));

    await db.update(orders).set({ status: "paid", updatedAt: now }).where(eq(orders.id, orderId));
    await notifyAfterPayment(orderId);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[POST /api/payments/flutterwave/webhook]", err);
    return NextResponse.json({ received: true });
  }
}
