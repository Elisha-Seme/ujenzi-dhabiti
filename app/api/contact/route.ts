import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, quotes } from "@/lib/db";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.RESEND_FROM ?? "noreply@ujenzidhabiti.co.ke";
const ADMIN_EMAIL = process.env.CONTACT_RECIPIENT ?? "ujenzi@ujenzidhabiti.co.ke";
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["application/pdf", "image/png", "image/jpeg", "image/webp"]);
const attempts = new Map<string, { count: number; resetAt: number }>();

type IncomingFile = { name?: string; base64?: string; type?: string };

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function validFile(file: IncomingFile): file is Required<Pick<IncomingFile, "name" | "base64">> & IncomingFile {
  if (!file?.name || !file.base64?.includes(";base64,")) return false;
  const mime = file.type || file.base64.slice(5, file.base64.indexOf(";"));
  const encoded = file.base64.split(";base64,")[1] ?? "";
  return ALLOWED_TYPES.has(mime) && Math.ceil(encoded.length * 0.75) <= MAX_FILE_BYTES;
}

export async function POST(req: NextRequest) {
  let quoteId: string | null = null;
  try {
    const body = await req.json();
    if (body.website) return NextResponse.json({ success: true });
    const clientKey = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();
    const attempt = attempts.get(clientKey);
    if (attempt && attempt.resetAt > now && attempt.count >= 5) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }
    attempts.set(clientKey, attempt && attempt.resetAt > now
      ? { ...attempt, count: attempt.count + 1 }
      : { count: 1, resetAt: now + 15 * 60_000 });
    const name = text(body.name, 120);
    const email = text(body.email, 254).toLowerCase();
    const phone = text(body.phone, 40);
    const subject = text(body.subject, 200) || "General Inquiry";
    const message = text(body.message, 20_000);

    if (!name || !validEmail(email) || !message) {
      return NextResponse.json({ error: "A valid name, email and message are required" }, { status: 400 });
    }
    if (body.structured && body.structured.agreeContact !== true) {
      return NextResponse.json({ error: "Contact consent is required" }, { status: 400 });
    }

    const candidates: IncomingFile[] =
      Array.isArray(body.attachments) && body.attachments.length
        ? body.attachments.slice(0, 3)
        : body.drawing
          ? [body.drawing]
          : [];
    if (candidates.some((file) => !validFile(file))) {
      return NextResponse.json({ error: "Attachments must be PDF, PNG, JPG or WebP and no larger than 5MB each" }, { status: 400 });
    }
    const files = candidates.filter(validFile);

    const session = await auth();
    quoteId = `qt-${crypto.randomUUID()}`;
    await db.insert(quotes).values({
      id: quoteId,
      userId: session?.user?.id ?? null,
      projectType: subject.replace("Quote Request — ", ""),
      description: message,
      requestKind: text(body.requestKind, 80) || "general",
      sourcePlanId: text(body.sourcePlanId, 120) || null,
      sourcePlanName: text(body.sourcePlanName, 200) || null,
      contactName: name,
      contactEmail: email,
      contactPhone: phone || null,
      structuredData: body.structured && typeof body.structured === "object" ? body.structured : null,
      attachmentMetadata: files.map((file) => ({ name: text(file.name, 180), type: file.type ?? "unknown" })),
      consentToContact: body.structured?.agreeContact === true,
      notificationStatus: "pending",
      status: "pending",
    });

    const attachmentPayload = files.map((file) => ({
      filename: text(file.name, 180),
      content: file.base64.split(";base64,")[1],
    }));
    const safeName = escapeHtml(name);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    if (!resend) {
      throw new Error("Email notifications are not configured");
    }

    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `New Enquiry: ${subject} — ${name}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px">
        <h1 style="color:#8a0e33;font-size:20px">New Website Enquiry</h1>
        <p><strong>${safeSubject}</strong></p>
        <p><strong>Name:</strong> ${safeName}<br><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <div style="background:#f5f5f5;padding:16px;white-space:pre-line">${safeMessage}</div>
        <p style="font-size:12px;color:#777">Reference: ${quoteId}</p>
      </div>`,
      attachments: attachmentPayload.length ? attachmentPayload : undefined,
    });
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "We received your request — Ujenzi Dhabiti",
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px">
        <h2>Thank you, ${escapeHtml(name.split(" ")[0])}.</h2>
        <p>We received your request and will respond within 24 hours.</p>
        <p style="font-size:12px;color:#777">Reference: ${quoteId}</p>
      </div>`,
    });

    await db.update(quotes).set({ notificationStatus: "sent" }).where(eq(quotes.id, quoteId));
    return NextResponse.json({ success: true, reference: quoteId });
  } catch (error) {
    if (quoteId) {
      try {
        await db.update(quotes).set({ notificationStatus: "failed" }).where(eq(quotes.id, quoteId));
      } catch {
        // Preserve the original failure response.
      }
    }
    console.error("[POST /api/contact]", error);
    return NextResponse.json(
      { error: quoteId ? `Your request was saved as ${quoteId}, but notification delivery failed. Please contact us directly.` : "Failed to save request" },
      { status: 500 }
    );
  }
}
