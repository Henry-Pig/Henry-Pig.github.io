"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import type { BlogPost, Moment, TodoItem, WorkItem } from "../../lib/types";

type ApiResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

const emptyMoment = { title: "", date: "", tag: "生活", content: "", imageUrls: [] as string[], linkUrl: "" };
const emptyTodo = { category: "想完成的项目", title: "", status: "todo" };
const emptyWork = { workType: "book", title: "", creator: "", status: "want", date: "", note: "", reflection: "", coverImageUrl: "", blogUrl: "" };
const emptyBlog = { title: "", slug: "", date: "", category: "随笔", summary: "", content: "", coverImageUrl: "" };

function useAdmin() {
  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  async function verify(nextToken = token) {
    if (!nextToken) {
      setIsAdmin(false);
      setChecked(true);
      return false;
    }

    const response = await fetch("/api/auth", {
      headers: { "x-admin-token": nextToken }
    });
    const result = await response.json();
    const ok = Boolean(result.data?.isAdmin);
    setIsAdmin(ok);
    setChecked(true);
    return ok;
  }

  useEffect(() => {
    const saved = localStorage.getItem("admin-token") || "";
    setToken(saved);
    verify(saved);
  }, []);

  function saveToken(nextToken: string) {
    localStorage.setItem("admin-token", nextToken);
    setToken(nextToken);
    window.dispatchEvent(new Event("admin-auth-change"));
    return verify(nextToken);
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" }).catch(() => null);
    localStorage.removeItem("admin-token");
    window.dispatchEvent(new Event("admin-auth-change"));
    setToken("");
    setIsAdmin(false);
  }

  return { token, isAdmin, checked, saveToken, logout };
}

async function contentRequest<T>(method: "POST" | "PATCH", token: string, body: Record<string, unknown>) {
  const response = await fetch("/api/content", {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token
    },
    body: JSON.stringify(body)
  });
  const text = await response.text();
  const result = text ? JSON.parse(text) as ApiResult<T> : { success: false, error: "服务器没有返回内容。" };
  if (!response.ok || !result.success) {
    throw new Error(result.error || "请求失败，请稍后再试。");
  }
  return result.data as T;
}

async function deleteRequest(token: string, type: string, id: number | string) {
  const response = await fetch(`/api/content?type=${encodeURIComponent(type)}&id=${encodeURIComponent(String(id))}`, {
    method: "DELETE",
    headers: { "x-admin-token": token }
  });
  const text = await response.text();
  const result = text ? JSON.parse(text) as ApiResult<{ id: number | string }> : { success: false, error: "服务器没有返回内容。" };
  if (!response.ok || !result.success) {
    throw new Error(result.error || "删除失败，请稍后再试。");
  }
  return result.data;
}

