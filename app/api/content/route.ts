import { NextResponse } from "next/server";
import {
  createBlogPost,
  createMoment,
  createTodo,
  createWork,
  getSiteData,
  hasDatabase
} from "../../../lib/db";

function isAuthorized(request: Request) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  return request.headers.get("x-admin-token") === token;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  const data = await getSiteData();
  return NextResponse.json({ data, databaseConfigured: hasDatabase() });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized. Please check ADMIN_TOKEN." }, { status: 401 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({ message: "DATABASE_URL is not configured. Add a Postgres database first." }, { status: 503 });
  }

  const body = await request.json();

  if (body.type === "moment") {
    await createMoment({
      date: body.date || new Date().toISOString().slice(0, 10),
      tag: body.tag || "生活",
      content: body.content,
      imageUrl: body.imageUrl || null,
      linkUrl: body.linkUrl || null
    });
  } else if (body.type === "todo") {
    await createTodo({
      category: body.category || "也许会做的小计划",
      title: body.title,
      status: body.status || "todo"
    });
  } else if (body.type === "work") {
    await createWork({
      type: body.workType || "book",
      title: body.title,
      creator: body.creator || null,
      status: body.status || "想读",
      date: body.date || null,
      note: body.note || null,
      blogUrl: body.blogUrl || null
    });
  } else if (body.type === "blog") {
    await createBlogPost({
      title: body.title,
      slug: body.slug || slugify(body.title),
      date: body.date || new Date().toISOString().slice(0, 10),
      category: body.category || "随笔",
      summary: body.summary || "",
      content: body.content || null
    });
  } else {
    return NextResponse.json({ message: "Unknown content type." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
