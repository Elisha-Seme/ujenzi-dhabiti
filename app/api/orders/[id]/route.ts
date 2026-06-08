import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { db, orders, orderItems } from "@/lib/db";
import { eq } from "drizzle-orm";
import { findPlanByOrderItemAsync } from "@/lib/plans-store";
import { buildDownloadUrl } from "@/lib/download-tokens";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const PAID_STATUSES = new Set(["paid", "processing", "dispatched", "delivered"]);

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    noStore();
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, params.id))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, params.id));

    // Compute per-item delivery + download metadata for the track page.
    // Only digital plan items on paid orders get an active download link.
    const isPaid = PAID_STATUSES.has(order.status);
    const itemsWithMeta = await Promise.all(items.map(async (item) => {
      const planMatch = await findPlanByOrderItemAsync(item.productName);
      const isPlan = planMatch !== null;
      const deliveryMode = planMatch?.mode ?? null;
      const downloadAvailable = !!(planMatch && planMatch.mode === "digital" && planMatch.plan.downloadFile);
      let downloadUrl: string | null = null;
      if (downloadAvailable && isPaid) {
        downloadUrl = buildDownloadUrl("", order.id, planMatch!.plan.id);
      }
      return {
        ...item,
        isPlan,
        deliveryMode,
        downloadAvailable,
        downloadPending: downloadAvailable && !isPaid,
        downloadUrl,
      };
    }));

    return NextResponse.json({ order, items: itemsWithMeta });
  } catch (err) {
    console.error("[GET /api/orders/:id]", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
