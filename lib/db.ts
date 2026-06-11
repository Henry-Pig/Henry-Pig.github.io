import postgres from "postgres";
import { seedData } from "./seed";
import type { BlogPost, Moment, SiteData, TodoItem, WorkItem } from "./types";

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
  const [post] = await sql<BlogPost[]>`
    insert into blog_posts (title, slug, date, category, summary, content, cover_image_url)
    values (${input.title}, ${input.slug}, ${input.date}, ${input.category}, ${input.summary}, ${input.content || null}, ${input.coverImageUrl || null})
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
  return work;
}
