"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AccessKeyGate({ title, description }: { title: string; description?: string }) {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/access-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessKey })
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setMessage(result.error || "秘钥不正确。");
        return;
      }
      router.refresh();
    } catch {
      setMessage("验证失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="access-gate lead-card">
      <p className="eyebrow" data-en="Protected Content" data-zh="受保护内容">受保护内容</p>
      <h2 data-en="Access Key Required" data-zh="需要查看秘钥">需要查看秘钥</h2>
      <p className="muted-text">{description || title}</p>
      <form className="access-gate-form" onSubmit={submit}>
        <label>
          <span data-en="Access Key" data-zh="查看秘钥">查看秘钥</span>
          <input type="password" value={accessKey} onChange={(event) => setAccessKey(event.target.value)} required />
        </label>
        <button className="button button-primary" type="submit" disabled={loading}>
          {loading ? <span data-en="Checking..." data-zh="验证中...">验证中...</span> : <span data-en="Unlock" data-zh="解锁查看">解锁查看</span>}
        </button>
      </form>
      {message ? <p className="form-error">{message}</p> : null}
    </div>
  );
}
