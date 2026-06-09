import { NextRequest, NextResponse } from "next/server";
import { db, newsletterSubscribers } from "@/lib/db";
import { desc } from "drizzle-orm";
import { isAdmin } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let rows: { email: string; createdAt: Date }[] = [];
  try {
    rows = await db
      .select({ email: newsletterSubscribers.email, createdAt: newsletterSubscribers.createdAt })
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.createdAt));
  } catch {
    rows = [];
  }

  // CSV export
  if (req.nextUrl.searchParams.get("format") === "csv") {
    const header = "email,subscribed_at\n";
    const body = rows.map((r) => `${r.email},${new Date(r.createdAt).toISOString()}`).join("\n");
    return new NextResponse(header + body, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="newsletter-subscribers.csv"`,
      },
    });
  }

  return NextResponse.json(rows);
}
