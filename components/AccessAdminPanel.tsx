"use client";

import { FormEvent, useEffect, useState } from "react";

type AccessSettings = {
  isEnabled: boolean;
  hasKey: boolean;
  updatedAt?: string | null;
};

type ApiResult<T> = {
  success: boolean;
  data?: T;
  error?: string | null;
};

export function AccessAdminPanel({ token }: { token: string }) {
  const [settings, setSettings] = useState<AccessSettings>({ isEnabled: false, hasKey: false });
  const [accessKey, setAccessKey] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadSettings() {
    if (!token) return;
    setMessage("");
    try {
      const response = await fetch("/api/admin/access", {
        headers: { "x-admin-token": token }
      });
      const result = await response.json() as ApiResult<AccessSettings>;
      if (!response.ok || !result.success || !result.data) {
        setMessage(result.error || "访问设置加载失败。");
        return;
      }
      setSettings(result.data);
    } catch {
      setMessage("访问设置加载失败。");
    }
  }

  useEffect(() => {
    loadSettings();
  }, [token]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/access", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token
        },
        body: JSON.stringify({
          isEnabled: settings.isEnabled,
          accessKey: accessKey.trim() || undefined
        })
      });
      const result = await response.json() as ApiResult<AccessSettings>;
      if (!response.ok || !result.success || !result.data) {
        setMessage(result.error || "保存失败。");
        return;
      }
      setSettings(result.data);
      setAccessKey("");
      setMessage("访问设置已保存。");
    } catch {
      setMessage("保存失败。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="access-admin-panel">
      <div className="section-heading">
        <p className="eyebrow" data-en="Access Control" data-zh="访问保护">访问保护</p>
        <h2 data-en="Project and Blog Key" data-zh="项目与博客查看秘钥">项目与博客查看秘钥</h2>
        <p data-en="When enabled, project detail pages and blog detail pages require an access key." data-zh="开启后，项目详情页和博客详情页需要输入查看秘钥。">开启后，项目详情页和博客详情页需要输入查看秘钥。</p>
      </div>

      <form className="access-admin-form" onSubmit={save}>
        <label className="access-toggle-row">
          <span>
            <strong data-en="Enable Access Key" data-zh="开启查看秘钥">开启查看秘钥</strong>
            <small data-en={settings.hasKey ? "Access key is set" : "No access key yet"} data-zh={settings.hasKey ? "已设置查看秘钥" : "尚未设置查看秘钥"}>{settings.hasKey ? "已设置查看秘钥" : "尚未设置查看秘钥"}</small>
          </span>
          <input type="checkbox" checked={settings.isEnabled} onChange={(event) => setSettings((current) => ({ ...current, isEnabled: event.target.checked }))} />
        </label>

        <label>
          <span data-en="New Access Key" data-zh="新的查看秘钥">新的查看秘钥</span>
          <input type="password" value={accessKey} onChange={(event) => setAccessKey(event.target.value)} placeholder={settings.hasKey ? "留空则保留当前秘钥" : "设置后才能开启保护"} />
        </label>

        <button className="button button-primary" type="submit" disabled={loading || !token}>
          {loading ? <span data-en="Saving..." data-zh="保存中...">保存中...</span> : <span data-en="Save Access Settings" data-zh="保存访问设置">保存访问设置</span>}
        </button>
        {message ? <p className="admin-message">{message}</p> : null}
      </form>
    </section>
  );
}
