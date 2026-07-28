// Flutterwave Standard payment helper
// New dashboard format: OAuth2 — exchange Client ID + Secret for an access token,
// then use that token as Bearer for all API calls.

const FLW_BASE = "https://api.flutterwave.com/v3";
const FLW_TOKEN_URL =
  "https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token";

// Module-level token cache — reused until 60s before expiry
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const clientId = process.env.FLUTTERWAVE_CLIENT_ID!;
  const clientSecret = process.env.FLUTTERWAVE_SECRET_KEY!;

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  });
  const res = await fetch(FLW_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const raw = await res.text();
  if (!res.ok) {
    console.error("[flutterwave] token exchange failed", res.status, raw);
    throw new Error(`Flutterwave auth failed (${res.status}): ${raw}`);
  }

  let data: { access_token?: string; expires_in?: number; error_description?: string };
  try { data = JSON.parse(raw); } catch { throw new Error(`Flutterwave token bad JSON: ${raw}`); }

  if (!data.access_token) {
    console.error("[flutterwave] token rejected:", data);
    throw new Error(data.error_description ?? "Failed to get Flutterwave access token");
  }

  const expiresIn = data.expires_in ?? 600;
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (expiresIn - 60) * 1000,
  };

  return data.access_token;
}

export interface FlwInitResult {
  paymentLink: string;
  txRef: string;
}

export async function initFlutterwavePayment(
  orderId: string,
  amountKES: number,
  customerEmail: string,
  customerName: string,
  customerPhone: string,
  redirectUrl: string
): Promise<FlwInitResult> {
  const token = await getAccessToken();
  const txRef = `FLW-${orderId}-${Date.now()}`;

  const res = await fetch(`${FLW_BASE}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: txRef,
      amount: amountKES,
      currency: "KES",
      redirect_url: redirectUrl,
      customer: {
        email: customerEmail,
        name: customerName,
        phonenumber: customerPhone,
      },
      meta: { orderId },
      customizations: {
        title: "Ujenzi Dhabiti",
        description: `Order ${orderId}`,
        logo: "https://ujenzidhabiti.co.ke/logo.png",
      },
      payment_options: "card",
    }),
  });

  const rawText = await res.text();
  if (!res.ok) {
    console.error("[flutterwave] init HTTP", res.status, rawText);
    throw new Error(`Flutterwave init failed (${res.status}): ${rawText}`);
  }

  let data: { status: string; message: string; data?: { link: string } };
  try { data = JSON.parse(rawText); } catch { throw new Error(`Flutterwave bad JSON: ${rawText}`); }
  if (data.status !== "success") {
    console.error("[flutterwave] init rejected:", data);
    throw new Error(data.message ?? "Flutterwave rejected the payment");
  }

  return { paymentLink: data.data!.link, txRef };
}

export async function verifyFlutterwaveTransaction(transactionId: string): Promise<{
  status: "successful" | "failed" | "pending";
  amountKES: number;
  txRef: string;
}> {
  const token = await getAccessToken();

  const res = await fetch(`${FLW_BASE}/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const raw = await res.text();
    throw new Error(`Flutterwave verify failed (${res.status}): ${raw}`);
  }
  const data = await res.json();

  return {
    status: data.data?.status ?? "failed",
    amountKES: data.data?.amount ?? 0,
    txRef: data.data?.tx_ref ?? "",
  };
}
