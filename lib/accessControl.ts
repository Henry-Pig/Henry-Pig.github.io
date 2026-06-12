import { createHash, createHmac, timingSafeEqual } from "crypto";
import type { AccessControlSettings } from "./types";

export const ACCESS_COOKIE_NAME = "site_access_granted";

function secret() {
  return process.env.ADMIN_TOKEN || process.env.DATABASE_URL || "local-access-secret";
}

export function hashAccessKey(value: string) {
  return createHash("sha256").update(value.trim()).digest("hex");
}

export function signAccessHash(keyHash: string) {
  return createHmac("sha256", secret()).update(keyHash).digest("hex");
}

export function verifyAccessKey(value: string, keyHash?: string | null) {
  if (!keyHash) return false;
  const incoming = Buffer.from(hashAccessKey(value), "hex");
  const expected = Buffer.from(keyHash, "hex");
  return incoming.length === expected.length && timingSafeEqual(incoming, expected);
}

export function hasValidAccessCookie(settings: AccessControlSettings, cookieValue?: string) {
  if (!settings.isEnabled) return true;
  if (!settings.keyHash || !cookieValue) return false;
  const incoming = Buffer.from(cookieValue, "hex");
  const expected = Buffer.from(signAccessHash(settings.keyHash), "hex");
  return incoming.length === expected.length && timingSafeEqual(incoming, expected);
}
