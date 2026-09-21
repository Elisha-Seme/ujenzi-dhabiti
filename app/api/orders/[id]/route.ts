import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { db, orders, orderItems, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { findPlanByOrderItemAsync } from "@/lib/plans-store";
import { buildDownloadUrl } from "@/lib/download-tokens";
import { auth } from "@/lib/auth";
import { verifyOrderAccessToken } from "@/lib/order-access";

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

    const session = await auth();
    const token = _req.nextUrl.searchParams.get("token") ?? "";
    let buyerEmail = order.guestEmail;
    if (!buyerEmail && order.buyerId) {
      const [buyer] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, order.buyerId))
        .limit(1);
      buyerEmail = buyer?.email ?? null;
    }
    const isOwner = !!session?.user?.id && session.user.id === order.buyerId;
    const hasSecureToken = !!token && !!buyerEmail && verifyOrderAccessToken(token, order.id, buyerEmail);
    const canViewPrivateDetails = isOwner || hasSecureToken;

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
      const downloadAvailable = canViewPrivateDetails && !!(planMatch && planMatch.mode === "digital" && planMatch.plan.downloadFile);
      let downloadUrl: string | null = null;
      if (downloadAvailable && isPaid) {
        downloadUrl = buildDownloadUrl("", order.id, planMatch!.plan.id);
      }
      return {
        ...item,
        isPlan,
        deliveryMode,
        downloadAvailable,
        downloadPending: canViewPrivateDetails && !!(planMatch && planMatch.mode === "digital" && planMatch.plan.downloadFile) && !isPaid,
        downloadUrl,
      };
    }));

    const publicOrder = canViewPrivateDetails
      ? order
      : {
          ...order,
          buyerId: null,
          guestName: null,
          guestEmail: null,
          guestPhone: null,
          deliveryAddress: "Protected — use the secure order link from your confirmation email.",
          deliveryCity: "",
          deliveryCounty: null,
        };

    return NextResponse.json({
      order: { ...publicOrder, isRedacted: !canViewPrivateDetails },
      items: itemsWithMeta,
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (err) {
    console.error("[GET /api/orders/:id]", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
