import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, estimatorRates } from "@/lib/db";
export async function GET() {
  try { return NextResponse.json(await db.select().from(estimatorRates).where(eq(estimatorRates.published, true))); }
  catch { return NextResponse.json([]); }
}
