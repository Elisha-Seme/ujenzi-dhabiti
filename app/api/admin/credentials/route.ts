import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { companyCredentials, db } from "@/lib/db";
import { isAdmin, makeId } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await db.select().from(companyCredentials).orderBy(asc(companyCredentials.sortOrder)));
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b.title || !b.detail) return NextResponse.json({ error: "Title and detail are required" }, { status: 400 });
  const [row] = await db.insert(companyCredentials).values({
    id: makeId("credential"),
    title: String(b.title).trim(),
    detail: String(b.detail).trim(),
    credentialNumber: b.credentialNumber || null,
    issuedYear: b.issuedYear == null || b.issuedYear === "" ? null : Number(b.issuedYear),
    expiresYear: b.expiresYear == null || b.expiresYear === "" ? null : Number(b.expiresYear),
    image: b.image || null,
    published: !!b.published,
    sortOrder: Number(b.sortOrder) || 0,
  }).returning();
  return NextResponse.json(row, { status: 201 });
}
