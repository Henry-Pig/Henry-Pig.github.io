"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { GuestMessage } from "../lib/types";

type GuestMessageBottleProps = {
  initialMessages: GuestMessage[];
};

export function GuestMessageBottle({ initialMessages }: GuestMessageBottleProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanMessage = message.trim();
    const cleanNickname = nickname.trim() || "匿名访客";

    if (!cleanMessage) {
      setFeedback("先写一点想放进瓶子里的话。");
      return;
    }

    setIsSending(true);
    setFeedback("");

    try {
      const response = await fetch("/api/guest-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: cleanNickname, message: cleanMessage })
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || "留言失败。");
      setMessages((current) => [payload.data, ...current].slice(0, 8));
      setMessage("");
      setFeedback("留言已经漂进瓶子里了。");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "留言失败。");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="guest-bottle">
      <p className="eyebrow">Message Bottle</p>
      <h2 data-en="Visitor Message Bottle" data-zh="访客留言瓶">访客留言瓶</h2>
      <form className="guest-bottle-form" onSubmit={submitMessage}>
        <input
          maxLength={24}
          placeholder="昵称（可不填）"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
        />
        <textarea
          maxLength={160}
          placeholder="给这个页面留一句话"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button className="button button-primary" type="submit" disabled={isSending}>
          {isSending ? "投递中" : "投进瓶子"}
        </button>
      </form>
      {feedback ? <p className="guest-bottle-feedback">{feedback}</p> : null}
      <div className="guest-message-list">
        {messages.length ? (
          messages.map((item) => (
            <article className="guest-message-item" key={item.id}>
              <strong>{item.nickname}</strong>
              <p>{item.message}</p>
            </article>
          ))
        ) : (
          <p className="muted-text">还没有留言，第一张瓶中纸条可以由你放进去。</p>
        )}
      </div>
    </div>
  );
}
