"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type AccessSettings = {
  isEnabled: boolean;
  hasKey: boolean;
  currentKey?: string | null;
  keyExpiresAt?: string | null;
  keySecondsRemaining?: number;
  updatedAt?: string | null;
};

type ApiResult<T> = {
  success: boolean;
  data?: T;
  error?: string | null;
};

function formatRemaining(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60).toString().padStart(2, "0");
  const rest = (safe % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

export function AccessAdminPanel({ token }: { token: string }) {
  const [settings, setSettings] = useState<AccessSettings>({ isEnabled: false, hasKey: false });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(Date.now());

  const secondsRemaining = useMemo(() => {
    if (!settings.keyExpiresAt) return settings.keySecondsRemaining || 0;
    return Math.max(0, Math.ceil((new Date(settings.keyExpiresAt).getTime() - now) / 1000));
  }, [settings.keyExpiresAt, settings.keySecondsRemaining, now]);

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
      setNow(Date.now());
    } catch {
      setMessage("访问设置加载失败。");
    }
  }

  useEffect(() => {
    loadSettings();
  }, [token]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (settings.keyExpiresAt && secondsRemaining <= 0) {
      loadSettings();
    }
  }, [secondsRemaining, settings.keyExpiresAt]);

  async function save(event?: FormEvent<HTMLFormElement>, rotateNow = false) {
    event?.preventDefault();
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
          rotateNow
        })
      });
      const result = await response.json() as ApiResult<AccessSettings>;
      if (!response.ok || !result.success || !result.data) {
        setMessage(result.error || "保存失败。");
        return;
      }
      setSettings(result.data);
      setNow(Date.now());
      setMessage(rotateNow ? "查看秘钥已立即轮换。" : "访问设置已保存。");
    } catch {
      setMessage("保存失败。");
    } finally {
      setLoading(false);
    }
  }

  async function copyKey() {
    if (!settings.currentKey) return;
    await navigator.clipboard.writeText(settings.currentKey);
    setMessage("当前查看秘钥已复制。");
  }

  return (
    <section className="access-admin-panel">
      <div className="section-heading">
        <p className="eyebrow" data-en="Access Control" data-zh="访问保护">访问保护</p>
        <h2 data-en="Project and Blog Key" data-zh="项目与博客查看秘钥">项目与博客查看秘钥</h2>
        <p data-en="When enabled, project detail pages and blog detail pages require the current rotating access key." data-zh="开启后，项目详情页和博客详情页需要输入当前自动轮换的查看秘钥。">开启后，项目详情页和博客详情页需要输入当前自动轮换的查看秘钥。</p>
      </div>

      <form className="access-admin-form" onSubmit={(event) => save(event)}>
        <label className="access-toggle-row">
          <span>
            <strong data-en="Enable Access Key" data-zh="开启查看秘钥">开启查看秘钥</strong>
            <small data-en="The key rotates every 15 minutes automatically." data-zh="秘钥每 15 分钟自动轮换。">秘钥每 15 分钟自动轮换。</small>
          </span>
          <input type="checkbox" checked={settings.isEnabled} onChange={(event) => setSettings((current) => ({ ...current, isEnabled: event.target.checked }))} />
        </label>

        <div className="access-current-key">
          <span data-en="Current Key" data-zh="当前秘钥">当前秘钥</span>
          <strong>{settings.currentKey || "-----"}</strong>
          <small data-en={`Refreshes in ${formatRemaining(secondsRemaining)}`} data-zh={`剩余 ${formatRemaining(secondsRemaining)} 后刷新`}>剩余 {formatRemaining(secondsRemaining)} 后刷新</small>
        </div>

        <div className="access-admin-actions">
          <button className="button button-primary" type="submit" disabled={loading || !token}>
            {loading ? <span data-en="Saving..." data-zh="保存中...">保存中...</span> : <span data-en="Save Access Settings" data-zh="保存访问设置">保存访问设置</span>}
          </button>
          <button className="button button-secondary" type="button" onClick={copyKey} disabled={!settings.currentKey} data-en="Copy Key" data-zh="复制秘钥">复制秘钥</button>
          <button className="button button-secondary" type="button" onClick={() => save(undefined, true)} disabled={loading || !token} data-en="Rotate Now" data-zh="立即换一个">立即换一个</button>
          <button className="button button-secondary" type="button" onClick={loadSettings} disabled={loading || !token} data-en="Refresh" data-zh="刷新">刷新</button>
        </div>
        {message ? <p className="admin-message">{message}</p> : null}
      </form>
    </section>
  );
}
