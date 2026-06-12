import { NextResponse } from "next/server";
import { adminUnauthorizedResponse, isAdminRequest } from "../../../../lib/adminAuth";
import { getAccessControlSettings, updateAccessControlSettings } from "../../../../lib/db";

function publicSettings(settings: Awaited<ReturnType<typeof getAccessControlSettings>>) {
  return {
    isEnabled: settings.isEnabled,
    hasKey: settings.hasKey,
    currentKey: settings.currentKey,
    keyExpiresAt: settings.keyExpiresAt,
    keySecondsRemaining: settings.keySecondsRemaining,
    updatedAt: settings.updatedAt
  };
}

export async function GET(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(adminUnauthorizedResponse(), { status: 401 });
    }
    const settings = await getAccessControlSettings();
    return NextResponse.json({ success: true, data: publicSettings(settings), error: null });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to load access settings."
    }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(adminUnauthorizedResponse(), { status: 401 });
    }
    const body = await request.json();
    const settings = await updateAccessControlSettings({
      isEnabled: typeof body.isEnabled === "boolean" ? body.isEnabled : undefined,
      rotateNow: Boolean(body.rotateNow)
    });
    return NextResponse.json({ success: true, data: publicSettings(settings), error: null });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to save access settings."
    }, { status: 500 });
  }
}
