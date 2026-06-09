import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "noreply@ujenzidhabiti.co.ke";
const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export async function sendMagicLink(email: string, token: string) {
  const url = `${BASE_URL}/auth/verify?token=${token}`;
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Sign in to Ujenzi Dhabiti",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
        <h2 style="color:#1c1e22;font-size:22px;margin-bottom:8px">Sign in to Ujenzi Dhabiti</h2>
        <p style="color:#555;font-size:15px;margin-bottom:24px">Click the button below to sign in. This link expires in 15 minutes.</p>
        <a href="${url}" style="display:inline-block;background:#8a0e33;color:#fff;font-size:14px;font-weight:bold;padding:14px 28px;border-radius:4px;text-decoration:none">
          Sign In
        </a>
        <p style="color:#999;font-size:12px;margin-top:24px">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}

export async function sendOrderConfirmation(
  email: string,
  name: string,
  orderId: string,
  items: { productName: string; quantity: number; priceKES: number }[],
  totalKES: number,
  downloads: { label: string; url: string }[] = [],
  deposit: { depositKES: number; balanceKES: number } | null = null
) {
  const itemRows = items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;color:#333;font-size:14px">${i.productName}</td>
          <td style="padding:8px 0;color:#333;font-size:14px;text-align:center">${i.quantity}</td>
          <td style="padding:8px 0;color:#333;font-size:14px;text-align:right">KES ${(i.priceKES * i.quantity).toLocaleString()}</td>
        </tr>`
    )
    .join("");

  const downloadsBlock = downloads.length === 0 ? "" : `
        <div style="margin:0 0 20px;padding:16px 20px;background:#fdf4f6;border:1px solid #8a0e33;border-radius:4px">
          <p style="margin:0 0 10px;font-size:13px;font-weight:bold;color:#1c1e22;text-transform:uppercase;letter-spacing:0.05em">Your Digital Plans</p>
          ${downloads.map((d) => `
            <a href="${d.url}" style="display:inline-block;margin:4px 6px 4px 0;background:#8a0e33;color:#fff;font-size:13px;font-weight:bold;padding:10px 16px;border-radius:4px;text-decoration:none">
              Download — ${d.label}
            </a>
          `).join("")}
          <p style="margin:10px 0 0;font-size:11px;color:#777">Bookmark this email or your order page — these links stay valid as long as the order exists.</p>
        </div>
  `;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Order Confirmed — ${orderId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
        <div style="background:#8a0e33;padding:20px 24px;border-radius:4px;margin-bottom:24px">
          <h1 style="color:#fff;font-size:20px;margin:0">Order Confirmed</h1>
          <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:4px 0 0">${orderId}</p>
        </div>
        <p style="color:#333;font-size:15px">Hi ${name},</p>
        <p style="color:#555;font-size:14px;margin-bottom:24px">${deposit ? "Your deposit was received." : "Your payment was received."} ${downloads.length > 0 ? "Your digital downloads are ready below. " : ""}Any physical items will be dispatched within their stated lead times.</p>
        ${deposit ? `
        <div style="margin:0 0 20px;padding:14px 18px;background:#fdf4f6;border:1px solid #8a0e33;border-radius:4px;font-size:14px;color:#1c1e22">
          <strong>Deposit paid:</strong> KES ${deposit.depositKES.toLocaleString()}<br/>
          <strong>Balance due on delivery:</strong> KES ${deposit.balanceKES.toLocaleString()} (cash or M-Pesa)
        </div>` : ""}
        ${downloadsBlock}
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
          <thead>
            <tr style="border-bottom:2px solid #eee">
              <th style="text-align:left;padding:8px 0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.05em">Item</th>
              <th style="text-align:center;padding:8px 0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.05em">Qty</th>
              <th style="text-align:right;padding:8px 0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.05em">Amount</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr style="border-top:2px solid #eee">
              <td colspan="2" style="padding:12px 0;font-size:15px;font-weight:bold;color:#1c1e22">Total</td>
              <td style="padding:12px 0;font-size:15px;font-weight:bold;color:#1c1e22;text-align:right">KES ${totalKES.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        <a href="${BASE_URL}/track/${orderId}" style="display:inline-block;background:#1c1e22;color:#fff;font-size:13px;font-weight:bold;padding:12px 24px;border-radius:4px;text-decoration:none;margin-top:8px">
          Track Your Order
        </a>
      </div>
    `,
  });
}

export async function sendDispatchNotification(
  email: string,
  name: string,
  orderId: string,
  trackingNumber: string | null
) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Your Order Has Been Dispatched — ${orderId}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
        <div style="background:#1c1e22;padding:20px 24px;border-radius:4px;margin-bottom:24px">
          <h1 style="color:#fff;font-size:18px;margin:0">Your Order Is On Its Way</h1>
          <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:4px 0 0">${orderId}</p>
        </div>
        <p style="color:#333;font-size:15px">Hi ${name},</p>
        <p style="color:#555;font-size:14px;line-height:1.6;margin-bottom:20px">
          Great news — your order has been dispatched and is on its way to you.
        </p>
        ${trackingNumber ? `
        <div style="background:#f5f5f5;border-radius:4px;padding:16px 20px;margin-bottom:20px">
          <p style="font-size:12px;color:#999;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.05em">Courier Tracking Number</p>
          <p style="font-size:20px;font-weight:bold;color:#1c1e22;font-family:monospace;margin:0">${trackingNumber}</p>
          <p style="font-size:12px;color:#bbb;margin:6px 0 0">Use this number on your courier's website to track your parcel.</p>
        </div>
        ` : ""}
        <a href="${BASE_URL}/track/${orderId}" style="display:inline-block;background:#8a0e33;color:#fff;font-size:13px;font-weight:bold;padding:12px 24px;border-radius:4px;text-decoration:none">
          Track Order
        </a>
        <div style="border-top:1px solid #eee;margin-top:28px;padding-top:16px">
          <p style="font-size:12px;color:#bbb;margin:0">Questions? Reply to this email or call +254 725 403 001</p>
        </div>
      </div>
    `,
  });
}

