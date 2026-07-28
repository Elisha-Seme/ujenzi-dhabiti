import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, quotes } from "@/lib/db";
import { isAdmin } from "@/lib/admin-guard";

const STATUSES = new Set(["pending", "responded", "declined"]);

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  if (!STATUSES.has(body.status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const [row] = await db.update(quotes).set({
    status: body.status,
    respondedAt: body.status === "responded" ? new Date() : null,
  }).where(eq(quotes.id, params.id)).returning();
  return row ? NextResponse.json(row) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
