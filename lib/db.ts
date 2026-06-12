import postgres from "postgres";
import { defaultProjects } from "./project-data";
import { seedData } from "./seed";
import type { BlogPost, Moment, MusicTrack, ProjectItem, SiteData, TodoItem, WorkItem } from "./types";

const connectionString = process.env.DATABASE_URL;
const sql = connectionString ? postgres(connectionString, { ssl: "require" }) : null;

async function ensureSchema() {
  if (!sql) return;

  await sql`
    create table if not exists moments (
      id serial primary key,
      title text,
      date text not null,
      tag text not null,
      content text not null,
      image_url text,
      link_url text,
      created_at timestamptz not null default now()
    )
  `;

  await sql`alter table moments add column if not exists title text`;
  await sql`alter table moments add column if not exists image_url text`;
  await sql`alter table moments add column if not exists link_url text`;

  await sql`
    create table if not exists todos (
      id serial primary key,
      category text not null,
      title text not null,
      status text not null default 'todo',
      created_at timestamptz not null default now()
    )
  `;

  await sql`alter table todos add column if not exists updated_at timestamptz not null default now()`;

  await sql`
    create table if not exists works (
      id serial primary key,
      type text not null,
      title text not null,
      creator text,
      status text not null,
      date text,
      note text,
      reflection text,
      cover_image_url text,
      blog_url text,
      created_at timestamptz not null default now()
    )
  `;

  await sql`alter table works add column if not exists reflection text`;
  await sql`alter table works add column if not exists cover_image_url text`;
  await sql`alter table works add column if not exists updated_at timestamptz not null default now()`;

  await sql`
    create table if not exists blog_posts (
      id serial primary key,
      title text not null,
      slug text not null unique,
      date text not null,
      category text not null,
      summary text not null,
      content text,
      cover_image_url text,
      created_at timestamptz not null default now()
    )
  `;

  await sql`alter table blog_posts add column if not exists cover_image_url text`;

  await sql`
    create table if not exists projects (
      id serial primary key,
      title text not null,
      slug text not null unique,
      period text not null,
      type text,
      role text,
      summary text not null,
      description text,
      content jsonb,
      tech_stack text[] not null default '{}',
      cover_image text,
      repo_url text,
      demo_url text,
      sort_order integer not null default 0,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists music_tracks (
      id serial primary key,
      title text not null,
      artist text,
      url text not null,
      filename text,
      mime_type text,
      size_bytes bigint,
      duration double precision,
      sort_order integer not null default 0,
      is_enabled boolean not null default true,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;

  await seedEmptyTables();
}

async function seedEmptyTables() {
  if (!sql) return;

  const [momentCount] = await sql<{ count: string }[]>`select count(*)::text as count from moments`;
  if (Number(momentCount.count) === 0) {
    for (const item of seedData.moments) {
      await sql`
        insert into moments (title, date, tag, content, image_url, link_url)
        values (${item.title || null}, ${item.date}, ${item.tag}, ${item.content}, ${item.imageUrl || null}, ${item.linkUrl || null})
      `;
    }
  }

  const [todoCount] = await sql<{ count: string }[]>`select count(*)::text as count from todos`;
  if (Number(todoCount.count) === 0) {
    for (const item of seedData.todos) {
      await sql`
        insert into todos (category, title, status)
        values (${item.category}, ${item.title}, ${item.status})
      `;
    }
  }

  const [workCount] = await sql<{ count: string }[]>`select count(*)::text as count from works`;
  if (Number(workCount.count) === 0) {
    for (const item of seedData.works) {
      await sql`
        insert into works (type, title, creator, status, date, note, reflection, cover_image_url, blog_url)
        values (
          ${item.type},
          ${item.title},
          ${item.creator || null},
          ${item.status},
          ${item.date || null},
          ${item.note || null},
          ${item.reflection || null},
          ${item.coverImageUrl || null},
          ${item.blogUrl || null}
        )
      `;
    }
  }

  const [blogCount] = await sql<{ count: string }[]>`select count(*)::text as count from blog_posts`;
  if (Number(blogCount.count) === 0) {
    for (const item of seedData.blogPosts) {
      await sql`
        insert into blog_posts (title, slug, date, category, summary, content, cover_image_url)
        values (${item.title}, ${item.slug}, ${item.date}, ${item.category}, ${item.summary}, ${item.content || null}, ${item.coverImageUrl || null})
        on conflict (slug) do nothing
      `;
    }
  }

  const [projectCount] = await sql<{ count: string }[]>`select count(*)::text as count from projects`;
  if (Number(projectCount.count) === 0) {
    for (const item of defaultProjects) {
      await sql`
        insert into projects (title, slug, period, type, role, summary, description, content, tech_stack, cover_image, repo_url, demo_url, sort_order)
        values (
          ${item.title},
          ${item.slug},
          ${item.period},
          ${item.type || null},
          ${item.role || null},
          ${item.summary},
          ${item.description || null},
          ${sql.json(item.content || [])},
          ${item.techStack},
          ${item.coverImage || null},
          ${item.repoUrl || null},
          ${item.demoUrl || null},
          ${item.sortOrder || 0}
        )
        on conflict (slug) do nothing
      `;
    }
  }
}

export async function getSiteData(): Promise<SiteData> {
  if (!sql) return seedData;

  await ensureSchema();

  const [moments, todos, works, blogPosts] = await Promise.all([
    sql<Moment[]>`
      select
        id,
        title,
        date,
        tag,
        content,
        image_url as "imageUrl",
        link_url as "linkUrl",
        created_at::text as "createdAt"
      from moments
      order by created_at desc, id desc
    `,
    sql<TodoItem[]>`
      select id, category, title, status, updated_at::text as "updatedAt"
      from todos
      order by id asc
    `,
    sql<WorkItem[]>`
      select
        id,
        type,
        title,
        creator,
        status,
        date,
        note,
        reflection,
        cover_image_url as "coverImageUrl",
        blog_url as "blogUrl",
        updated_at::text as "updatedAt"
      from works
      order by id asc
    `,
    sql<BlogPost[]>`
      select
        id,
        title,
        slug,
        date,
        category,
        summary,
        content,
        cover_image_url as "coverImageUrl",
        created_at::text as "createdAt"
      from blog_posts
      order by created_at desc, id desc
    `
  ]);

  return {
    moments: moments.length ? moments : seedData.moments,
    todos: todos.length ? todos : seedData.todos,
    works: works.length ? works : seedData.works,
    blogPosts: blogPosts.length ? blogPosts : seedData.blogPosts
  };
}

export function hasDatabase() {
  return Boolean(sql);
}

function mapMusicTrack(row: any): MusicTrack {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    url: row.url,
    filename: row.filename,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes === null || row.sizeBytes === undefined ? null : Number(row.sizeBytes),
    duration: row.duration === null || row.duration === undefined ? null : Number(row.duration),
    sortOrder: Number(row.sortOrder || 0),
    isEnabled: Boolean(row.isEnabled),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

export async function getPublicMusicTracks() {
  if (!sql) return [];
  await ensureSchema();
  const rows = await sql<any[]>`
    select
      id,
      title,
      artist,
      url,
      duration,
      sort_order as "sortOrder",
      is_enabled as "isEnabled"
    from music_tracks
    where is_enabled = true
    order by sort_order asc, created_at asc, id asc
  `;
  return rows.map(mapMusicTrack);
}

export async function getAllMusicTracks() {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureSchema();
  const rows = await sql<any[]>`
    select
      id,
      title,
      artist,
      url,
      filename,
      mime_type as "mimeType",
      size_bytes as "sizeBytes",
      duration,
      sort_order as "sortOrder",
      is_enabled as "isEnabled",
      created_at::text as "createdAt",
      updated_at::text as "updatedAt"
    from music_tracks
    order by sort_order asc, created_at asc, id asc
  `;
  return rows.map(mapMusicTrack);
}

export async function createMusicTrack(input: Omit<MusicTrack, "id" | "createdAt" | "updatedAt">) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureSchema();
  const [track] = await sql<any[]>`
    insert into music_tracks (title, artist, url, filename, mime_type, size_bytes, duration, sort_order, is_enabled)
    values (
      ${input.title},
      ${input.artist || null},
      ${input.url},
      ${input.filename || null},
      ${input.mimeType || null},
      ${input.sizeBytes || null},
      ${input.duration || null},
      ${input.sortOrder || 0},
      ${input.isEnabled}
    )
    returning
      id,
      title,
      artist,
      url,
      filename,
      mime_type as "mimeType",
      size_bytes as "sizeBytes",
      duration,
      sort_order as "sortOrder",
      is_enabled as "isEnabled",
      created_at::text as "createdAt",
      updated_at::text as "updatedAt"
  `;
  return mapMusicTrack(track);
}

export async function updateMusicTrack(id: number | string, input: Partial<Pick<MusicTrack, "title" | "artist" | "sortOrder" | "isEnabled" | "duration">>) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureSchema();
  const [track] = await sql<any[]>`
    update music_tracks
    set
      title = coalesce(${input.title ?? null}, title),
      artist = case when ${input.artist === undefined} then artist else ${input.artist ?? null} end,
      sort_order = coalesce(${input.sortOrder ?? null}, sort_order),
      is_enabled = coalesce(${input.isEnabled ?? null}, is_enabled),
      duration = coalesce(${input.duration ?? null}, duration),
      updated_at = now()
    where id = ${Number(id)}
    returning
      id,
      title,
      artist,
      url,
      filename,
      mime_type as "mimeType",
      size_bytes as "sizeBytes",
      duration,
      sort_order as "sortOrder",
      is_enabled as "isEnabled",
      created_at::text as "createdAt",
      updated_at::text as "updatedAt"
  `;
  if (!track) throw new Error("Music track not found.");
  return mapMusicTrack(track);
}

export async function deleteMusicTrack(id: number | string) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureSchema();
  const [deleted] = await sql<any[]>`
    delete from music_tracks
    where id = ${Number(id)}
    returning id, url
  `;
  if (!deleted) throw new Error("Music track not found.");
  return deleted as { id: number; url: string };
}

export async function createMoment(input: Omit<Moment, "id">) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureSchema();
  const [moment] = await sql<Moment[]>`
    insert into moments (title, date, tag, content, image_url, link_url)
    values (${input.title || null}, ${input.date}, ${input.tag}, ${input.content}, ${input.imageUrl || null}, ${input.linkUrl || null})
    returning
      id,
      title,
      date,
      tag,
      content,
      image_url as "imageUrl",
      link_url as "linkUrl",
      created_at::text as "createdAt"
  `;
  return moment;
}

export async function createTodo(input: Omit<TodoItem, "id">) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureSchema();
  const [todo] = await sql<TodoItem[]>`
    insert into todos (category, title, status)
    values (${input.category}, ${input.title}, ${input.status})
    returning id, category, title, status, updated_at::text as "updatedAt"
  `;
  return todo;
}

export async function createWork(input: Omit<WorkItem, "id">) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureSchema();
  const [work] = await sql<WorkItem[]>`
    insert into works (type, title, creator, status, date, note, reflection, cover_image_url, blog_url)
    values (
      ${input.type},
      ${input.title},
      ${input.creator || null},
      ${input.status},
      ${input.date || null},
      ${input.note || null},
      ${input.reflection || null},
      ${input.coverImageUrl || null},
      ${input.blogUrl || null}
    )
    returning
      id,
      type,
      title,
      creator,
      status,
      date,
      note,
      reflection,
      cover_image_url as "coverImageUrl",
      blog_url as "blogUrl",
      updated_at::text as "updatedAt"
  `;
  return work;
}

export async function createBlogPost(input: Omit<BlogPost, "id">) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureSchema();
  let slug = input.slug;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidate = attempt === 0 ? slug : `${slug}-${attempt + 1}`;
    const [existing] = await sql<{ id: number }[]>`select id from blog_posts where slug = ${candidate} limit 1`;
    if (!existing) {
      slug = candidate;
      break;
    }
  }
  const [post] = await sql<BlogPost[]>`
    insert into blog_posts (title, slug, date, category, summary, content, cover_image_url)
    values (${input.title}, ${slug}, ${input.date}, ${input.category}, ${input.summary}, ${input.content || null}, ${input.coverImageUrl || null})
    returning
      id,
      title,
      slug,
      date,
      category,
      summary,
      content,
      cover_image_url as "coverImageUrl",
      created_at::text as "createdAt"
  `;
  return post;
}

export async function updateTodoStatus(id: number, status: TodoItem["status"]) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureSchema();
  const [todo] = await sql<TodoItem[]>`
    update todos
    set status = ${status}, updated_at = now()
    where id = ${id}
    returning id, category, title, status, updated_at::text as "updatedAt"
  `;
  if (!todo) throw new Error("Todo not found.");
  return todo;
}

export async function updateWork(input: Pick<WorkItem, "id" | "status"> & Partial<Pick<WorkItem, "note" | "reflection">>) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureSchema();
  const [work] = await sql<WorkItem[]>`
    update works
    set
      status = ${input.status},
      note = coalesce(${input.note ?? null}, note),
      reflection = coalesce(${input.reflection ?? null}, reflection),
      updated_at = now()
    where id = ${Number(input.id)}
    returning
      id,
      type,
      title,
      creator,
      status,
      date,
      note,
      reflection,
      cover_image_url as "coverImageUrl",
      blog_url as "blogUrl",
      updated_at::text as "updatedAt"
  `;
  if (!work) throw new Error("Work item not found.");
  return work;
}

export async function deleteContent(type: "moment" | "todo" | "work" | "blog", id: number | string) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureSchema();

  if (type === "moment") {
    const [deleted] = await sql`delete from moments where id = ${Number(id)} returning id`;
    if (!deleted) throw new Error("Moment not found.");
    return deleted;
  }

  if (type === "todo") {
    const [deleted] = await sql`delete from todos where id = ${Number(id)} returning id`;
    if (!deleted) throw new Error("Todo not found.");
    return deleted;
  }

  if (type === "work") {
    const [deleted] = await sql`delete from works where id = ${Number(id)} returning id`;
    if (!deleted) throw new Error("Work item not found.");
    return deleted;
  }

  const [deleted] = await sql`
    delete from blog_posts
    where id::text = ${String(id)} or slug = ${String(id)}
    returning id
  `;
  if (!deleted) throw new Error("Blog post not found.");
  return deleted;
}

function mapProject(row: any): ProjectItem {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    period: row.period,
    type: row.type,
    role: row.role,
    summary: row.summary,
    description: row.description,
    content: row.content || [],
    techStack: row.techStack || [],
    coverImage: row.coverImage,
    repoUrl: row.repoUrl,
    demoUrl: row.demoUrl,
    sortOrder: row.sortOrder
  };
}

export async function getProjects(): Promise<ProjectItem[]> {
  if (!sql) return defaultProjects;
  await ensureSchema();
  const rows = await sql<any[]>`
    select
      id,
      title,
      slug,
      period,
      type,
      role,
      summary,
      description,
      content,
      tech_stack as "techStack",
      cover_image as "coverImage",
      repo_url as "repoUrl",
      demo_url as "demoUrl",
      sort_order as "sortOrder"
    from projects
    order by sort_order asc, period asc, id asc
  `;
  return rows.map(mapProject);
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug || String(project.id) === slug) || null;
}

export async function createProject(input: Omit<ProjectItem, "id">) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureSchema();
  const [project] = await sql<any[]>`
    insert into projects (title, slug, period, type, role, summary, description, content, tech_stack, cover_image, repo_url, demo_url, sort_order)
    values (
      ${input.title},
      ${input.slug},
      ${input.period},
      ${input.type || null},
      ${input.role || null},
      ${input.summary},
      ${input.description || null},
      ${sql.json(input.content || [])},
      ${input.techStack || []},
      ${input.coverImage || null},
      ${input.repoUrl || null},
      ${input.demoUrl || null},
      ${input.sortOrder || 0}
    )
    returning
      id, title, slug, period, type, role, summary, description, content,
      tech_stack as "techStack", cover_image as "coverImage", repo_url as "repoUrl",
      demo_url as "demoUrl", sort_order as "sortOrder"
  `;
  return mapProject(project);
}

export async function updateProject(id: number | string, input: Omit<ProjectItem, "id">) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureSchema();
  const [project] = await sql<any[]>`
    update projects
    set
      title = ${input.title},
      slug = ${input.slug},
      period = ${input.period},
      type = ${input.type || null},
      role = ${input.role || null},
      summary = ${input.summary},
      description = ${input.description || null},
      content = ${sql.json(input.content || [])},
      tech_stack = ${input.techStack || []},
      cover_image = ${input.coverImage || null},
      repo_url = ${input.repoUrl || null},
      demo_url = ${input.demoUrl || null},
      sort_order = ${input.sortOrder || 0},
      updated_at = now()
    where id = ${Number(id)}
    returning
      id, title, slug, period, type, role, summary, description, content,
      tech_stack as "techStack", cover_image as "coverImage", repo_url as "repoUrl",
      demo_url as "demoUrl", sort_order as "sortOrder"
  `;
  if (!project) throw new Error("Project not found.");
  return mapProject(project);
}

export async function deleteProject(id: number | string) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureSchema();
  const [deleted] = await sql`delete from projects where id = ${Number(id)} returning id`;
  if (!deleted) throw new Error("Project not found.");
  return deleted;
}
