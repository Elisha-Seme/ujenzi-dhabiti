import { NextRequest, NextResponse } from "next/server";
import { db, sellers, users, verificationTokens } from "@/lib/db";
import { eq } from "drizzle-orm";
import { randomBytes, randomUUID } from "crypto";
import { sendSellerApplicationReceived } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, business, county, categories, category, message } = await req.json();

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

    // New user — create a buyer record. Role only flips to "seller" on admin approval.
    if (!existingUser) {
      await db.insert(users).values({
        id: userId,
        name: String(name).trim(),
        email: normalizedEmail,
        phone: String(phone).trim(),
        role: "buyer",
        emailVerified: false,
      });
    }

    // Duplicate guard
    const [existingSeller] = await db
      .select()
      .from(sellers)
      .where(eq(sellers.userId, userId))
      .limit(1);

    if (existingSeller) {
      return NextResponse.json(
        {
          error:
            "A seller application already exists for this email. Sign in to check its status.",
          alreadyApplied: true,
          status: existingSeller.status,
        },
        { status: 409 }
      );
    }

    // Normalize categories: accept array or single string
    const categoryList = Array.isArray(categories)
      ? categories.map((c) => String(c).trim()).filter(Boolean)
      : category
        ? [String(category).trim()]
        : [];

    const sellerId = `sel-${randomUUID().slice(0, 8)}`;
    await db.insert(sellers).values({
      id: sellerId,
      userId,
      businessName: String(business).trim(),
      tagline: categoryList[0] ? `${categoryList[0]} supplier` : null,
      description: message ? String(message).trim() : null,
      location: county ? String(county).trim() : null,
      phone: String(phone).trim(),
      categories: categoryList,
      status: "pending",
      verified: false,
      rating: 0,
      reviewCount: 0,
      totalSales: 0,
      joinedYear: new Date().getFullYear(),
    });

    // Issue a magic-link token so the applicant can sign in immediately.
    // Email may fail (e.g. Resend domain not verified) — don't block the response.
    try {
      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await db.insert(verificationTokens).values({
        id: randomUUID(),
        email: normalizedEmail,
        token,
        expiresAt,
      });
      await sendSellerApplicationReceived(normalizedEmail, String(name).trim(), String(business).trim(), token);
    } catch (mailErr) {
      console.error("[sellers/apply] email failed:", mailErr);
    }

    return NextResponse.json({ success: true, sellerId }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/sellers/apply]", err);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
