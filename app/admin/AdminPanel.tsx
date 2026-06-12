"use client";

import { FormEvent, useEffect, useState } from "react";
import { AccessAdminPanel } from "../../components/AccessAdminPanel";
import { MusicAdminPanel } from "../../components/MusicAdminPanel";

type ContentType = "moment" | "todo" | "work" | "blog";

const initialForm = {
  date: "",
  tag: "生活",
  content: "",
  imageUrl: "",
  linkUrl: "",
  category: "想完成的项目",
  title: "",
  status: "todo",
  workType: "book",
  creator: "",
  note: "",
  blogUrl: "",
  slug: "",
  summary: ""
};

export function AdminPanel() {
  const [token, setToken] = useState("");
  const [contentType, setContentType] = useState<ContentType>("moment");
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("admin-token") || "");
  }, []);

  function updateField(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    localStorage.setItem("admin-token", token);

    const response = await fetch("/api/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token
      },
      body: JSON.stringify({ type: contentType, ...form })
    });

    const result = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(result.error || result.message || "保存失败，请检查配置。");
      return;
    }

    setMessage("保存成功，刷新对应页面就能看到新内容。");
    setForm(initialForm);
  }

  return (
    <div className="admin-stack">
      <div className="admin-grid">
        <aside className="admin-note">
          <p className="eyebrow">Admin</p>
          <h2 data-en="Content Admin" data-zh="内容后台">内容后台</h2>
          <p data-en="A lightweight admin page for adding moments, lists, books, films, blogs, and music." data-zh="这里是一个轻量后台，适合你本人添加动态、清单、书影、博客和音乐。">这里是一个轻量后台，适合你本人添加动态、清单、书影、博客和音乐。</p>
          <p data-en="Visitors will not see this token field, but never write the real token into source code." data-zh="访客不会看到这个表单的密码，但请不要把真实密码写进代码里。">访客不会看到这个表单的密码，但请不要把真实密码写进代码里。</p>
        </aside>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            <span data-en="Admin Token" data-zh="管理密码">管理密码</span>
            <input type="password" value={token} onChange={(event) => setToken(event.target.value)} placeholder="对应 Vercel 的 ADMIN_TOKEN" required />
          </label>

        <label>
          添加类型
          <select value={contentType} onChange={(event) => setContentType(event.target.value as ContentType)}>
            <option value="moment">动态</option>
            <option value="todo">清单</option>
            <option value="work">书影</option>
            <option value="blog">博客</option>
          </select>
        </label>

        {contentType === "moment" && (
          <>
            <label>日期<input value={form.date} onChange={(event) => updateField("date", event.target.value)} placeholder="2026.06.11" /></label>
            <label>标签<input value={form.tag} onChange={(event) => updateField("tag", event.target.value)} placeholder="学习 / 生活 / 运动" /></label>
            <label>正文<textarea value={form.content} onChange={(event) => updateField("content", event.target.value)} required /></label>
            <label>链接，可选<input value={form.linkUrl} onChange={(event) => updateField("linkUrl", event.target.value)} /></label>
          </>
        )}

        {contentType === "todo" && (
          <>
            <label>分类<input value={form.category} onChange={(event) => updateField("category", event.target.value)} placeholder="想完成的项目" /></label>
            <label>事项<input value={form.title} onChange={(event) => updateField("title", event.target.value)} required /></label>
            <label>状态<select value={form.status} onChange={(event) => updateField("status", event.target.value)}><option value="todo">想做</option><option value="doing">进行中</option><option value="done">已完成</option><option value="paused">暂时搁置</option></select></label>
          </>
        )}

        {contentType === "work" && (
          <>
            <label>类型<select value={form.workType} onChange={(event) => updateField("workType", event.target.value)}><option value="book">书</option><option value="movie">影</option></select></label>
            <label>作品名称<input value={form.title} onChange={(event) => updateField("title", event.target.value)} required /></label>
            <label>作者 / 导演<input value={form.creator} onChange={(event) => updateField("creator", event.target.value)} /></label>
            <label>状态<input value={form.status} onChange={(event) => updateField("status", event.target.value)} placeholder="想读 / 已读 / 想看 / 已看" /></label>
            <label>日期<input value={form.date} onChange={(event) => updateField("date", event.target.value)} /></label>
            <label>简短记录<textarea value={form.note} onChange={(event) => updateField("note", event.target.value)} /></label>
            <label>博客长文链接，可选<input value={form.blogUrl} onChange={(event) => updateField("blogUrl", event.target.value)} /></label>
          </>
        )}

        {contentType === "blog" && (
          <>
            <label>标题<input value={form.title} onChange={(event) => updateField("title", event.target.value)} required /></label>
            <label>Slug，可选<input value={form.slug} onChange={(event) => updateField("slug", event.target.value)} placeholder="my-first-post" /></label>
            <label>日期<input value={form.date} onChange={(event) => updateField("date", event.target.value)} /></label>
            <label>分类<input value={form.category} onChange={(event) => updateField("category", event.target.value)} placeholder="随笔" /></label>
            <label>摘要<textarea value={form.summary} onChange={(event) => updateField("summary", event.target.value)} required /></label>
            <label>正文<textarea value={form.content} onChange={(event) => updateField("content", event.target.value)} /></label>
          </>
        )}

          <button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? "保存中..." : "保存内容"}</button>
          {message ? <p className="admin-message">{message}</p> : null}
        </form>
      </div>

      <MusicAdminPanel token={token} />
      <AccessAdminPanel token={token} />
    </div>
  );
}
