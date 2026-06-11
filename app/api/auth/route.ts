import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = process.env.ADMIN_TOKEN;
  const isAdmin = Boolean(token && request.headers.get("x-admin-token") === token);
  return NextResponse.json({ success: true, data: { isAdmin } });
}
