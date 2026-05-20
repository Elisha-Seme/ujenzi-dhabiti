import { NextRequest, NextResponse } from "next/server";
import { db, payments, orders } from "@/lib/db";
import { eq } from "drizzle-orm";
import { notifyAfterPayment } from "@/lib/payment-notifications";

// Public route — Safaricom calls this directly. We validate via the
// shared-secret URL segment instead of headers/signatures because Daraja
// doesn't sign its callbacks.
//
// IMPORTANT: We ALWAYS return { ResultCode: 0 } to Safaricom regardless of
// internal failures — otherwise Safaricom retries forever and floods us.
export async function POST(
  req: NextRequest,
  { params }: { params: { secret: string } }
) {
  const ACK = { ResultCode: 0, ResultDesc: "Accepted" };

  // ─── 1. Validate the shared secret in the URL ──────────────────
  const expectedSecret = process.env.DARAJA_CALLBACK_SECRET;
  if (!expectedSecret) {
    console.error("[mpesa/callback] DARAJA_CALLBACK_SECRET not configured");
    return NextResponse.json(ACK);
  }
  if (params.secret !== expectedSecret) {
    console.warn("[mpesa/callback] REJECTED: wrong secret from", req.headers.get("x-forwarded-for"));
    return NextResponse.json(ACK);
  }

  try {
    const body = await req.json();
    const stk = body?.Body?.stkCallback;

    if (!stk) {
      console.warn("[mpesa/callback] No stkCallback in body");
      return NextResponse.json(ACK);
    }

    const checkoutRequestId: string = stk.CheckoutRequestID;
    const resultCode: number = stk.ResultCode;

    // ─── 2. Look up the payment by CheckoutRequestID ────────────
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.externalRef, checkoutRequestId))
      .limit(1);

    if (!payment) {
      console.error("[mpesa/callback] No payment for CheckoutRequestID:", checkoutRequestId);
      return NextResponse.json(ACK);
    }

    // ─── 3. Idempotency: if already terminal, ignore ────────────
    if (payment.status === "success") {
      console.log("[mpesa/callback] Duplicate callback for already-paid", payment.orderId);
      return NextResponse.json(ACK);
    }
    if (payment.status === "failed") {
      // A retry of a failure callback — also harmless to ignore
      console.log("[mpesa/callback] Duplicate failure callback for", payment.orderId);
      return NextResponse.json(ACK);
    }

    // ─── 4. Handle failure cases ───────────────────────────────
    if (resultCode !== 0) {
      await db.update(payments).set({
        status: "failed",
        metadata: body,
      }).where(eq(payments.id, payment.id));
      console.log(`[mpesa/callback] FAILED ${payment.orderId} (code=${resultCode}): ${stk.ResultDesc}`);
      return NextResponse.json(ACK);
    }

    // ─── 5. Parse callback metadata ────────────────────────────
    const meta = stk.CallbackMetadata?.Item ?? [];
    const getMeta = (name: string) =>
      meta.find((i: { Name: string; Value?: unknown }) => i.Name === name)?.Value;

    const mpesaRef = String(getMeta("MpesaReceiptNumber") ?? "");
    const transAmount = Number(getMeta("Amount") ?? 0);
    const phoneNumber = String(getMeta("PhoneNumber") ?? "");

    // ─── 6. Look up the order, double-check status ──────────────
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, payment.orderId))
      .limit(1);

    if (!order) {
      console.error("[mpesa/callback] Order not found:", payment.orderId);
      return NextResponse.json(ACK);
    }

    if (order.status === "paid" || order.status === "processing" || order.status === "dispatched" || order.status === "delivered") {
      // Order already marked as paid (perhaps by an out-of-order callback or admin action) — don't re-process
      console.log("[mpesa/callback] Order already paid:", order.id);
      return NextResponse.json(ACK);
    }

    // ─── 7. Verify the amount matches what we expected ──────────
    if (transAmount > 0 && transAmount !== order.totalKES) {
      console.error(
        `[mpesa/callback] AMOUNT MISMATCH for ${order.id}: expected ${order.totalKES}, got ${transAmount}`
      );
      await db.update(payments).set({
        status: "failed",
        metadata: { ...body, _reason: "amount_mismatch", _expected: order.totalKES },
      }).where(eq(payments.id, payment.id));
      return NextResponse.json(ACK);
    }

    // ─── 8. Mark paid (atomic-ish: payment first, then order) ───
    const paidAt = new Date();

    await db.update(payments).set({
      status: "success",
      externalRef: mpesaRef || checkoutRequestId,
      paidAt,
      metadata: { ...body, _phoneNumber: phoneNumber },
    }).where(eq(payments.id, payment.id));

    await db.update(orders).set({
      status: "paid",
      updatedAt: paidAt,
    }).where(eq(orders.id, payment.orderId));

    console.log(`[mpesa/callback] SUCCESS ${order.id} ${mpesaRef} from ${phoneNumber}`);

    // ─── 9. Fire-and-forget notifications ──────────────────────
    notifyAfterPayment(payment.orderId).catch((err) => {
      console.error("[mpesa/callback] notify failed:", err);
    });

    return NextResponse.json(ACK);
  } catch (err) {
    console.error("[mpesa/callback] EXCEPTION:", err);
    // Always 200 to Safaricom — we'll find the issue in logs
    return NextResponse.json(ACK);
  }
}
