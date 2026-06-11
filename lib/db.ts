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
      date text not null,
      tag text not null,
      content text not null,
      image_url text,
      link_url text,
      created_at timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists todos (
      id serial primary key,
      category text not null,
      title text not null,
      status text not null default 'todo',
      created_at timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists works (
      id serial primary key,
      type text not null,
      title text not null,
      creator text,
      status text not null,
      date text,
      note text,
      blog_url text,
      created_at timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists blog_posts (
      id serial primary key,
      title text not null,
      slug text not null unique,
      date text not null,
      category text not null,
      summary text not null,
      content text,
      created_at timestamptz not null default now()
    )
  `;
}

export async function getSiteData(): Promise<SiteData> {
  if (!sql) return seedData;

  await ensureSchema();

  const [moments, todos, works, blogPosts] = await Promise.all([
    sql<Moment[]>`
      select id, date, tag, content, image_url as "imageUrl", link_url as "linkUrl"
      from moments
      order by created_at desc, id desc
    `,
    sql<TodoItem[]>`
      select id, category, title, status
      from todos
      order by id asc
    `,
    sql<WorkItem[]>`
      select id, type, title, creator, status, date, note, blog_url as "blogUrl"
      from works
      order by id asc
    `,
    sql<BlogPost[]>`
      select id, title, slug, date, category, summary, content
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
  await sql`
    insert into moments (date, tag, content, image_url, link_url)
    values (${input.date}, ${input.tag}, ${input.content}, ${input.imageUrl || null}, ${input.linkUrl || null})
  `;
}

export async function createTodo(input: Omit<TodoItem, "id">) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureSchema();
  await sql`
    insert into todos (category, title, status)
    values (${input.category}, ${input.title}, ${input.status})
  `;
}

export async function createWork(input: Omit<WorkItem, "id">) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureSchema();
  await sql`
    insert into works (type, title, creator, status, date, note, blog_url)
    values (
      ${input.type},
      ${input.title},
      ${input.creator || null},
      ${input.status},
      ${input.date || null},
      ${input.note || null},
      ${input.blogUrl || null}
    )
  `;
}

export async function createBlogPost(input: Omit<BlogPost, "id">) {
  if (!sql) throw new Error("DATABASE_URL is not configured.");
  await ensureSchema();
  await sql`
    insert into blog_posts (title, slug, date, category, summary, content)
    values (${input.title}, ${input.slug}, ${input.date}, ${input.category}, ${input.summary}, ${input.content || null})
  `;
}
