import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, sellers, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await db
    .select({
      id: sellers.id,
      businessName: sellers.businessName,
      tagline: sellers.tagline,
      description: sellers.description,
      location: sellers.location,
      phone: sellers.phone,
      categories: sellers.categories,
      status: sellers.status,
      verified: sellers.verified,
      rating: sellers.rating,
      reviewCount: sellers.reviewCount,
      totalSales: sellers.totalSales,
      joinedYear: sellers.joinedYear,
      approvedAt: sellers.approvedAt,
      createdAt: sellers.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(sellers)
    .innerJoin(users, eq(sellers.userId, users.id))
    .orderBy(sellers.createdAt);

  return NextResponse.json(rows);
}
