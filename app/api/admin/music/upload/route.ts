import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { createMusicTrack } from "../../../../../lib/db";

const allowedTypes = new Set(["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/ogg", "audio/mp4", "audio/x-m4a", "audio/flac", "audio/x-flac"]);
const allowedExtensions = new Set(["mp3", "wav", "ogg", "m4a", "flac"]);
const maxAudioSize = 50 * 1024 * 1024;

type MusicUploadPayload = {
  adminToken?: string;
  title?: string;
  artist?: string;
  sortOrder?: number;
  filename?: string;
  mimeType?: string;
  sizeBytes?: number;
};

function parsePayload(payload: string | null): MusicUploadPayload {
  if (!payload) return {};
  try {
    return JSON.parse(payload) as MusicUploadPayload;
  } catch {
    return {};
  }
}

function isAuthorized(token?: string) {
  return Boolean(process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN);
}

function extensionFromPathname(pathname: string) {
  return pathname.split("?")[0].split(".").pop()?.toLowerCase() || "";
}

export async function POST(request: Request) {
  try {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
    if (!blobToken) {
      return NextResponse.json({
        success: false,
        data: null,
        error: "BLOB_READ_WRITE_TOKEN is not configured. Music upload needs a Public Vercel Blob Store."
      }, { status: 503 });
    }

    const body = await request.json() as HandleUploadBody;
    const response = await handleUpload({
      token: blobToken,
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const payload = parsePayload(clientPayload);
        const extension = extensionFromPathname(pathname);

        if (!isAuthorized(payload.adminToken)) {
          throw new Error("Unauthorized. Please check ADMIN_TOKEN.");
        }

        if (!allowedExtensions.has(extension)) {
          throw new Error("Only mp3, wav, ogg, m4a, and flac audio files are allowed.");
        }

        return {
          allowedContentTypes: Array.from(allowedTypes),
          maximumSizeInBytes: maxAudioSize,
          tokenPayload: JSON.stringify({
            title: payload.title || "",
            artist: payload.artist || "",
            sortOrder: payload.sortOrder || 0,
            filename: payload.filename || pathname.split("/").pop() || "music",
            mimeType: payload.mimeType || "",
            sizeBytes: payload.sizeBytes || null
          })
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = parsePayload(tokenPayload || null);
        const filename = payload.filename || blob.pathname.split("/").pop() || "music";
        await createMusicTrack({
          title: payload.title || filename.replace(/\.[^.]+$/, ""),
          artist: payload.artist || null,
          url: blob.url,
          filename,
          mimeType: payload.mimeType || null,
          sizeBytes: payload.sizeBytes || null,
          duration: null,
          sortOrder: Number(payload.sortOrder || 0),
          isEnabled: true
        });
      }
    });

    return NextResponse.json(response);
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
