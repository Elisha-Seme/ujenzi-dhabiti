import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db, quotes } from "@/lib/db";
import { isAdmin } from "@/lib/admin-guard";

const STATUSES = ["pending", "responded", "declined"] as const;

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await db.select().from(quotes).orderBy(desc(quotes.submittedAt)));
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  if (!body.id || !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "A quote id and valid status are required" }, { status: 400 });
  }
  const [quote] = await db.update(quotes)
    .set({ status: body.status, respondedAt: body.status === "responded" ? new Date() : null })
    .where(eq(quotes.id, body.id))
    .returning();
  return quote ? NextResponse.json(quote) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
