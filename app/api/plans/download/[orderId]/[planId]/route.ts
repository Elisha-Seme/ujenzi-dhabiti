import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { db, orders, orderItems } from "@/lib/db";
import { eq } from "drizzle-orm";
import { planSnapshotName } from "@/lib/house-plans";
import { getPlanById } from "@/lib/plans-store";
import { verifyDownloadToken } from "@/lib/download-tokens";

// Order statuses that prove payment was received. We don't gate on "paid"
// alone since later statuses (processing/dispatched/delivered) all imply it.
const PAID_STATUSES = new Set(["paid", "processing", "dispatched", "delivered"]);

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string; planId: string } }
) {
  const { orderId, planId } = params;
  const token = req.nextUrl.searchParams.get("token") ?? "";

  if (!token || !verifyDownloadToken(orderId, planId, token)) {
    return NextResponse.json({ error: "Invalid or missing token" }, { status: 403 });
  }

  const plan = await getPlanById(planId);
  if (!plan || !plan.downloadFile) {
    return NextResponse.json({ error: "Plan not available for digital download" }, { status: 404 });
  }

  // Verify the order exists, has been paid for, and actually contains this plan as digital.
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (!PAID_STATUSES.has(order.status)) {
    return NextResponse.json({ error: "Order has not been paid for yet" }, { status: 403 });
  }

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  const expectedSnapshot = planSnapshotName(plan, "digital");
  const hasDigitalLine = items.some((i) => i.productName === expectedSnapshot);
  if (!hasDigitalLine) {
    return NextResponse.json({ error: "This plan is not part of the order" }, { status: 403 });
  }

  // Read the file from public/plans/. Block any path traversal by rejecting
  // separators in the configured filename.
  if (plan.downloadFile.includes("/") || plan.downloadFile.includes("\\") || plan.downloadFile.includes("..")) {
    return NextResponse.json({ error: "Bad plan asset configuration" }, { status: 500 });
  }
  const filePath = path.join(process.cwd(), "public", "plans", plan.downloadFile);

  let file: Buffer;
  try {
    file = await fs.readFile(filePath);
  } catch (err) {
    console.error("[plans/download] file read failed", filePath, err);
    return NextResponse.json({ error: "Plan file is temporarily unavailable" }, { status: 500 });
  }

  // Use the buyer-friendly name (plan.name) as the download filename rather
  // than the raw model code. Replace characters Content-Disposition disallows.
  const niceName = plan.name.replace(/[^a-zA-Z0-9._ -]/g, "").trim();
  const filename = `${niceName || "house-plan"}.pdf`;
  // Slice out a plain ArrayBuffer view for the Web Response BodyInit typing.
  const body = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(file.byteLength),
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
