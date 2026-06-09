import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { auth } from "@/lib/auth";
import { db, quotes } from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "noreply@ujenzidhabiti.co.ke";
const ADMIN_EMAIL = "ujenzi@ujenzidhabiti.co.ke";

export async function POST(req: NextRequest) {
  try {
    const { name, company, phone, email, subject, message, drawing } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
    }

    // Email payload for admin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emailPayload: any = {
      from: FROM,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `New Enquiry: ${subject || "General Inquiry"} — ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
          <div style="background:#8a0e33;padding:20px 24px;border-radius:4px;margin-bottom:24px">
            <h1 style="color:#fff;font-size:18px;margin:0">New Website Enquiry</h1>
            <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:4px 0 0">${subject || "General Inquiry"}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr><td style="padding:6px 0;font-size:13px;color:#999;width:120px">Name</td><td style="padding:6px 0;font-size:14px;color:#1c1e22;font-weight:bold">${name}</td></tr>
            ${company ? `<tr><td style="padding:6px 0;font-size:13px;color:#999">Company</td><td style="padding:6px 0;font-size:14px;color:#1c1e22">${company}</td></tr>` : ""}
            <tr><td style="padding:6px 0;font-size:13px;color:#999">Email</td><td style="padding:6px 0;font-size:14px;color:#1c1e22"><a href="mailto:${email}" style="color:#8a0e33">${email}</a></td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#999">Phone</td><td style="padding:6px 0;font-size:14px;color:#1c1e22"><a href="tel:${phone}" style="color:#8a0e33">${phone}</a></td></tr>
          </table>
          <div style="background:#f5f5f5;border-radius:4px;padding:16px 20px;margin-bottom:20px">
            <p style="font-size:13px;color:#999;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.05em">Message</p>
            <p style="font-size:14px;color:#333;margin:0;white-space:pre-line">${message}</p>
          </div>
          ${drawing ? `<p style="font-size:13px;color:#8a0e33;font-weight:bold;margin:10px 0">📎 Drawing Attachment: ${drawing.name}</p>` : ""}
          <p style="font-size:12px;color:#bbb">Reply directly to this email to respond to ${name}.</p>
        </div>
      `,
    };

    if (drawing && drawing.base64) {
      const base64Data = drawing.base64.split(";base64,").pop();
      emailPayload.attachments = [
        {
          filename: drawing.name,
          content: base64Data,
        },
      ];
    }

    // Email to admin
    await resend.emails.send(emailPayload);

    // Auto-reply to sender
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "We received your message — Ujenzi Dhabiti",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
          <h2 style="color:#1c1e22;font-size:20px;margin-bottom:8px">Thank you, ${name.split(" ")[0]}.</h2>
          <p style="color:#555;font-size:14px;line-height:1.6;margin-bottom:20px">
            We've received your enquiry about <strong>${subject || "your project"}</strong> and will get back to you within 24 hours.
          </p>
          <div style="background:#f5f5f5;border-radius:4px;padding:16px 20px;margin-bottom:24px">
            <p style="font-size:13px;color:#555;margin:0;white-space:pre-line">${message}</p>
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

    // Save quote to user dashboard if signed in
    const session = await auth();
    if (session?.user?.id) {
      const qid = `qt-${Date.now()}`;
      await db.insert(quotes).values({
        id: qid,
        userId: session.user.id,
        projectType: subject?.replace("Quote Request — ", "") || "General Inquiry",
        description: message,
        status: "pending",
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
