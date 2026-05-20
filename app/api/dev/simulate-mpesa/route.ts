// DEV ONLY — simulates a successful M-Pesa callback for a pending order.
// Remove or gate behind NODE_ENV check before going to production.
import { NextRequest, NextResponse } from "next/server";
import { db, payments, orders } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { notifyAfterPayment } from "@/lib/payment-notifications";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status !== "pending") {
    return NextResponse.json({ error: `Order is already ${order.status}` }, { status: 400 });
  }

  const [payment] = await db
    .select()
    .from(payments)
    .where(and(eq(payments.orderId, orderId), eq(payments.provider, "mpesa")))
    .limit(1);

  if (!payment) return NextResponse.json({ error: "No M-Pesa payment record found" }, { status: 404 });

  const now = new Date();
  const fakeRef = `SIM${Date.now().toString().slice(-8)}`;

  await db.update(payments).set({
    status: "success",
    externalRef: fakeRef,
    paidAt: now,
    metadata: { _simulated: true, _simulatedAt: now.toISOString() },
  }).where(eq(payments.id, payment.id));

  await db.update(orders).set({
    status: "paid",
    updatedAt: now,
  }).where(eq(orders.id, orderId));

  notifyAfterPayment(orderId).catch((err) => {
    console.error("[simulate-mpesa] notify failed:", err);
  });

  console.log(`[simulate-mpesa] Order ${orderId} marked paid (ref: ${fakeRef})`);

  return NextResponse.json({ success: true, orderId, ref: fakeRef });
}
