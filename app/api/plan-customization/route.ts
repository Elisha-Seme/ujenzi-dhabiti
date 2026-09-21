import { NextRequest, NextResponse } from "next/server";
import { db, planCustomizationRequests } from "@/lib/db";
import { randomUUID } from "crypto";
import { allowRequest, requestAddress } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    if (!allowRequest(`plan-customization:${requestAddress(req)}`, 10, 15 * 60 * 1000)) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const request = String(body.request ?? "").trim();
    if (!name || !email || !request) return NextResponse.json({ error: "Name, email, and requested changes are required" }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
    const [row] = await db.insert(planCustomizationRequests).values({
      id: `planreq-${randomUUID().slice(0, 8)}`,
      planId: body.planId || null,
      name,
      email,
      phone: body.phone ? String(body.phone).trim() : null,
      request,
      status: "pending",
    }).returning();
    return NextResponse.json({ success: true, id: row.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/plan-customization]", error);
    return NextResponse.json({ error: "Could not submit customization request" }, { status: 500 });
  }
}
