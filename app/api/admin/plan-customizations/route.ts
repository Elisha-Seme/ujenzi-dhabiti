import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db, planCustomizationRequests } from "@/lib/db";
import { isAdmin } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await db.select().from(planCustomizationRequests).orderBy(desc(planCustomizationRequests.createdAt)));
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  if (!body.id || !["pending", "responded", "declined"].includes(body.status)) return NextResponse.json({ error: "Valid id and status are required" }, { status: 400 });
  const [row] = await db.update(planCustomizationRequests).set({ status: body.status, updatedAt: new Date() }).where(eq(planCustomizationRequests.id, body.id)).returning();
  return row ? NextResponse.json(row) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
