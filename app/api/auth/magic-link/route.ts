import { NextRequest, NextResponse } from "next/server";
import { db, users, verificationTokens } from "@/lib/db";
import { eq } from "drizzle-orm";
import { randomBytes, randomUUID } from "crypto";
import { sendMagicLink } from "@/lib/email";
import { allowRequest, requestAddress } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    if (!allowRequest(`magic:${requestAddress(req)}`, 5, 15 * 60 * 1000)) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    const rawEmail = (await req.json()).email;
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "A valid email is required" }, { status: 400 });

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    // Always return success even if user doesn't exist (prevents email enumeration)
    if (!user) {
      return NextResponse.json({ success: true });
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await db.insert(verificationTokens).values({
      id: randomUUID(),
      email,
      token,
      expiresAt,
    });

    await sendMagicLink(email, token);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/auth/magic-link]", err);
    return NextResponse.json({ error: "Failed to send magic link" }, { status: 500 });
  }
}
