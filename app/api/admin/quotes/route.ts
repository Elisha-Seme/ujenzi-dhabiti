import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db, quotes } from "@/lib/db";
import { isAdmin } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const rows = await db.select().from(quotes).orderBy(desc(quotes.submittedAt));
  return NextResponse.json(rows);
}
