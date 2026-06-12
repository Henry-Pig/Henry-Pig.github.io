import { NextResponse } from "next/server";
import { ACCESS_COOKIE_NAME, signAccessHash, verifyAccessKey } from "../../../lib/accessControl";
import { getAccessControlSettings } from "../../../lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const accessKey = typeof body.accessKey === "string" ? body.accessKey : "";
    const settings = await getAccessControlSettings();

    if (!settings.isEnabled) {
      return NextResponse.json({ success: true, data: { granted: true }, error: null });
    }

    if (!verifyAccessKey(accessKey, settings.keyHash)) {
      return NextResponse.json({ success: false, data: { granted: false }, error: "查看秘钥不正确。" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, data: { granted: true }, error: null });
    response.cookies.set({
      name: ACCESS_COOKIE_NAME,
      value: signAccessHash(settings.keyHash as string),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: settings.keySecondsRemaining || 60 * 15
    });
    return response;
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: { granted: false },
      error: error instanceof Error ? error.message : "秘钥验证失败。"
    }, { status: 500 });
  }
}
