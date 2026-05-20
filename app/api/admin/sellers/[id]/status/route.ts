import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, sellers, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { sendSellerApproved, sendSellerRejected } from "@/lib/email";

const ALLOWED = ["pending", "approved", "rejected", "suspended"] as const;
type SellerStatus = (typeof ALLOWED)[number];

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { status, verified } = await req.json();
  if (!ALLOWED.includes(status)) {
    return NextResponse.json({ error: "Invalid seller status" }, { status: 400 });
  }

  const [seller] = await db.select().from(sellers).where(eq(sellers.id, params.id)).limit(1);
  if (!seller) return NextResponse.json({ error: "Seller not found" }, { status: 404 });

  const previousStatus = seller.status;

  // Idempotency: skip the update + email when status hasn't changed
  if (previousStatus === status) {
    return NextResponse.json(seller);
  }

  const now = new Date();
  const [updated] = await db
    .update(sellers)
    .set({
      status: status as SellerStatus,
      verified: verified ?? status === "approved",
      approvedAt: status === "approved" ? now : seller.approvedAt,
      updatedAt: now,
    })
    .where(eq(sellers.id, params.id))
    .returning();

  // Promote/demote the linked user's role to match seller status
  const [sellerUser] = await db.select().from(users).where(eq(users.id, seller.userId)).limit(1);
  if (sellerUser) {
    const newRole = status === "approved" ? "seller" : sellerUser.role === "seller" ? "buyer" : sellerUser.role;
    if (newRole !== sellerUser.role) {
      await db.update(users).set({ role: newRole, updatedAt: now }).where(eq(users.id, sellerUser.id));
    }

    // Fire notification email only on status transitions (not re-saves)
    try {
      if (status === "approved" && previousStatus !== "approved") {
        await sendSellerApproved(sellerUser.email, sellerUser.name, seller.businessName);
      } else if (status === "rejected" && previousStatus !== "rejected") {
        await sendSellerRejected(sellerUser.email, sellerUser.name, seller.businessName);
      }
    } catch (mailErr) {
      console.error("[admin/sellers/status] email failed:", mailErr);
    }
  }

  return NextResponse.json(updated);
}
