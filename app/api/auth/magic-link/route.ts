import { NextRequest, NextResponse } from "next/server";
import { db, users, verificationTokens } from "@/lib/db";
import { eq } from "drizzle-orm";
import { randomBytes, randomUUID } from "crypto";
import { sendMagicLink } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

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
