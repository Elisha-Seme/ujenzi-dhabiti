import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, sellers, users } from "@/lib/db";
import { eq } from "drizzle-orm";

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

  if (status === "approved") {
    await db.update(users).set({ role: "seller", updatedAt: now }).where(eq(users.id, seller.userId));
  }

  return NextResponse.json(updated);
}
