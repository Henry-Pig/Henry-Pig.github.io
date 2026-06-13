"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import type { ProjectItem } from "../../lib/types";

type ApiResult<T> = { success: boolean; data?: T; error?: string };

const emptyProject = {
  title: "",
  slug: "",
  period: "",
  type: "",
  role: "",
  summary: "",
  description: "",
  content: "",
  techStack: "",
  coverImage: "",
  repoUrl: "",
  demoUrl: "",
  sortOrder: "0"
};

function useAdmin() {
  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  async function verify(nextToken: string) {
    if (!nextToken) return false;
    const response = await fetch("/api/auth", { headers: { "x-admin-token": nextToken } });
    const result = await response.json();
    const ok = Boolean(result.data?.isAdmin);
    setIsAdmin(ok);
    return ok;
  }

  useEffect(() => {
    const saved = localStorage.getItem("admin-token") || "";
    setToken(saved);
    verify(saved);
  }, []);

  async function login(nextToken: string) {
    localStorage.setItem("admin-token", nextToken);
    setToken(nextToken);
    return verify(nextToken);
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" }).catch(() => null);
    localStorage.removeItem("admin-token");
    setToken("");
    setIsAdmin(false);
  }

  return { token, isAdmin, login, logout };
}

async function projectRequest<T>(method: "POST" | "PATCH", token: string, body: Record<string, unknown>) {
  const response = await fetch("/api/projects", {
    method,
    headers: { "Content-Type": "application/json", "x-admin-token": token },
    body: JSON.stringify(body)
  });
  const result = await response.json() as ApiResult<T>;
  if (!response.ok || !result.success) throw new Error(result.error || "请求失败。");
  return result.data as T;
}

export function ProjectManager({ initialProjects }: { initialProjects: ProjectItem[] }) {
  const admin = useAdmin();
  const [projects, setProjects] = useState(initialProjects);
  const [form, setForm] = useState(emptyProject);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginValue, setLoginValue] = useState("");
  const [message, setMessage] = useState("");

  function openForm(project?: ProjectItem) {
    if (project) {
      setEditing(project);
      setForm({
        title: project.title,
        slug: project.slug,
        period: project.period,
        type: project.type || "",
        role: project.role || "",
        summary: project.summary,
        description: project.description || "",
        content: (project.content || []).map((section) => section.body || (section.items || []).map((item) => `- ${item}`).join("\n")).filter(Boolean).join("\n\n"),
        techStack: project.techStack.join(", "),
        coverImage: project.coverImage || "",
        repoUrl: project.repoUrl || "",
        demoUrl: project.demoUrl || "",
        sortOrder: String(project.sortOrder || 0)
      });
    } else {
      setEditing(null);
      setForm(emptyProject);
    }
    setShowForm(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      const payload = {
        ...form,
        sortOrder: Number(form.sortOrder || 0),
        content: form.content
      };
      const saved = editing
        ? await projectRequest<ProjectItem>("PATCH", admin.token, { id: editing.id, ...payload })
        : await projectRequest<ProjectItem>("POST", admin.token, payload);

      setProjects((current) => {
        const next = editing
          ? current.map((project) => project.id === saved.id ? saved : project)
          : [...current, saved];
        return next.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      });
      setShowForm(false);
      setEditing(null);
      setForm(emptyProject);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存失败。");
    }
  }

  async function remove(project: ProjectItem) {
    if (!confirm(`确定删除项目「${project.title}」吗？`)) return;
    const previous = projects;
    setProjects((current) => current.filter((item) => item.id !== project.id));
    try {
      const response = await fetch(`/api/projects?id=${encodeURIComponent(String(project.id))}`, {
        method: "DELETE",
        headers: { "x-admin-token": admin.token }
      });
      const result = await response.json() as ApiResult<unknown>;
      if (!response.ok || !result.success) throw new Error(result.error || "删除失败。");
    } catch (error) {
      setProjects(previous);
      setMessage(error instanceof Error ? error.message : "删除失败。");
    }
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok = await admin.login(loginValue);
    if (ok) setShowLogin(false);
    else setMessage("管理员密码不正确。");
  }

  return (
    <>
      <div className="section-action-row">
        {admin.isAdmin ? (
          <div className="inline-admin-bar">
            <button className="button button-primary" type="button" onClick={() => openForm()} data-en="Add Project" data-zh="添加项目">添加项目</button>
            <button className="button button-secondary" type="button" onClick={admin.logout} data-en="Exit Admin" data-zh="退出管理">退出管理</button>
          </div>
        ) : <button className="button button-secondary subtle-admin-login" type="button" onClick={() => setShowLogin(true)} data-en="Admin Login" data-zh="管理员登录">管理员登录</button>}
      </div>

      <div className="project-timeline">
        {projects.map((project) => (
          <article className="project-row" key={project.id}>
            <time className="project-time">{project.period}</time>
            <div className="project-card">
              <div className="project-card-head">
                <span className="badge">{project.type}</span>
                <span className="project-role">{project.role}</span>
              </div>
              <h2><Link href={`/projects/${project.slug}`}>{project.title}</Link></h2>
              <p>{project.summary}</p>
              <div className="project-tags">{project.techStack.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="card-actions">
                <Link className="button button-secondary" href={`/projects/${project.slug}`} data-en="View Details" data-zh="查看详情">查看详情</Link>
                {admin.isAdmin ? <button className="text-danger" type="button" onClick={() => openForm(project)} data-en="Edit" data-zh="编辑">编辑</button> : null}
                {admin.isAdmin ? <button className="text-danger" type="button" onClick={() => remove(project)} data-en="Delete" data-zh="删除">删除</button> : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      {message ? <p className="form-error">{message}</p> : null}
      {showLogin ? (
        <div className="modal-backdrop"><div className="content-modal"><div className="modal-head"><h2 data-en="Admin Login" data-zh="管理员登录">管理员登录</h2><button className="modal-close" type="button" onClick={() => setShowLogin(false)}>×</button></div><form className="inline-form" onSubmit={login}><label>管理密码<input type="password" value={loginValue} onChange={(event) => setLoginValue(event.target.value)} /></label><button className="button button-primary" type="submit" data-en="Login" data-zh="登录">登录</button></form></div></div>
      ) : null}
      {showForm ? (
        <div className="modal-backdrop">
          <div className="content-modal">
            <div className="modal-head"><h2 data-en={editing ? "Edit Project" : "Add Project"} data-zh={editing ? "编辑项目" : "添加项目"}>{editing ? "编辑项目" : "添加项目"}</h2><button className="modal-close" type="button" onClick={() => setShowForm(false)}>×</button></div>
            <form className="inline-form" onSubmit={submit}>
              <label>标题<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
              <label>Slug<input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></label>
              <label>时间<input value={form.period} onChange={(event) => setForm({ ...form, period: event.target.value })} required /></label>
              <label>类型<input value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} /></label>
              <label>角色<input value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} /></label>
              <label>简介<textarea value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} required /></label>
              <label>英文/补充标题<input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
              <label>详情正文 Markdown<textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} /></label>
              <label>技术栈，逗号分隔<input value={form.techStack} onChange={(event) => setForm({ ...form, techStack: event.target.value })} /></label>
              <label>封面图 URL<input value={form.coverImage} onChange={(event) => setForm({ ...form, coverImage: event.target.value })} /></label>
              <label>代码链接<input value={form.repoUrl} onChange={(event) => setForm({ ...form, repoUrl: event.target.value })} /></label>
              <label>排序<input value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: event.target.value })} /></label>
              <button className="button button-primary" type="submit" data-en="Save Project" data-zh="保存项目">保存项目</button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
