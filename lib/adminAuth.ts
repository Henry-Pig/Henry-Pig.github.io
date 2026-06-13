import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE_NAME = "site_admin_granted";

export function isAdminRequest(request: Request) {
  const token = process.env.ADMIN_TOKEN;
  return Boolean(token && request.headers.get("x-admin-token") === token);
}

export function adminUnauthorizedResponse() {
  return { success: false, data: null, error: "Unauthorized. Please check ADMIN_TOKEN." };
}

function adminSecret() {
  return process.env.ADMIN_TOKEN || "missing-admin-token";
}

export function signAdminCookie() {
  return createHmac("sha256", adminSecret()).update("admin-session").digest("hex");
}

export function hasValidAdminCookie(cookieValue?: string) {
  if (!process.env.ADMIN_TOKEN || !cookieValue) return false;
  const incoming = Buffer.from(cookieValue, "hex");
  const expected = Buffer.from(signAdminCookie(), "hex");
  return incoming.length === expected.length && timingSafeEqual(incoming, expected);
}
