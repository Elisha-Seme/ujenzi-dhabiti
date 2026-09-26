import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { auth } from "@/lib/auth";
import { db, quotes } from "@/lib/db";
import { allowRequest, requestAddress } from "@/lib/rate-limit";

const FROM = process.env.RESEND_FROM ?? "noreply@ujenzidhabiti.co.ke";
const ADMIN_EMAIL = "ujenzi@ujenzidhabiti.co.ke";

let resend: Resend | null = null;

function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Email delivery is not configured: RESEND_API_KEY is missing");
  }
  resend ??= new Resend(process.env.RESEND_API_KEY);
  return resend;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>\"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '\"': "&quot;",
      "'": "&#39;",
    };
    return entities[character] ?? character;
  });
}

export async function POST(req: NextRequest) {
  try {
    if (!allowRequest(`contact:${requestAddress(req)}`, 10, 15 * 60 * 1000)) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    const { name, company, phone, email, subject, message, drawing, attachments } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
    }

    const safeName = escapeHtml(name);
    const safeCompany = escapeHtml(company);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeSubject = escapeHtml(subject || "General Inquiry");
    const safeMessage = escapeHtml(message);
    const safeFirstName = escapeHtml(String(name).trim().split(/\s+/)[0] || "there");

    // Attachments: prefer the multi-file `attachments` array (Service Request
    // Form); fall back to the legacy single `drawing` object. Max 3 files.
    const fileList: { name: string; base64: string }[] = (
      Array.isArray(attachments) && attachments.length > 0
        ? attachments.slice(0, 3)
        : drawing && drawing.base64
          ? [drawing]
          : []
    ).filter((f: { name?: string; base64?: string }) => f && typeof f.base64 === "string" && f.base64.includes(";base64,"));

    // Email payload for admin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emailPayload: any = {
      from: FROM,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `New Enquiry: ${String(subject || "General Inquiry").replace(/[\r\n]/g, " ")} — ${String(name).replace(/[\r\n]/g, " ")}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
          <div style="background:#8a0e33;padding:20px 24px;border-radius:4px;margin-bottom:24px">
            <h1 style="color:#fff;font-size:18px;margin:0">New Website Enquiry</h1>
            <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:4px 0 0">${safeSubject}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr><td style="padding:6px 0;font-size:13px;color:#999;width:120px">Name</td><td style="padding:6px 0;font-size:14px;color:#1c1e22;font-weight:bold">${safeName}</td></tr>
            ${company ? `<tr><td style="padding:6px 0;font-size:13px;color:#999">Company</td><td style="padding:6px 0;font-size:14px;color:#1c1e22">${safeCompany}</td></tr>` : ""}
            <tr><td style="padding:6px 0;font-size:13px;color:#999">Email</td><td style="padding:6px 0;font-size:14px;color:#1c1e22"><a href="mailto:${safeEmail}" style="color:#8a0e33">${safeEmail}</a></td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#999">Phone</td><td style="padding:6px 0;font-size:14px;color:#1c1e22"><a href="tel:${safePhone}" style="color:#8a0e33">${safePhone}</a></td></tr>
          </table>
          <div style="background:#f5f5f5;border-radius:4px;padding:16px 20px;margin-bottom:20px">
            <p style="font-size:13px;color:#999;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.05em">Message</p>
            <p style="font-size:14px;color:#333;margin:0;white-space:pre-line">${safeMessage}</p>
          </div>
          ${fileList.length > 0 ? `<p style="font-size:13px;color:#8a0e33;font-weight:bold;margin:10px 0">📎 Attachments: ${fileList.map((f) => escapeHtml(f.name)).join(", ")}</p>` : ""}
          <p style="font-size:12px;color:#bbb">Reply directly to this email to respond to ${safeName}.</p>
        </div>
      `,
    };

    if (fileList.length > 0) {
      emailPayload.attachments = fileList.map((f) => ({
        filename: f.name,
        content: f.base64.split(";base64,").pop(),
      }));
    }

    // Persist every enquiry before delivery so guests have an admin-managed
    // record as well as an email notification. Existing signed-in users keep
    // the same account history through userId.
    const session = await auth();
    const qid = `qt-${Date.now()}`;
    await db.insert(quotes).values({
      id: qid,
      userId: session?.user?.id ?? null,
      contactName: String(name).trim(),
      contactEmail: String(email).trim(),
      contactPhone: phone ? String(phone).trim() : null,
      subject: String(subject || "General Inquiry").trim(),
      attachments: fileList.map((file) => ({ name: file.name })),
      projectType: String(subject || "General Inquiry").replace(/^Quote Request\s+—\s+/, ""),
      description: String(message),
      status: "pending",
    });

    // Email to admin
    await getResend().emails.send(emailPayload);

    // Auto-reply to sender
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: "We received your message — Ujenzi Dhabiti",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
          <h2 style="color:#1c1e22;font-size:20px;margin-bottom:8px">Thank you, ${safeFirstName}.</h2>
          <p style="color:#555;font-size:14px;line-height:1.6;margin-bottom:20px">
            We've received your enquiry about <strong>${safeSubject || "your project"}</strong> and will get back to you within 24 hours.
          </p>
          <div style="background:#f5f5f5;border-radius:4px;padding:16px 20px;margin-bottom:24px">
            <p style="font-size:13px;color:#555;margin:0;white-space:pre-line">${safeMessage}</p>
          </div>
          <p style="color:#555;font-size:14px">In the meantime, you can reach us directly:</p>
          <p style="font-size:14px;color:#333">
            📞 +254 725 403 001 / +254 782 999 100<br>
            ✉️ ujenzi@ujenzidhabiti.co.ke
          </p>
          <div style="border-top:1px solid #eee;margin-top:24px;padding-top:16px">
            <p style="font-size:12px;color:#bbb;margin:0">Ujenzi Dhabiti — Connecting Africa</p>
            <p style="font-size:12px;color:#bbb;margin:4px 0 0">Manga House, Kiambare Rd, Upperhill, Nairobi</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
