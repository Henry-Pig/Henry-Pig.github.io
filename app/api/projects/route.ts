import { NextResponse } from "next/server";
import { createProject, deleteProject, getProjects, hasDatabase, updateProject } from "../../../lib/db";
import type { ProjectItem } from "../../../lib/types";

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
    .replace(/^-+|-+$/g, "") || `project-${Date.now()}`;
}

function parseProject(body: any): Omit<ProjectItem, "id"> {
  if (!body.title || !body.period || !body.summary) {
    throw new Error("Project title, period, and summary are required.");
  }

  const content = typeof body.content === "string"
    ? [{ title: "项目详情", body: body.content }]
    : Array.isArray(body.content)
      ? body.content
      : [];

  return {
    title: body.title,
    slug: body.slug || slugify(body.title),
    period: body.period,
    type: body.type || null,
    role: body.role || null,
    summary: body.summary,
    description: body.description || null,
    content,
    techStack: typeof body.techStack === "string"
      ? body.techStack.split(",").map((item: string) => item.trim()).filter(Boolean)
      : Array.isArray(body.techStack)
        ? body.techStack
        : [],
    coverImage: body.coverImage || null,
    repoUrl: body.repoUrl || null,
    demoUrl: body.demoUrl || null,
    sortOrder: Number(body.sortOrder || 0)
  };
}

export async function GET() {
  const data = await getProjects();
  return NextResponse.json({ success: true, data, error: null, databaseConfigured: hasDatabase() });
}

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ success: false, data: null, error: "Unauthorized. Please check ADMIN_TOKEN." }, { status: 401 });
    }
    const data = await createProject(parseProject(await request.json()));
    return NextResponse.json({ success: true, data, error: null });
  } catch (error) {
    return NextResponse.json({ success: false, data: null, error: error instanceof Error ? error.message : "Unexpected server error." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ success: false, data: null, error: "Unauthorized. Please check ADMIN_TOKEN." }, { status: 401 });
    }
    const body = await request.json();
    if (!body.id) throw new Error("Project id is required.");
    const data = await updateProject(body.id, parseProject(body));
    return NextResponse.json({ success: true, data, error: null });
  } catch (error) {
    return NextResponse.json({ success: false, data: null, error: error instanceof Error ? error.message : "Unexpected server error." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ success: false, data: null, error: "Unauthorized. Please check ADMIN_TOKEN." }, { status: 401 });
    }
    const id = new URL(request.url).searchParams.get("id");
    if (!id) throw new Error("Project id is required.");
    const data = await deleteProject(id);
    return NextResponse.json({ success: true, data, error: null });
  } catch (error) {
    return NextResponse.json({ success: false, data: null, error: error instanceof Error ? error.message : "Unexpected server error." }, { status: 500 });
  }
}
