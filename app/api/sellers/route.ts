import { NextResponse } from "next/server";
import { db, sellers } from "@/lib/db";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select({
        id: sellers.id,
        businessName: sellers.businessName,
        tagline: sellers.tagline,
        description: sellers.description,
        location: sellers.location,
        phone: sellers.phone,
        categories: sellers.categories,
        verified: sellers.verified,
        rating: sellers.rating,
        reviewCount: sellers.reviewCount,
        totalSales: sellers.totalSales,
        joinedYear: sellers.joinedYear,
      })
      .from(sellers)
      .where(eq(sellers.status, "approved"))
      .orderBy(sellers.businessName);

    return NextResponse.json({ sellers: rows });
  } catch (err) {
    console.error("[GET /api/sellers]", err);
    return NextResponse.json({ error: "Failed to fetch sellers" }, { status: 500 });
  }
}
