import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxSize = 5 * 1024 * 1024;

function isAuthorized(request: Request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  return request.headers.get("x-admin-token") === token;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized. Please check ADMIN_TOKEN." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ success: false, error: "BLOB_READ_WRITE_TOKEN is not configured. You can still paste an image URL manually." }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "No image file provided." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ success: false, error: "Only jpg, png, webp, and gif images are allowed." }, { status: 400 });
  }

  if (file.size > maxSize) {
    return NextResponse.json({ success: false, error: "Image size must be 5MB or smaller." }, { status: 400 });
  }

  const extension = file.name.split(".").pop() || "jpg";
  const pathname = `uploads/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const blob = await put(pathname, file, {
    access: "public",
    contentType: file.type
  });

  return NextResponse.json({ success: true, data: { url: blob.url } });
}
