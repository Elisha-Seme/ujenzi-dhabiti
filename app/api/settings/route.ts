import { NextResponse } from "next/server";
import { db, systemSettings } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const [settings] = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.id, "default"));
    return NextResponse.json(settings || {});
  } catch (err) {
    console.error("[GET /api/settings]", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
