import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, trustItems } from "@/lib/db";
import { isAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  const [row] = await db.update(trustItems).set({
    kind: b.kind, title: b.title, subtitle: b.subtitle || null, body: b.body || null, image: b.image || null,
    linkUrl: b.linkUrl || null, permissionConfirmed: !!b.permissionConfirmed, expiresAt: b.expiresAt || null,
    published: !!b.published && !!b.permissionConfirmed, sortOrder: Number(b.sortOrder) || 0, updatedAt: new Date(),
  }).where(eq(trustItems.id, params.id)).returning();
  return NextResponse.json(row);
}
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.delete(trustItems).where(eq(trustItems.id, params.id));
  return NextResponse.json({ success: true });
}
