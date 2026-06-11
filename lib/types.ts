export type Moment = {
  id: number | string;
  date: string;
  tag: string;
  content: string;
  imageUrl?: string | null;
  linkUrl?: string | null;
};

export type TodoItem = {
  id: number | string;
  category: string;
  title: string;
  status: "todo" | "doing" | "done" | "paused";
};

export type WorkItem = {
  id: number | string;
  type: "book" | "movie";
  title: string;
  creator?: string | null;
  status: string;
  date?: string | null;
  note?: string | null;
  blogUrl?: string | null;
};

export type BlogPost = {
  id: number | string;
  title: string;
  slug: string;
  date: string;
  category: string;
  summary: string;
  content?: string | null;
};

export type SiteData = {
  moments: Moment[];
  todos: TodoItem[];
  works: WorkItem[];
  blogPosts: BlogPost[];
};