function AdminBar({ isAdmin, onLogin, onLogout, actionLabel, actionLabelEn, onAction }: { isAdmin: boolean; onLogin: () => void; onLogout: () => void; actionLabel: string; actionLabelEn: string; onAction: () => void }) {
  return (
    <div className="inline-admin-bar">
      {isAdmin ? (
        <>
          <button className="button button-primary" type="button" onClick={onAction} data-en={actionLabelEn} data-zh={actionLabel}>{actionLabel}</button>
          <button className="button button-secondary" type="button" onClick={onLogout} data-en="Exit Admin" data-zh="退出管理">退出管理</button>
        </>
      ) : (
        <button className="button button-secondary subtle-admin-login" type="button" onClick={onLogin} data-en="Admin Login" data-zh="管理员登录">管理员登录</button>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="content-modal">
        <div className="modal-head">
          <h2>{title}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="关闭">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function LoginModal({ onClose, onSave }: { onClose: () => void; onSave: (token: string) => Promise<boolean> }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const ok = await onSave(value);
    setLoading(false);
    if (ok) onClose();
    else setError("密码不正确，或者 Vercel 环境变量 ADMIN_TOKEN 未配置。");
  }

  return (
    <Modal title="管理员登录" onClose={onClose}>
      <form className="inline-form" onSubmit={submit}>
        <label>管理密码<input type="password" value={value} onChange={(event) => setValue(event.target.value)} required /></label>
        <button className="button button-primary" type="submit" disabled={loading}>{loading ? "验证中..." : "登录"}</button>
        {error ? <p className="form-error">{error}</p> : null}
      </form>
    </Modal>
  );
}

async function uploadImageFile(token: string, file: File, signal?: AbortSignal) {
  const formData = new FormData();
  formData.set("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    headers: { "x-admin-token": token },
    body: formData,
    signal
  });
  const text = await response.text();
  const result = text ? JSON.parse(text) as ApiResult<{ url: string }> : { success: false, error: "服务器没有返回内容。" };

  if (!response.ok || !result.success || !result.data?.url) {
    throw new Error(result.error || "上传失败，也可以先手动粘贴图片 URL。");
  }
  return result.data.url;
}

function ImageField({ token, label, value, onChange, onUploadingChange }: { token: string; label: string; value: string; onChange: (value: string) => void; onUploadingChange?: (uploading: boolean) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function setUploadState(next: boolean) {
    setUploading(next);
    onUploadingChange?.(next);
  }

  async function upload(file: File) {
    setUploadState(true);
    setError("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30000);

    try {
      const url = await uploadImageFile(token, file, controller.signal);
      onChange(url);
    } catch (error) {
      setError(error instanceof DOMException && error.name === "AbortError" ? "上传超时，请检查 Vercel Blob 配置，或先粘贴图片 URL。" : error instanceof Error ? error.message : "上传失败，请稍后再试，或先粘贴图片 URL。");
    } finally {
      window.clearTimeout(timeout);
      setUploadState(false);
    }
  }

  return (
    <label>
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="图片 URL，或选择文件上传" />
      <input className="file-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])} />
      {uploading ? <span className="form-hint" data-en="Uploading image..." data-zh="图片上传中...">图片上传中...</span> : null}
      {error ? <span className="form-error">{error}</span> : null}
    </label>
  );
}

function MultiImageField({ token, label, values, onChange }: { token: string; label: string; values: string[]; onChange: (value: string[]) => void }) {
  const [manualUrl, setManualUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function addUrl(url: string) {
    const cleanUrl = url.trim();
    if (!cleanUrl) return;
    onChange([...values, cleanUrl]);
    setManualUrl("");
  }

  async function upload(files: FileList) {
    setUploading(true);
    setError("");
    const uploaded: string[] = [];

    try {
      for (const file of Array.from(files)) {
        uploaded.push(await uploadImageFile(token, file));
      }
      onChange([...values, ...uploaded]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "上传失败，请稍后再试，或先粘贴图片 URL。");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label>
      {label}
      <div className="multi-image-input-row">
        <input value={manualUrl} onChange={(event) => setManualUrl(event.target.value)} placeholder="图片 URL，或一次选择多张图片上传" />
        <button className="button button-secondary" type="button" onClick={() => addUrl(manualUrl)}>添加</button>
      </div>
      <input className="file-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple onChange={(event) => event.target.files && upload(event.target.files)} />
      {values.length ? (
        <div className="multi-image-preview">
          {values.map((url, index) => (
            <div className="multi-image-preview-item" key={`${url}-${index}`}>
              <img src={url} alt={`动态图片 ${index + 1}`} />
              <button type="button" className="text-danger" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}>删除</button>
            </div>
          ))}
        </div>
      ) : null}
      {uploading ? <span className="form-hint" data-en="Uploading images..." data-zh="图片上传中...">图片上传中...</span> : null}
      {error ? <span className="form-error">{error}</span> : null}
    </label>
  );
}

function groupedTodos(todos: TodoItem[]) {
  return Array.from(new Set(todos.map((todo) => todo.category))).map((category) => ({
    category,
    items: todos.filter((todo) => todo.category === category)
  }));
}

function workStatusLabel(status: string, type: WorkItem["type"]) {
  const isMovie = type === "movie";
  const map: Record<string, string> = {
    want: isMovie ? "想看" : "想读",
    reading: isMovie ? "在看" : "在读",
    done: isMovie ? "已看" : "已读",
    "想读": "想读",
    "想看": "想看",
    "在读": "在读",
    "在看": "在看",
    "已读": "已读",
    "已看": "已看"
  };
  return map[status] || status;
}

const todoStatusText: Record<string, string> = {
  todo: "想做",
  doing: "进行中",
  done: "已完成",
  paused: "暂时搁置"
};

export function MomentsManager({ initialMoments }: { initialMoments: Moment[] }) {
  const admin = useAdmin();
  const [moments, setMoments] = useState(initialMoments);
  const [form, setForm] = useState(emptyMoment);
  const [showLogin, setShowLogin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      const created = await contentRequest<Moment>("POST", admin.token, { type: "moment", ...form });
      setMoments((current) => [created, ...current]);
      setForm(emptyMoment);
      setShowForm(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "发布失败。");
    }
  }

  async function remove(moment: Moment) {
    if (!confirm("确定删除这条动态吗？")) return;
    setMessage("");
    const previous = moments;
    setMoments((current) => current.filter((item) => item.id !== moment.id));
    try {
      await deleteRequest(admin.token, "moment", moment.id);
    } catch (error) {
      setMoments(previous);
      setMessage(error instanceof Error ? error.message : "删除失败。");
    }
  }

  return (
    <div className="moments-center">
      <div className="section-action-row">
        <AdminBar isAdmin={admin.isAdmin} onLogin={() => setShowLogin(true)} onLogout={admin.logout} actionLabel="添加动态" actionLabelEn="Add Moment" onAction={() => setShowForm(true)} />
      </div>
      <div className="moment-feed">
        {moments.length ? moments.map((moment) => (
          <article className="moment-post" key={moment.id}>
            <div className="moment-meta"><time>{moment.date}</time><span>{moment.tag}</span></div>
            {moment.title ? <h2>{moment.title}</h2> : null}
            <p>{moment.content}</p>
            {(moment.imageUrls?.length ? moment.imageUrls : moment.imageUrl ? [moment.imageUrl] : []).length ? (
              <div className="moment-image-grid">
                {(moment.imageUrls?.length ? moment.imageUrls : moment.imageUrl ? [moment.imageUrl] : []).map((url, index) => (
                  <img className="content-image" src={url} alt={`${moment.title || "动态图片"} ${index + 1}`} key={`${url}-${index}`} />
                ))}
              </div>
            ) : null}
            {moment.linkUrl ? <a className="text-link" href={moment.linkUrl}>相关链接</a> : null}
            {admin.isAdmin ? <button className="text-danger" type="button" onClick={() => remove(moment)} data-en="Delete" data-zh="删除">删除</button> : null}
          </article>
        )) : <p className="empty-state">还没有动态。</p>}
      </div>
      {showLogin ? <LoginModal onClose={() => setShowLogin(false)} onSave={admin.saveToken} /> : null}
      {showForm ? (
        <Modal title="添加动态" onClose={() => setShowForm(false)}>
          <form className="inline-form" onSubmit={submit}>
            <label>标题，可选<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
            <label>日期<input value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} placeholder="留空则使用今天" /></label>
            <label>标签<input value={form.tag} onChange={(event) => setForm({ ...form, tag: event.target.value })} /></label>
            <label>正文<textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} required /></label>
            <MultiImageField token={admin.token} label="图片，可选，可多张" values={form.imageUrls} onChange={(imageUrls) => setForm({ ...form, imageUrls })} />
            <label>链接，可选<input value={form.linkUrl} onChange={(event) => setForm({ ...form, linkUrl: event.target.value })} /></label>
            <button className="button button-primary" type="submit" data-en="Publish Moment" data-zh="发布动态">发布动态</button>
            {message ? <p className="form-error">{message}</p> : null}
          </form>
        </Modal>
      ) : null}
    </div>
  );
}

export function TodoManager({ initialTodos }: { initialTodos: TodoItem[] }) {
  const admin = useAdmin();
  const [todos, setTodos] = useState(initialTodos);
  const [form, setForm] = useState(emptyTodo);
  const [showLogin, setShowLogin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const groups = useMemo(() => groupedTodos(todos), [todos]);

  async function toggle(todo: TodoItem) {
    if (!admin.isAdmin) return;
    const previous = todos;
    const nextStatus = todo.status === "done" ? "todo" : "done";
    setTodos((current) => current.map((item) => item.id === todo.id ? { ...item, status: nextStatus } : item));
    try {
      const updated = await contentRequest<TodoItem>("PATCH", admin.token, { type: "todo", id: todo.id, status: nextStatus });
      setTodos((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (error) {
      setTodos(previous);
      setMessage(error instanceof Error ? error.message : "状态更新失败。");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      const created = await contentRequest<TodoItem>("POST", admin.token, { type: "todo", ...form });
      setTodos((current) => [...current, created]);
      setForm(emptyTodo);
      setShowForm(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "添加失败。");
    }
  }

  async function remove(todo: TodoItem) {
    if (!confirm("确定删除这条待办吗？")) return;
    setMessage("");
    const previous = todos;
    setTodos((current) => current.filter((item) => item.id !== todo.id));
    try {
      await deleteRequest(admin.token, "todo", todo.id);
    } catch (error) {
      setTodos(previous);
      setMessage(error instanceof Error ? error.message : "删除失败。");
    }
  }

  return (
    <>
      <div className="section-action-row">
        <AdminBar isAdmin={admin.isAdmin} onLogin={() => setShowLogin(true)} onLogout={admin.logout} actionLabel="添加待办" actionLabelEn="Add Todo" onAction={() => setShowForm(true)} />
      </div>
      <div className="todo-list-page">
        {groups.map((group) => (
          <section className="todo-group" key={group.category}>
            <h2>{group.category}</h2>
            <ul>
              {group.items.map((item) => (
                <li className={item.status === "done" ? "is-completed" : ""} key={item.id}>
                  <button className={`todo-check ${item.status === "done" ? "is-done" : ""}`} type="button" disabled={!admin.isAdmin} onClick={() => toggle(item)} aria-label="切换完成状态">{item.status === "done" ? "✓" : ""}</button>
                  <span className="todo-title">{item.title}</span>
                  <span className={`status-pill status-${item.status}`}>{todoStatusText[item.status] || item.status}</span>
                  {admin.isAdmin ? <button className="text-danger item-delete" type="button" onClick={() => remove(item)} data-en="Delete" data-zh="删除">删除</button> : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
        {!groups.length ? <p className="empty-state">还没有清单。</p> : null}
      </div>
      {message ? <p className="form-error">{message}</p> : null}
      {showLogin ? <LoginModal onClose={() => setShowLogin(false)} onSave={admin.saveToken} /> : null}
      {showForm ? (
        <Modal title="添加待办" onClose={() => setShowForm(false)}>
          <form className="inline-form" onSubmit={submit}>
            <label>分类<input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></label>
            <label>事项<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
            <label>状态<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="todo">想做</option><option value="doing">进行中</option><option value="done">已完成</option><option value="paused">暂时搁置</option></select></label>
            <button className="button button-primary" type="submit" data-en="Save Todo" data-zh="保存待办">保存待办</button>
          </form>
        </Modal>
      ) : null}
    </>
  );
}

export function ReadingManager({ initialWorks }: { initialWorks: WorkItem[] }) {
  const admin = useAdmin();
  const [works, setWorks] = useState(initialWorks);
  const [form, setForm] = useState(emptyWork);
  const [showLogin, setShowLogin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const books = works.filter((item) => item.type === "book");
  const movies = works.filter((item) => item.type === "movie");
  const others = works.filter((item) => item.type === "other");

  async function updateStatus(work: WorkItem, status: string) {
    if (!admin.isAdmin) return;
    const previous = works;
    setWorks((current) => current.map((item) => item.id === work.id ? { ...item, status } : item));
    try {
      const updated = await contentRequest<WorkItem>("PATCH", admin.token, { type: "work", id: work.id, status });
      setWorks((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (error) {
      setWorks(previous);
      setMessage(error instanceof Error ? error.message : "状态更新失败。");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      const created = await contentRequest<WorkItem>("POST", admin.token, { type: "work", ...form });
      setWorks((current) => [...current, created]);
      setForm(emptyWork);
      setShowForm(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "添加失败。");
    }
  }

  async function remove(work: WorkItem) {
    if (!confirm("确定删除这条书影记录吗？")) return;
    setMessage("");
    const previous = works;
    setWorks((current) => current.filter((item) => item.id !== work.id));
    try {
      await deleteRequest(admin.token, "work", work.id);
    } catch (error) {
      setWorks(previous);
      setMessage(error instanceof Error ? error.message : "删除失败。");
    }
  }

  return (
    <>
      <div className="section-action-row">
        <AdminBar isAdmin={admin.isAdmin} onLogin={() => setShowLogin(true)} onLogout={admin.logout} actionLabel="添加书籍/电影" actionLabelEn="Add Book / Film" onAction={() => setShowForm(true)} />
      </div>
      <div className="works-board">
        <WorkSection title="书" items={books} isAdmin={admin.isAdmin} onStatus={updateStatus} onRemove={remove} />
        <WorkSection title="影" items={movies} isAdmin={admin.isAdmin} onStatus={updateStatus} onRemove={remove} />
        {others.length ? <WorkSection title="其他" items={others} isAdmin={admin.isAdmin} onStatus={updateStatus} onRemove={remove} /> : null}
      </div>
      {message ? <p className="form-error">{message}</p> : null}
      {showLogin ? <LoginModal onClose={() => setShowLogin(false)} onSave={admin.saveToken} /> : null}
      {showForm ? (
        <Modal title="添加书影记录" onClose={() => setShowForm(false)}>
          <form className="inline-form" onSubmit={submit}>
            <label>类型<select value={form.workType} onChange={(event) => setForm({ ...form, workType: event.target.value })}><option value="book">书籍</option><option value="movie">电影</option><option value="other">其他</option></select></label>
            <label>名称<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
            <label>作者 / 导演<input value={form.creator} onChange={(event) => setForm({ ...form, creator: event.target.value })} /></label>
            <label>状态<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="want">想读/想看</option><option value="reading">正在读/正在看</option><option value="done">已读/已看</option></select></label>
            <ImageField token={admin.token} label="封面图，可选" value={form.coverImageUrl} onChange={(value) => setForm({ ...form, coverImageUrl: value })} />
            <label>日期<input value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label>
            <label>简短备注<textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} /></label>
            <label>完成后感想<textarea value={form.reflection} onChange={(event) => setForm({ ...form, reflection: event.target.value })} /></label>
            <label>博客长文链接<input value={form.blogUrl} onChange={(event) => setForm({ ...form, blogUrl: event.target.value })} /></label>
            <button className="button button-primary" type="submit" data-en="Save Record" data-zh="保存记录">保存记录</button>
          </form>
        </Modal>
      ) : null}
    </>
  );
}

function WorkSection({ title, items, isAdmin, onStatus, onRemove }: { title: string; items: WorkItem[]; isAdmin: boolean; onStatus: (work: WorkItem, status: string) => void; onRemove: (work: WorkItem) => void }) {
  return (
    <section className="works-section">
      <h2>{title}</h2>
      <div className="works-list">
        {items.length ? items.map((item) => (
          <article className="work-item" key={item.id}>
            {item.coverImageUrl ? <img className="work-cover" src={item.coverImageUrl} alt={item.title} /> : null}
            <div>
              <h3>{item.title}</h3>
              <p>{[item.creator, item.date].filter(Boolean).join(" · ")}</p>
            </div>
            {isAdmin ? (
              <div className="item-actions">
                <select className="status-select" value={["want", "reading", "done"].includes(item.status) ? item.status : item.status} onChange={(event) => onStatus(item, event.target.value)}>
                  {!["want", "reading", "done"].includes(item.status) ? <option value={item.status}>{workStatusLabel(item.status, item.type)}</option> : null}
                  <option value="want">{item.type === "movie" ? "想看" : "想读"}</option>
                  <option value="reading">{item.type === "movie" ? "在看" : "在读"}</option>
                  <option value="done">{item.type === "movie" ? "已看" : "已读"}</option>
                </select>
                <button className="text-danger item-delete" type="button" onClick={() => onRemove(item)} data-en="Delete" data-zh="删除">删除</button>
              </div>
            ) : <span className="status-pill">{workStatusLabel(item.status, item.type)}</span>}
            {item.note ? <p>{item.note}</p> : null}
            {item.reflection ? <p className="reflection-text">{item.reflection}</p> : null}
            {item.blogUrl ? <a className="text-link" href={item.blogUrl}>去博客看长文</a> : null}
          </article>
        )) : <p className="empty-state">暂无记录。</p>}
      </div>
    </section>
  );
}

export function BlogManager({ initialPosts }: { initialPosts: BlogPost[] }) {
  const admin = useAdmin();
  const [posts, setPosts] = useState(initialPosts);
  const [form, setForm] = useState(emptyBlog);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  function insertImageMarkdown(url: string) {
    const markdown = `![图片](${url})`;
    const textarea = contentTextareaRef.current;

    if (!textarea) {
      setForm((current) => ({ ...current, content: `${current.content}\n\n${markdown}` }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = form.content.slice(0, start);
    const after = form.content.slice(end);
    const prefix = before && !before.endsWith("\n") ? "\n\n" : "";
    const suffix = after && !after.startsWith("\n") ? "\n\n" : "";
    const nextContent = `${before}${prefix}${markdown}${suffix}${after}`;
    const nextCursor = before.length + prefix.length + markdown.length;

    setForm((current) => ({ ...current, content: nextContent }));
    window.setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(nextCursor, nextCursor);
    }, 0);
  }

  function openCreateForm() {
    setEditingPost(null);
    setForm(emptyBlog);
    setMessage("");
    setShowForm(true);
  }

  function openEditForm(post: BlogPost) {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      date: post.date,
      category: post.category,
      summary: post.summary,
      content: post.content || "",
      coverImageUrl: post.coverImageUrl || ""
    });
    setMessage("");
    setShowForm(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      if (editingPost) {
        const updated = await contentRequest<BlogPost>("PATCH", admin.token, {
          type: "blog",
          id: editingPost.id,
          title: form.title,
          slug: form.slug,
          category: form.category,
          summary: form.summary,
          content: form.content,
          coverImageUrl: form.coverImageUrl
        });
        setPosts((current) => current.map((post) => post.id === updated.id ? updated : post));
      } else {
        const created = await contentRequest<BlogPost>("POST", admin.token, { type: "blog", ...form });
        setPosts((current) => [created, ...current]);
      }
      setForm(emptyBlog);
      setEditingPost(null);
      setShowForm(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存失败。");
    }
  }

  async function remove(post: BlogPost) {
    if (!confirm("确定删除这篇博客吗？")) return;
    setMessage("");
    const previous = posts;
    setPosts((current) => current.filter((item) => item.id !== post.id));
    try {
      await deleteRequest(admin.token, "blog", post.id);
    } catch (error) {
      setPosts(previous);
      setMessage(error instanceof Error ? error.message : "删除失败。");
    }
  }

  return (
    <>
      <div className="section-action-row">
        <AdminBar isAdmin={admin.isAdmin} onLogin={() => setShowLogin(true)} onLogout={admin.logout} actionLabel="添加博客" actionLabelEn="Add Blog" onAction={openCreateForm} />
      </div>
      <div className="blog-index">
        {posts.length ? posts.map((post) => (
          <article className="blog-row" key={post.id}>
            <time>{post.date}</time>
            {post.coverImageUrl ? <img className="blog-cover" src={post.coverImageUrl} alt={post.title} /> : null}
            <div>
              <span className="badge">{post.category}</span>
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
              <Link className="text-link" href={`/blog/${post.slug}`} data-en="Read More" data-zh="阅读全文">阅读全文</Link>
              {admin.isAdmin ? <button className="text-danger" type="button" onClick={() => openEditForm(post)} data-en="Edit" data-zh="编辑">编辑</button> : null}
              {admin.isAdmin ? <button className="text-danger" type="button" onClick={() => remove(post)} data-en="Delete" data-zh="删除">删除</button> : null}
            </div>
          </article>
        )) : <p className="empty-state">还没有博客。</p>}
      </div>
      {showLogin ? <LoginModal onClose={() => setShowLogin(false)} onSave={admin.saveToken} /> : null}
      {showForm ? (
        <Modal title={editingPost ? "编辑博客" : "添加博客"} onClose={() => setShowForm(false)}>
          <form className="inline-form" onSubmit={submit}>
            <label>标题<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
            <label>Slug，可选<input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></label>
            <label>日期<input value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} placeholder="留空则使用今天" disabled={Boolean(editingPost)} /></label>
            {editingPost ? <p className="form-hint">编辑博客不会修改创建日期，博客总览页仍显示这篇文章原来的日期。</p> : null}
            <label>分类<input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></label>
            <label>摘要<textarea value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} required /></label>
            <ImageField token={admin.token} label="封面图，可选" value={form.coverImageUrl} onChange={(value) => setForm({ ...form, coverImageUrl: value })} onUploadingChange={setIsUploading} />
            <label>正文 Markdown<textarea ref={contentTextareaRef} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="可以写 Markdown。把光标放到想插图的位置，再上传正文图片。" /></label>
            <ImageField token={admin.token} label="正文图片上传，插入到当前光标位置" value="" onChange={insertImageMarkdown} onUploadingChange={setIsUploading} />
            <button className="button button-primary" type="submit" disabled={isUploading}>
              {isUploading ? <span data-en="Waiting for Image Upload" data-zh="等待图片上传">等待图片上传</span> : <span data-en={editingPost ? "Save Blog" : "Publish Blog"} data-zh={editingPost ? "保存博客" : "发布博客"}>{editingPost ? "保存博客" : "发布博客"}</span>}
            </button>
            {message ? <p className="form-error">{message}</p> : null}
          </form>
        </Modal>
      ) : null}
    </>
  );
}
