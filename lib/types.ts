export type Moment = {
  id: number | string;
  title?: string | null;
  date: string;
  tag: string;
  content: string;
  imageUrl?: string | null;
  linkUrl?: string | null;
  createdAt?: string | null;
};

export type TodoItem = {
  id: number | string;
  category: string;
  title: string;
  status: "todo" | "doing" | "done" | "paused";
  updatedAt?: string | null;
};

export type WorkItem = {
  id: number | string;
  type: "book" | "movie" | "other";
  title: string;
  creator?: string | null;
  status: string;
  date?: string | null;
  note?: string | null;
  reflection?: string | null;
  coverImageUrl?: string | null;
  blogUrl?: string | null;
  updatedAt?: string | null;
};

export type BlogPost = {
  id: number | string;
  title: string;
  slug: string;
  date: string;
  category: string;
  summary: string;
  content?: string | null;
  coverImageUrl?: string | null;
  createdAt?: string | null;
};

export type SiteData = {
  moments: Moment[];
  todos: TodoItem[];
  works: WorkItem[];
  blogPosts: BlogPost[];
};

export type MusicTrack = {
  id: number | string;
  title: string;
  artist?: string | null;
  url: string;
  filename?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  duration?: number | null;
  sortOrder: number;
  isEnabled: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AccessControlSettings = {
  isEnabled: boolean;
  hasKey: boolean;
  keyHash?: string | null;
  updatedAt?: string | null;
};

export type ProjectItem = {
  id: number | string;
  title: string;
  slug: string;
  period: string;
  type?: string | null;
  role?: string | null;
  summary: string;
  description?: string | null;
  content?: ProjectSection[] | null;
  techStack: string[];
  coverImage?: string | null;
  repoUrl?: string | null;
  demoUrl?: string | null;
  sortOrder?: number;
};

export type ProjectSection = {
  title: string;
  body?: string;
  items?: string[];
  metrics?: Array<{ label: string; value: string; note?: string }>;
};
