import { NextRequest, NextResponse } from "next/server";
import { db, payments, orders } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { stkPush, normalizeKenyanPhone } from "@/lib/daraja";

// In-memory de-duplication: blocks repeat initiate calls for the same order
// within the cooldown window. Prevents users from spamming STK pushes.
const recentlyInitiated = new Map<string, number>();
const COOLDOWN_MS = 30_000; // 30 seconds — same as Daraja's STK Push timeout

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderId: string | undefined = body.orderId;
    const phoneRaw: string | undefined = body.phone;

    if (!orderId || !phoneRaw) {
      return NextResponse.json({ error: "orderId and phone are required" }, { status: 400 });
    }

    // ─── 1. Validate phone format up front (before DB hit) ──────────
    let normalizedPhone: string;
    try {
      normalizedPhone = normalizeKenyanPhone(phoneRaw);
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Invalid phone number" },
        { status: 400 }
      );
    }

    // ─── 2. Cooldown — prevent repeat STK pushes for the same order ──
    const lastInitiated = recentlyInitiated.get(orderId);
    if (lastInitiated && Date.now() - lastInitiated < COOLDOWN_MS) {
      const secondsLeft = Math.ceil((COOLDOWN_MS - (Date.now() - lastInitiated)) / 1000);
      return NextResponse.json(
        { error: `An STK push was just sent. Wait ${secondsLeft}s before trying again.` },
        { status: 429 }
      );
    }

    // ─── 3. Look up order, verify state ────────────────────────────
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (order.status !== "pending") {
      return NextResponse.json(
        { error: `Order is already ${order.status} — cannot re-pay.` },
        { status: 400 }
      );
    }

    if (order.paymentMethod !== "mpesa") {
      return NextResponse.json(
        { error: "This order is not configured for M-Pesa payment" },
        { status: 400 }
      );
    }

    // ─── 4. Look up the existing pending payment record ────────────
    const [pending] = await db
      .select()
      .from(payments)
      .where(and(eq(payments.orderId, orderId), eq(payments.provider, "mpesa")))
      .limit(1);

    if (!pending) {
      return NextResponse.json({ error: "No payment record for this order" }, { status: 400 });
    }
    if (pending.status === "success") {
      return NextResponse.json({ error: "Payment already completed" }, { status: 400 });
    }

    // ─── 5. Trigger STK push ───────────────────────────────────────
    const result = await stkPush(normalizedPhone, order.totalKES, orderId);

    if (result.ResponseCode !== "0") {
      return NextResponse.json(
        { error: result.ResponseDescription || "STK Push rejected by Safaricom" },
        { status: 400 }
      );
    }

    // ─── 6. Store CheckoutRequestID + the phone used (for reconciliation) ─
    await db
      .update(payments)
      .set({
        externalRef: result.CheckoutRequestID,
        status: "initiated",
        metadata: {
          phoneNumber: normalizedPhone,
          merchantRequestId: result.MerchantRequestID,
          initiatedAt: new Date().toISOString(),
        },
      })
      .where(eq(payments.id, pending.id));

    recentlyInitiated.set(orderId, Date.now());

    return NextResponse.json({
      checkoutRequestId: result.CheckoutRequestID,
      message: result.CustomerMessage,
    });
  } catch (err) {
    console.error("[POST /api/payments/mpesa/initiate]", err);
    const msg = err instanceof Error ? err.message : "Failed to initiate M-Pesa payment";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
