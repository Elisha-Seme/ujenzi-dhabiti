import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { companyCredentials, db } from "@/lib/db";
import { isAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  const patch: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of ["title", "detail", "credentialNumber", "image"]) if (b[key] !== undefined) patch[key] = b[key] || null;
  for (const key of ["issuedYear", "expiresYear"]) if (b[key] !== undefined) patch[key] = b[key] == null || b[key] === "" ? null : Number(b[key]);
  if (b.published !== undefined) patch.published = !!b.published;
  if (b.sortOrder !== undefined) patch.sortOrder = Number(b.sortOrder) || 0;
  const [row] = await db.update(companyCredentials).set(patch).where(eq(companyCredentials.id, params.id)).returning();
  return row ? NextResponse.json(row) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.delete(companyCredentials).where(eq(companyCredentials.id, params.id));
  return NextResponse.json({ success: true });
}
