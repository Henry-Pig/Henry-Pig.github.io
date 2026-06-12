import { NextResponse } from "next/server";
import { adminUnauthorizedResponse, isAdminRequest } from "../../../../lib/adminAuth";
import { getAllMusicTracks } from "../../../../lib/db";

export async function GET(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(adminUnauthorizedResponse(), { status: 401 });
    }

    const tracks = await getAllMusicTracks();
    return NextResponse.json({ success: true, data: tracks, error: null });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Failed to load music."
    }, { status: 500 });
  }
}
