import { NextRequest, NextResponse } from "next/server";
import { db, faqs } from "@/lib/db";
import { asc } from "drizzle-orm";
import { isAdmin, makeId } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const rows = await db.select().from(faqs).orderBy(asc(faqs.sortOrder));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b.question || !b.answer) {
    return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
  }
  const [row] = await db
    .insert(faqs)
    .values({
      id: makeId("faq"),
      question: b.question,
      answer: b.answer,
      iconName: b.iconName ?? "ShoppingBag",
      sortOrder: Number(b.sortOrder) || 0,
    })
    .returning();
  return NextResponse.json(row, { status: 201 });
}
