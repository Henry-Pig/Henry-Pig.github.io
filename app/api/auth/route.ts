import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, signAdminCookie } from "../../../lib/adminAuth";

export async function GET(request: Request) {
  const token = process.env.ADMIN_TOKEN;
  const isAdmin = Boolean(token && request.headers.get("x-admin-token") === token);
  const response = NextResponse.json({ success: true, data: { isAdmin } });

  if (isAdmin) {
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: signAdminCookie(),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });
  } else {
    response.cookies.delete(ADMIN_COOKIE_NAME);
  }

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, data: { isAdmin: false } });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
