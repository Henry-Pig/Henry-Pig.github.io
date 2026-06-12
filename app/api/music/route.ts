import { NextResponse } from "next/server";
import { getPublicMusicTracks } from "../../../lib/db";

export async function GET() {
  try {
    const tracks = await getPublicMusicTracks();
    return NextResponse.json({ success: true, data: tracks, error: null });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Failed to load music."
    }, { status: 500 });
  }
}
