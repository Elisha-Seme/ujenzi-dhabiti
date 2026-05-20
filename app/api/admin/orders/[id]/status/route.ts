import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, orders, payments } from "@/lib/db";
import { eq } from "drizzle-orm";
import { notifyAfterPayment } from "@/lib/payment-notifications";

const ALLOWED = ["pending", "paid", "processing", "dispatched", "delivered", "cancelled", "refunded"] as const;
type OrderStatus = (typeof ALLOWED)[number];

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { status, trackingNumber } = await req.json();
  if (!ALLOWED.includes(status)) {
    return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
  }

  const now = new Date();
  const [updated] = await db
    .update(orders)
    .set({
      status: status as OrderStatus,
      trackingNumber: trackingNumber ?? undefined,
      dispatchedAt: status === "dispatched" ? now : undefined,
      deliveredAt: status === "delivered" ? now : undefined,
      updatedAt: now,
    })
    .where(eq(orders.id, params.id))
    .returning();

  if (!updated) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (status === "paid") {
    await db
      .update(payments)
      .set({ status: "success", paidAt: now })
      .where(eq(payments.orderId, params.id));

    // Trigger buyer + seller notification emails (same as M-Pesa/Flutterwave callbacks)
    notifyAfterPayment(params.id).catch((err) => {
      console.error("[admin/orders/status] notify failed:", err);
    });
  }

  if (status === "cancelled" || status === "refunded") {
    await db
      .update(payments)
      .set({ status: "failed" })
      .where(eq(payments.orderId, params.id));
  }

  return NextResponse.json(updated);
}
