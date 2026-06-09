import { NextRequest, NextResponse } from "next/server";
import { db, newsletterSubscribers } from "@/lib/db";
import { randomUUID } from "crypto";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !EMAIL_RE.test(String(email))) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    await db
      .insert(newsletterSubscribers)
      .values({ id: randomUUID(), email: String(email).trim().toLowerCase() })
      .onConflictDoNothing();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/newsletter]", err);
    return NextResponse.json({ error: "Could not subscribe right now." }, { status: 500 });
  }
}
