// Safaricom Daraja API helper
// Docs: https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate

const DARAJA_BASE =
  process.env.DARAJA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

// ─── Token cache ──────────────────────────────────────────────
// Daraja tokens are valid for ~1 hour. Cache to avoid wasting Daraja API quota.
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    // Use cached token if it has >1 minute left
    return cachedToken.token;
  }

  const key = process.env.DARAJA_CONSUMER_KEY!;
  const secret = process.env.DARAJA_CONSUMER_SECRET!;
  const credentials = Buffer.from(`${key}:${secret}`).toString("base64");

  const res = await fetch(
    `${DARAJA_BASE}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${credentials}` }, cache: "no-store" }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "<no body>");
    throw new Error(`Daraja auth failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: string };
  const expiresInSec = Number(data.expires_in ?? 3599);
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + expiresInSec * 1000,
  };

  return data.access_token;
}

function getTimestamp(): string {
  return new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);
}

function getPassword(timestamp: string): string {
  const shortcode = process.env.DARAJA_SHORTCODE!;
  const passkey = process.env.DARAJA_PASSKEY!;
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
}

/**
 * Normalize a Kenyan phone number to E.164 without the leading +
 * Accepts: "0712345678", "+254712345678", "254712345678", "712345678",
 * "0712 345 678", "(0712) 345-678" — strips all non-digits first.
 * Returns: "254712345678" (12 digits, starts with 254)
 * Throws if the number can't be interpreted as a valid Kenyan mobile.
 */
export function normalizeKenyanPhone(raw: string): string {
  const digits = String(raw).replace(/\D/g, "");
  let n = digits;

  // Strip leading zero(s)
  if (n.startsWith("00")) n = n.slice(2);
  if (n.startsWith("0")) n = "254" + n.slice(1);
  // Strip the + (already removed by /\D/g but in case)
  if (n.startsWith("+254")) n = n.slice(1);
  // Bare 9-digit number (7XXXXXXXX) — assume Kenyan
  if (n.length === 9 && (n.startsWith("7") || n.startsWith("1"))) n = "254" + n;

  // Final shape check: 254 + (7|1)XXXXXXXX = 12 digits
  if (!/^254[71]\d{8}$/.test(n)) {
    throw new Error(
      `Invalid Kenyan phone number: "${raw}". Use a Safaricom/Airtel number (07XXXXXXXX or 254XXXXXXXXX).`
    );
  }
  return n;
}

export interface StkPushResult {
  CheckoutRequestID: string;
  MerchantRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface StkQueryResult {
  ResultCode: string;
  ResultDesc: string;
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
}

export async function stkQuery(checkoutRequestId: string): Promise<StkQueryResult> {
  const token = await getAccessToken();
  const timestamp = getTimestamp();
  const password = getPassword(timestamp);
  const shortcode = process.env.DARAJA_SHORTCODE!;

  const res = await fetch(`${DARAJA_BASE}/mpesa/stkpushquery/v1/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "<no body>");
    throw new Error(`STK Query failed (${res.status}): ${err}`);
  }

  return res.json();
}

export async function stkPush(
  phone: string,
  amountKES: number,
  orderId: string
): Promise<StkPushResult> {
  if (!process.env.DARAJA_CALLBACK_URL) {
    throw new Error("DARAJA_CALLBACK_URL is not configured");
  }
  if (!Number.isFinite(amountKES) || amountKES < 1) {
    throw new Error(`Invalid amount: ${amountKES}. Minimum is KES 1.`);
  }

  const normalizedPhone = normalizeKenyanPhone(phone);

  const token = await getAccessToken();
  const timestamp = getTimestamp();
  const password = getPassword(timestamp);
  const shortcode = process.env.DARAJA_SHORTCODE!;
  const callbackUrl = process.env.DARAJA_CALLBACK_URL!;

  const res = await fetch(`${DARAJA_BASE}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amountKES),
      PartyA: normalizedPhone,
      PartyB: shortcode,
      PhoneNumber: normalizedPhone,
      CallBackURL: callbackUrl,
      // Daraja limits: AccountReference max 12 chars, TransactionDesc max 13 chars.
      // Order IDs are "UD-XXXXXX" (9 chars) which fits both.
      AccountReference: orderId,
      TransactionDesc: orderId,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "<no body>");
    throw new Error(`STK Push failed (${res.status}): ${err}`);
  }

  return res.json();
}
