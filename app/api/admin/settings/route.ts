import { NextRequest, NextResponse } from "next/server";
import { db, systemSettings } from "@/lib/db";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/admin-guard";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  
  const [settings] = await db
    .select()
    .from(systemSettings)
    .where(eq(systemSettings.id, "default"));
    
  if (!settings) {
    const [inserted] = await db
      .insert(systemSettings)
      .values({
        id: "default",
        phoneNumbers: ["+254782999100", "+254739999100"],
        customerServiceEmail: "ujenzi@ujenzidhabiti.co.ke",
        constructionEmail: "build@ujenzidhabiti.co.ke",
        interiorDesignEmail: "design@ujenzidhabiti.co.ke",
        architecturalEmail: "architect@ujenzidhabiti.co.ke",
        address: "B2-06, Manga House, Kiambere Road, Upper Hill, Nairobi, Kenya",
        whatsappNumber: "254782999100",
        motto: "Connecting Africa",
      })
      .returning();
    return NextResponse.json(inserted);
  }
  
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  
  const patch: Record<string, unknown> = { updatedAt: new Date() };
  
  const textFields = [
    "customerServiceEmail",
    "constructionEmail",
    "interiorDesignEmail",
    "architecturalEmail",
    "address",
    "whatsappNumber",
    "motto",
    "facebookUrl",
    "instagramUrl",
    "linkedinUrl",
    "twitterUrl",
    "tiktokUrl",
  ];
  
  for (const k of textFields) {
    if (b[k] !== undefined) patch[k] = b[k] || "";
  }
  
  if (b.phoneNumbers !== undefined) {
    patch.phoneNumbers = Array.isArray(b.phoneNumbers) ? b.phoneNumbers : [];
  }
  
  const [row] = await db
    .update(systemSettings)
    .set(patch)
    .where(eq(systemSettings.id, "default"))
    .returning();
    
  if (!row) {
    const [inserted] = await db
      .insert(systemSettings)
      .values({
        id: "default",
        phoneNumbers: Array.isArray(b.phoneNumbers) ? b.phoneNumbers : [],
        customerServiceEmail: b.customerServiceEmail || "",
        constructionEmail: b.constructionEmail || "",
        interiorDesignEmail: b.interiorDesignEmail || "",
        architecturalEmail: b.architecturalEmail || "",
        address: b.address || "",
        whatsappNumber: b.whatsappNumber || "",
        motto: b.motto || "",
        facebookUrl: b.facebookUrl || null,
        instagramUrl: b.instagramUrl || null,
        linkedinUrl: b.linkedinUrl || null,
        twitterUrl: b.twitterUrl || null,
        tiktokUrl: b.tiktokUrl || null,
      })
      .returning();
    return NextResponse.json(inserted);
  }
  
  return NextResponse.json(row);
}
