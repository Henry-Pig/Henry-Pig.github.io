import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { adminUnauthorizedResponse, isAdminRequest } from "../../../../../lib/adminAuth";
import { deleteMusicTrack, updateMusicTrack } from "../../../../../lib/db";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(adminUnauthorizedResponse(), { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const track = await updateMusicTrack(id, {
      title: typeof body.title === "string" ? body.title.trim() : undefined,
      artist: typeof body.artist === "string" ? body.artist.trim() || null : undefined,
      sortOrder: body.sortOrder === undefined ? undefined : Number(body.sortOrder),
      isEnabled: typeof body.isEnabled === "boolean" ? body.isEnabled : undefined,
      duration: body.duration === undefined || body.duration === null ? undefined : Number(body.duration)
    });

    return NextResponse.json({ success: true, data: track, error: null });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to update music."
    }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(adminUnauthorizedResponse(), { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteMusicTrack(id);
    let blobWarning: string | null = null;
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();

    if (blobToken && deleted.url) {
      try {
        await del(deleted.url, { token: blobToken });
      } catch (error) {
        blobWarning = error instanceof Error ? error.message : "Blob delete failed.";
      }
    }

    return NextResponse.json({ success: true, data: { id: deleted.id, blobWarning }, error: null });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to delete music."
    }, { status: 500 });
  }
}
