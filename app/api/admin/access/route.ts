import { NextResponse } from "next/server";
import { adminUnauthorizedResponse, isAdminRequest } from "../../../../lib/adminAuth";
import { getAccessControlSettings, updateAccessControlSettings } from "../../../../lib/db";

function publicSettings(settings: Awaited<ReturnType<typeof getAccessControlSettings>>) {
  return {
    isEnabled: settings.isEnabled,
    hasKey: settings.hasKey,
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
      accessKey: typeof body.accessKey === "string" ? body.accessKey : undefined
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
