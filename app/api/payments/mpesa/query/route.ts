import { NextRequest, NextResponse } from "next/server";
import { db, payments, orders } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { stkQuery } from "@/lib/daraja";
import { notifyAfterPayment } from "@/lib/payment-notifications";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

    // Look up the pending payment record to get the CheckoutRequestID
    const [payment] = await db
      .select()
      .from(payments)
      .where(and(eq(payments.orderId, orderId), eq(payments.provider, "mpesa")))
      .limit(1);

    if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

    // Already settled — no need to query Safaricom
    if (payment.status === "success") {
      return NextResponse.json({ status: "paid" });
    }
    if (payment.status === "failed") {
      return NextResponse.json({ status: "failed" });
    }

    const checkoutRequestId = payment.externalRef;
    if (!checkoutRequestId) {
      return NextResponse.json({ status: "pending" });
    }

    // Query Safaricom for the current status
    const result = await stkQuery(checkoutRequestId);
    const code = String(result.ResultCode ?? result.ResponseCode ?? "");

    // ResultCode "0" = success
    if (code === "0") {
      const now = new Date();
      await db.update(payments).set({
        status: "success",
        paidAt: now,
        metadata: { _queryConfirmed: true, _result: result },
      }).where(eq(payments.id, payment.id));

      await db.update(orders).set({
        status: "paid",
        updatedAt: now,
      }).where(eq(orders.id, orderId));

      notifyAfterPayment(orderId).catch((err) => {
        console.error("[mpesa/query] notify failed:", err);
      });

      console.log(`[mpesa/query] SUCCESS ${orderId} confirmed via STK query`);
      return NextResponse.json({ status: "paid" });
    }

    // Terminal failure codes
    const failureCodes = ["1032", "1037", "2001", "17", "1"];
    if (failureCodes.includes(code)) {
      await db.update(payments).set({
        status: "failed",
        metadata: { _queryConfirmed: true, _result: result },
      }).where(eq(payments.id, payment.id));

      console.log(`[mpesa/query] FAILED ${orderId} code=${code}: ${result.ResultDesc}`);
      return NextResponse.json({ status: "failed", reason: result.ResultDesc });
    }

    // Still pending (no result yet)
    return NextResponse.json({ status: "pending" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[mpesa/query]", msg);
    // Don't surface Daraja errors to client — just report pending so polling continues
    return NextResponse.json({ status: "pending" });
  }
}
