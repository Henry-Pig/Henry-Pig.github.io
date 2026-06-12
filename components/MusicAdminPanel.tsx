"use client";

import { FormEvent, useEffect, useState } from "react";
import type { MusicTrack } from "../lib/types";

type ApiResult<T> = {
  success: boolean;
  data?: T;
  error?: string | null;
};

function formatBytes(value?: number | null) {
  if (!value) return "-";
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

export function MusicAdminPanel({ token }: { token: string }) {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function loadTracks() {
    if (!token) return;
    setMessage("");
    try {
      const response = await fetch("/api/admin/music", {
        headers: { "x-admin-token": token }
      });
      const result = await response.json() as ApiResult<MusicTrack[]>;
      if (!response.ok || !result.success) {
        setMessage(result.error || "音乐列表加载失败。");
        return;
      }
      setTracks(result.data || []);
    } catch {
      setMessage("音乐列表加载失败。");
    }
  }

  useEffect(() => {
    loadTracks();
  }, [token]);

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setMessage("请选择音乐文件。");
      return;
    }
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.set("file", file);
    formData.set("title", title);
    formData.set("artist", artist);
    formData.set("sortOrder", sortOrder);

    try {
      const response = await fetch("/api/admin/music/upload", {
        method: "POST",
        headers: { "x-admin-token": token },
        body: formData
      });
      const result = await response.json() as ApiResult<MusicTrack>;
      if (!response.ok || !result.success || !result.data) {
        setMessage(result.error || "上传失败。");
        return;
      }
      setTracks((current) => [...current, result.data as MusicTrack].sort((a, b) => a.sortOrder - b.sortOrder));
      setFile(null);
      setTitle("");
      setArtist("");
      setSortOrder("0");
      setMessage("上传成功。");
    } catch {
      setMessage("上传失败。");
    } finally {
      setLoading(false);
    }
  }

  async function update(track: MusicTrack, patch: Partial<MusicTrack>) {
    setMessage("");
    const response = await fetch(`/api/admin/music/${track.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token
      },
      body: JSON.stringify({
        title: patch.title,
        artist: patch.artist,
        sortOrder: patch.sortOrder,
        isEnabled: patch.isEnabled
      })
    });
    const result = await response.json() as ApiResult<MusicTrack>;
    if (!response.ok || !result.success || !result.data) {
      setMessage(result.error || "保存失败。");
      return;
    }
    setTracks((current) => current.map((item) => item.id === track.id ? result.data as MusicTrack : item));
  }

  async function remove(track: MusicTrack) {
    if (!confirm(`确定删除《${track.title}》吗？`)) return;
    setMessage("");
    const response = await fetch(`/api/admin/music/${track.id}`, {
      method: "DELETE",
      headers: { "x-admin-token": token }
    });
    const result = await response.json() as ApiResult<{ id: number | string; blobWarning?: string | null }>;
    if (!response.ok || !result.success) {
      setMessage(result.error || "删除失败。");
      return;
    }
    setTracks((current) => current.filter((item) => item.id !== track.id));
    setMessage(result.data?.blobWarning ? `数据库记录已删除，但 Blob 文件删除失败：${result.data.blobWarning}` : "删除成功。");
  }

  return (
    <section className="music-admin-panel">
      <div className="section-heading">
        <p className="eyebrow" data-en="Music Manager" data-zh="音乐管理">音乐管理</p>
        <h2 data-en="Background Music" data-zh="背景音乐">背景音乐</h2>
        <p data-en="Upload audio files to Vercel Blob and manage the playlist shown on the public site." data-zh="上传音乐到 Vercel Blob，并管理前台播放器的歌单。">上传音乐到 Vercel Blob，并管理前台播放器的歌单。</p>
      </div>

      <form className="music-upload-form" onSubmit={upload}>
        <label>
          <span data-en="Upload Music" data-zh="上传音乐">上传音乐</span>
          <input type="file" accept=".mp3,.wav,.ogg,.m4a,.flac,audio/*" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        </label>
        <label>
          <span data-en="Title" data-zh="歌曲标题">歌曲标题</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={file?.name.replace(/\.[^.]+$/, "") || "Title"} />
        </label>
        <label>
          <span data-en="Artist" data-zh="作者">作者</span>
          <input value={artist} onChange={(event) => setArtist(event.target.value)} placeholder="Artist" />
        </label>
        <label>
          <span data-en="Sort" data-zh="排序">排序</span>
          <input type="number" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} />
        </label>
        <button className="button button-primary" type="submit" disabled={loading || !token}>
          {loading ? <span data-en="Uploading..." data-zh="上传中...">上传中...</span> : <span data-en="Upload Music" data-zh="上传音乐">上传音乐</span>}
        </button>
      </form>

      <div className="music-admin-list">
        {tracks.length ? tracks.map((track) => (
          <article className="music-admin-row" key={track.id}>
            <div className="music-admin-fields">
              <input aria-label="Title" value={track.title} onChange={(event) => setTracks((current) => current.map((item) => item.id === track.id ? { ...item, title: event.target.value } : item))} />
              <input aria-label="Artist" value={track.artist || ""} onChange={(event) => setTracks((current) => current.map((item) => item.id === track.id ? { ...item, artist: event.target.value } : item))} />
              <input aria-label="Sort" type="number" value={track.sortOrder} onChange={(event) => setTracks((current) => current.map((item) => item.id === track.id ? { ...item, sortOrder: Number(event.target.value) } : item))} />
            </div>
            <div className="music-admin-meta">
              <span>{track.filename || "-"}</span>
              <span>{formatBytes(track.sizeBytes)}</span>
              <span data-en={track.isEnabled ? "Enabled" : "Disabled"} data-zh={track.isEnabled ? "启用" : "禁用"}>{track.isEnabled ? "启用" : "禁用"}</span>
            </div>
            <div className="music-admin-actions">
              <button className="button button-secondary" type="button" onClick={() => setPreviewUrl(track.url)} data-en="Preview" data-zh="试听">试听</button>
              <button className="button button-secondary" type="button" onClick={() => update(track, { ...track, isEnabled: !track.isEnabled })} data-en={track.isEnabled ? "Disabled" : "Enabled"} data-zh={track.isEnabled ? "禁用" : "启用"}>{track.isEnabled ? "禁用" : "启用"}</button>
              <button className="button button-primary" type="button" onClick={() => update(track, track)} data-en="Save" data-zh="保存">保存</button>
              <button className="text-danger" type="button" onClick={() => remove(track)} data-en="Delete" data-zh="删除">删除</button>
            </div>
          </article>
        )) : <p className="empty-state" data-en="No music yet." data-zh="暂无音乐。">暂无音乐。</p>}
      </div>

      {previewUrl ? <audio className="music-admin-preview" controls src={previewUrl} /> : null}
      {message ? <p className="admin-message">{message}</p> : null}
    </section>
  );
}
