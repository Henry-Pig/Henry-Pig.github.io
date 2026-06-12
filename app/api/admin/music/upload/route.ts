import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { adminUnauthorizedResponse, isAdminRequest } from "../../../../../lib/adminAuth";
import { createMusicTrack } from "../../../../../lib/db";

const allowedTypes = new Set(["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/flac", "audio/x-flac"]);
const allowedExtensions = new Set(["mp3", "wav", "ogg", "m4a", "flac"]);
const maxAudioSize = 50 * 1024 * 1024;

function cleanFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

export async function POST(request: Request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(adminUnauthorizedResponse(), { status: 401 });
    }

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
    if (!blobToken) {
      return NextResponse.json({
        success: false,
        data: null,
        error: "BLOB_READ_WRITE_TOKEN is not configured. Music upload needs a Public Vercel Blob Store."
      }, { status: 503 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const title = String(formData.get("title") || "").trim();
    const artist = String(formData.get("artist") || "").trim();
    const sortOrder = Number(formData.get("sortOrder") || 0);

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, data: null, error: "No audio file provided." }, { status: 400 });
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    if (!allowedTypes.has(file.type) || !allowedExtensions.has(extension)) {
      return NextResponse.json({
        success: false,
        data: null,
        error: "Only mp3, wav, ogg, m4a, and flac audio files are allowed."
      }, { status: 400 });
    }

    if (file.size > maxAudioSize) {
      return NextResponse.json({ success: false, data: null, error: "Audio size must be 50MB or smaller." }, { status: 400 });
    }

    const safeName = cleanFileName(file.name || `track.${extension}`);
    const pathname = `music/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
    const blob = await put(pathname, file, {
      access: "public",
      contentType: file.type,
      token: blobToken
    });

    const track = await createMusicTrack({
      title: title || safeName.replace(/\.[^.]+$/, ""),
      artist: artist || null,
      url: blob.url,
      filename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      duration: null,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      isEnabled: true
    });

    return NextResponse.json({ success: true, data: track, error: null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Music upload failed.";
    const isTokenError = /access denied|valid token|unauthorized|forbidden/i.test(message);
    const isPrivateStoreError = /cannot use public access on a private store|configured with private access/i.test(message);
    return NextResponse.json({
      success: false,
      data: null,
      error: isPrivateStoreError
        ? "This Blob Store is private, but music playback needs public audio URLs. Please use a Public Vercel Blob Store."
        : isTokenError
        ? "Vercel Blob token is invalid for this Blob store. Please reconnect the Blob store and redeploy."
        : message
    }, { status: isTokenError || isPrivateStoreError ? 401 : 500 });
  }
}
