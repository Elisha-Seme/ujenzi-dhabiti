import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db, trustItems } from "@/lib/db";
import { isAdmin, makeId } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await db.select().from(trustItems).orderBy(asc(trustItems.sortOrder)));
}
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!["testimonial", "client_logo", "credential"].includes(b.kind) || !b.title) return NextResponse.json({ error: "Valid type and title required" }, { status: 400 });
  const [row] = await db.insert(trustItems).values({
    id: makeId("trust"), kind: b.kind, title: b.title, subtitle: b.subtitle || null, body: b.body || null,
    image: b.image || null, linkUrl: b.linkUrl || null, permissionConfirmed: !!b.permissionConfirmed,
    expiresAt: b.expiresAt || null, published: !!b.published && !!b.permissionConfirmed, sortOrder: Number(b.sortOrder) || 0,
  }).returning();
  return NextResponse.json(row, { status: 201 });
}
