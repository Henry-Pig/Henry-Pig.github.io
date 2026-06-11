import { NextResponse } from "next/server";
import {
  createBlogPost,
  createMoment,
  createTodo,
  createWork,
  getSiteData,
  hasDatabase,
  updateTodoStatus,
  updateWork
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
  return NextResponse.json({ success: true, data, databaseConfigured: hasDatabase() });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized. Please check ADMIN_TOKEN." }, { status: 401 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({ success: false, error: "DATABASE_URL is not configured. Add a Postgres database first." }, { status: 503 });
  }

  const body = await request.json();
  let data;

  if (body.type === "moment") {
    if (!body.content) {
      return NextResponse.json({ success: false, error: "Moment content is required." }, { status: 400 });
    }
    data = await createMoment({
      title: body.title || null,
      date: body.date || new Date().toISOString().slice(0, 10),
      tag: body.tag || "生活",
      content: body.content,
      imageUrl: body.imageUrl || null,
      linkUrl: body.linkUrl || null
    });
  } else if (body.type === "todo") {
    if (!body.title) {
      return NextResponse.json({ success: false, error: "Todo title is required." }, { status: 400 });
    }
    data = await createTodo({
      category: body.category || "也许会做的小计划",
      title: body.title,
      status: body.status || "todo"
    });
  } else if (body.type === "work") {
    if (!body.title) {
      return NextResponse.json({ success: false, error: "Work title is required." }, { status: 400 });
    }
    data = await createWork({
      type: body.workType || "book",
      title: body.title,
      creator: body.creator || null,
      status: body.status || "想读",
      date: body.date || null,
      note: body.note || null,
      reflection: body.reflection || null,
      coverImageUrl: body.coverImageUrl || null,
      blogUrl: body.blogUrl || null
    });
  } else if (body.type === "blog") {
    if (!body.title || !body.summary) {
      return NextResponse.json({ success: false, error: "Blog title and summary are required." }, { status: 400 });
    }
    data = await createBlogPost({
      title: body.title,
      slug: body.slug || slugify(body.title),
      date: body.date || new Date().toISOString().slice(0, 10),
      category: body.category || "随笔",
      summary: body.summary || "",
      content: body.content || null,
      coverImageUrl: body.coverImageUrl || null
    });
  } else {
    return NextResponse.json({ success: false, error: "Unknown content type." }, { status: 400 });
  }

  return NextResponse.json({ success: true, data });
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized. Please check ADMIN_TOKEN." }, { status: 401 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({ success: false, error: "DATABASE_URL is not configured. Add a Postgres database first." }, { status: 503 });
  }

  const body = await request.json();

  if (body.type === "todo") {
    if (!body.id || !body.status) {
      return NextResponse.json({ success: false, error: "Todo id and status are required." }, { status: 400 });
    }
    const data = await updateTodoStatus(Number(body.id), body.status);
    return NextResponse.json({ success: true, data });
  }

  if (body.type === "work") {
    if (!body.id || !body.status) {
      return NextResponse.json({ success: false, error: "Work id and status are required." }, { status: 400 });
    }
    const data = await updateWork({
      id: Number(body.id),
      status: body.status,
      note: body.note,
      reflection: body.reflection
    });
    return NextResponse.json({ success: true, data });
  }

  return NextResponse.json({ success: false, error: "Unknown patch type." }, { status: 400 });
}
