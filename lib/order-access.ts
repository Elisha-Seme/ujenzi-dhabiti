import { createHmac, timingSafeEqual } from "crypto";

const DEFAULT_TTL_SECONDS = 30 * 24 * 60 * 60;

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is not configured");
  return secret;
}

export function normalizeOrderIdentity(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Create an opaque, expiring order-access token. The customer identity is
 * included in the HMAC input but never in the token itself.
 */
export function createOrderAccessToken(
  orderId: string,
  identity: string,
  ttlSeconds = DEFAULT_TTL_SECONDS,
): string {
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${orderId}:${normalizeOrderIdentity(identity)}:${expiresAt}`;
  const signature = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${expiresAt}.${signature}`;
}

export function verifyOrderAccessToken(
  token: string,
  orderId: string,
  identity: string,
): boolean {
  const [expiryText, signature] = token.split(".");
  const expiresAt = Number(expiryText);
  if (!Number.isSafeInteger(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) return false;
  if (!/^[a-f0-9]{64}$/i.test(signature ?? "")) return false;

  const payload = `${orderId}:${normalizeOrderIdentity(identity)}:${expiresAt}`;
  const expected = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
}

