import { NextResponse } from "next/server";
import { createGuestMessage, getGuestMessages, hasDatabase } from "../../../lib/db";

export async function GET() {
  try {
    const messages = await getGuestMessages();
    return NextResponse.json({ success: true, data: messages, error: null });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Unexpected server error."
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!hasDatabase()) {
      return NextResponse.json({
        success: false,
        data: null,
        error: "DATABASE_URL is not configured. Guest messages need a database."
      }, { status: 503 });
    }

    const body = await request.json();
    const nickname = String(body.nickname || "匿名访客").trim().slice(0, 24) || "匿名访客";
    const message = String(body.message || "").trim().slice(0, 160);

    if (!message) {
      return NextResponse.json({ success: false, data: null, error: "留言内容不能为空。" }, { status: 400 });
    }

    const data = await createGuestMessage({ nickname, message });
    return NextResponse.json({ success: true, data, error: null });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unexpected server error."
    }, { status: 500 });
  }
}
