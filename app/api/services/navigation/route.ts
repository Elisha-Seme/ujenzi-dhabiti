import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db, services } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.select({ slug: services.slug, title: services.title })
      .from(services)
      .where(eq(services.published, true))
      .orderBy(asc(services.sortOrder));
    return NextResponse.json({ services: rows });
  } catch {
    return NextResponse.json({ services: [], error: "Service navigation is temporarily unavailable" }, { status: 503 });
  }
}
