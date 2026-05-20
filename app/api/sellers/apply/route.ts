import { NextRequest, NextResponse } from "next/server";
import { db, sellers, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, business, county, category, message } = await req.json();

    if (!name || !email || !phone || !business) {
      return NextResponse.json(
        { error: "Contact name, business name, email, and phone are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    const userId = existingUser?.id ?? `usr-${randomUUID().slice(0, 8)}`;

    if (!existingUser) {
      await db.insert(users).values({
        id: userId,
        name: String(name).trim(),
        email: normalizedEmail,
        phone: String(phone).trim(),
        role: "seller",
        emailVerified: false,
      });
    }

    const [existingSeller] = await db
      .select()
      .from(sellers)
      .where(eq(sellers.userId, userId))
      .limit(1);

    if (existingSeller) {
      return NextResponse.json(
        { error: "A seller application already exists for this email" },
        { status: 409 }
      );
    }

    const sellerId = `sel-${randomUUID().slice(0, 8)}`;
    await db.insert(sellers).values({
      id: sellerId,
      userId,
      businessName: String(business).trim(),
      tagline: category ? `${category} supplier` : null,
      description: message ? String(message).trim() : null,
      location: county ? String(county).trim() : null,
      phone: String(phone).trim(),
      categories: category ? [String(category).trim()] : [],
      status: "pending",
      verified: false,
      rating: 0,
      reviewCount: 0,
      totalSales: 0,
      joinedYear: new Date().getFullYear(),
    });

    return NextResponse.json({ success: true, sellerId }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/sellers/apply]", err);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
