import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { allowRequest, requestAddress } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    if (!allowRequest(`signup:${requestAddress(req)}`, 8, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many signup attempts. Please try again later." }, { status: 429 });
    }
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : "";

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }
    if (name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please provide a valid name and email address" }, { status: 400 });
    }
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const id = `usr-${randomUUID().slice(0, 8)}`;

    await db.insert(users).values({
      id,
      name,
      email,
      passwordHash,
      phone: phone || null,
      role: "buyer",
      emailVerified: true, // simplified: skip email verification for now
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/auth/signup]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
