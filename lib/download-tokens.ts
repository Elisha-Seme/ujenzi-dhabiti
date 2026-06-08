// HMAC-signed download tokens for digital plan deliveries.
// Tokens are stateless — they're derived from the order + plan + a server
// secret, so anyone with a valid (orderId, planId, token) tuple from the
// confirmation email or order page can download. The download route still
// re-validates the order's paid status and that the plan is actually in it.

import { createHmac, timingSafeEqual } from "crypto";

function getSecret(): string {
  const s = process.env.NEXTAUTH_SECRET;
  if (!s) {
    throw new Error("NEXTAUTH_SECRET is not configured; cannot sign download tokens.");
  }
  return s;
}

export function signDownloadToken(orderId: string, planId: string): string {
  const payload = `${orderId}:${planId}`;
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function verifyDownloadToken(
  orderId: string,
  planId: string,
  token: string
): boolean {
  const expected = signDownloadToken(orderId, planId);
  if (token.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export function buildDownloadUrl(baseUrl: string, orderId: string, planId: string): string {
  const token = signDownloadToken(orderId, planId);
  const path = `/api/plans/download/${encodeURIComponent(orderId)}/${encodeURIComponent(planId)}?token=${token}`;
  return baseUrl ? `${baseUrl.replace(/\/$/, "")}${path}` : path;
}
