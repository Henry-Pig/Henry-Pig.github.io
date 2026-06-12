import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import type { AccessControlSettings } from "./types";

export const ACCESS_COOKIE_NAME = "site_access_granted";
export const ACCESS_KEY_WINDOW_SECONDS = 60 * 15;

function secret() {
  return process.env.ADMIN_TOKEN || process.env.DATABASE_URL || "local-access-secret";
}

export function hashAccessKey(value: string) {
  return createHash("sha256").update(value.trim()).digest("hex");
}

export function createAccessRotationSalt() {
  return randomBytes(16).toString("hex");
}

export function getAccessKeyWindow(now = Date.now()) {
  const windowStart = Math.floor(now / 1000 / ACCESS_KEY_WINDOW_SECONDS) * ACCESS_KEY_WINDOW_SECONDS;
  return {
    windowStart,
    expiresAt: new Date((windowStart + ACCESS_KEY_WINDOW_SECONDS) * 1000),
    secondsRemaining: Math.max(1, windowStart + ACCESS_KEY_WINDOW_SECONDS - Math.floor(now / 1000))
  };
}

export function generateRotatingAccessKey(rotationSalt: string, now = Date.now()) {
  const { windowStart, expiresAt, secondsRemaining } = getAccessKeyWindow(now);
  const digest = createHmac("sha256", secret())
    .update(`${rotationSalt}:${windowStart}`)
    .digest("base64url")
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase();

  return {
    key: digest.slice(0, 10).replace(/(.{5})/, "$1-"),
    keyHash: hashAccessKey(digest.slice(0, 10).replace(/(.{5})/, "$1-")),
    expiresAt,
    secondsRemaining
  };
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
