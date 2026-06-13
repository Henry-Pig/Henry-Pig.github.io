"use client";

import { FormEvent, useEffect, useState } from "react";
import { AccessAdminPanel } from "../../components/AccessAdminPanel";
import { MusicAdminPanel } from "../../components/MusicAdminPanel";

type AuthState = "checking" | "anonymous" | "admin";

export function AdminPanel() {
  const [token, setToken] = useState("");
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin-token") || "";
    setToken(saved);
    if (saved) verify(saved);
    else setAuthState("anonymous");
  }, []);

  async function verify(nextToken = token) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth", {
        headers: { "x-admin-token": nextToken }
      });
      const result = await response.json();
      const ok = Boolean(result.data?.isAdmin);
      if (!ok) {
        localStorage.removeItem("admin-token");
        setAuthState("anonymous");
        setMessage("管理密码不正确，或者 ADMIN_TOKEN 未配置。");
        return false;
      }
      localStorage.setItem("admin-token", nextToken);
      setAuthState("admin");
      setMessage("");
      return true;
    } catch {
      setAuthState("anonymous");
      setMessage("验证失败，请稍后再试。");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await verify(token);
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" }).catch(() => null);
    localStorage.removeItem("admin-token");
    setToken("");
    setAuthState("anonymous");
    setMessage("");
  }

  if (authState === "checking") {
    return (
      <div className="admin-login-card">
        <p className="eyebrow">Admin</p>
        <h2 data-en="Checking Admin Session" data-zh="正在验证管理员身份">正在验证管理员身份</h2>
        <p className="muted-text" data-en="Please wait a moment." data-zh="请稍等片刻。">请稍等片刻。</p>
      </div>
    );
  }

  if (authState !== "admin") {
    return (
      <form className="admin-login-card" onSubmit={login}>
        <p className="eyebrow">Admin</p>
        <h2 data-en="Admin Login" data-zh="管理员登录">管理员登录</h2>
        <p className="muted-text" data-en="Enter the admin token before opening the dashboard." data-zh="请输入管理密码，验证通过后才能进入后台。">请输入管理密码，验证通过后才能进入后台。</p>
        <label>
          <span data-en="Admin Token" data-zh="管理密码">管理密码</span>
          <input type="password" value={token} onChange={(event) => setToken(event.target.value)} placeholder="ADMIN_TOKEN" required />
        </label>
        <button className="button button-primary" type="submit" disabled={loading}>
          {loading ? <span data-en="Checking..." data-zh="验证中...">验证中...</span> : <span data-en="Login" data-zh="登录">登录</span>}
        </button>
        {message ? <p className="form-error">{message}</p> : null}
      </form>
    );
  }

  return (
    <div className="admin-stack">
      <section className="admin-dashboard-head">
        <div>
          <p className="eyebrow">Admin</p>
          <h2 data-en="Dashboard" data-zh="后台管理">后台管理</h2>
          <p data-en="Content publishing now lives on each public page after admin login. This dashboard keeps global settings." data-zh="动态、博客、清单和书影的发布入口已经放在对应页面内；这里保留全局设置。">动态、博客、清单和书影的发布入口已经放在对应页面内；这里保留全局设置。</p>
        </div>
        <button className="button button-secondary" type="button" onClick={logout} data-en="Logout" data-zh="退出登录">退出登录</button>
      </section>

      <MusicAdminPanel token={token} />
      <AccessAdminPanel token={token} />
    </div>
  );
}
