"use client";

import { PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import type { MusicTrack } from "../lib/types";

type PlayMode = "order" | "single" | "loop";

type ApiResult<T> = {
  success: boolean;
  data?: T;
  error?: string | null;
};

const playerKeys = {
  position: "music-player-position",
  volume: "music-player-volume",
  mode: "music-player-mode",
  expanded: "music-player-expanded"
};

const defaultPosition = { x: 24, y: 120 };
const playerSize = 58;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function FloatingMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dragRef = useRef({ dragging: false, moved: false, offsetX: 0, offsetY: 0 });
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.58);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mode, setMode] = useState<PlayMode>("loop");
  const [message, setMessage] = useState("");

  const currentTrack = tracks[index] || null;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const modeLabel = useMemo(() => ({
    order: { zh: "顺序播放", en: "Order" },
    single: { zh: "单曲循环", en: "Repeat One" },
    loop: { zh: "列表循环", en: "Loop" }
  })[mode], [mode]);

  useEffect(() => {
    const savedPosition = localStorage.getItem(playerKeys.position);
    const savedVolume = Number(localStorage.getItem(playerKeys.volume));
    const savedMode = localStorage.getItem(playerKeys.mode) as PlayMode | null;
    const savedExpanded = localStorage.getItem(playerKeys.expanded);

    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition) as { x: number; y: number };
        setPosition({
          x: clamp(parsed.x, 8, window.innerWidth - playerSize - 8),
          y: clamp(parsed.y, 8, window.innerHeight - playerSize - 8)
        });
      } catch {
        setPosition({ x: window.innerWidth - playerSize - 24, y: window.innerHeight - playerSize - 96 });
      }
    } else {
      setPosition({ x: window.innerWidth - playerSize - 24, y: window.innerHeight - playerSize - 96 });
    }

    if (Number.isFinite(savedVolume)) setVolume(clamp(savedVolume, 0, 1));
    if (savedMode === "order" || savedMode === "single" || savedMode === "loop") setMode(savedMode);
    if (savedExpanded === "true") setExpanded(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadTracks() {
      try {
        const response = await fetch("/api/music");
        const result = await response.json() as ApiResult<MusicTrack[]>;
        if (!cancelled) {
          if (response.ok && result.success) setTracks(result.data || []);
          else setMessage(result.error || "音乐加载失败。");
        }
      } catch {
        if (!cancelled) setMessage("音乐加载失败。");
      }
    }
    loadTracks();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    localStorage.setItem(playerKeys.volume, String(volume));
  }, [volume]);

  useEffect(() => {
    localStorage.setItem(playerKeys.mode, mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(playerKeys.expanded, String(expanded));
  }, [expanded]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (mode === "single") {
        audio.currentTime = 0;
        audio.play().catch(() => setPlaying(false));
        return;
      }
      if (mode === "order" && index >= tracks.length - 1) {
        setPlaying(false);
        return;
      }
      goNext(true);
    };
    const onError = () => {
      setMessage("当前音乐加载失败，已尝试切换下一首。");
      goNext(true);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [index, mode, tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (playing) {
      audio.play().catch(() => {
        setPlaying(false);
        setMessage("浏览器阻止了播放，请再次点击播放。");
      });
    }
  }, [currentTrack?.url]);

  useEffect(() => {
    function onResize() {
      setPosition((current) => {
        const next = {
          x: clamp(current.x, 8, window.innerWidth - playerSize - 8),
          y: clamp(current.y, 8, window.innerHeight - playerSize - 8)
        };
        localStorage.setItem(playerKeys.position, JSON.stringify(next));
        return next;
      });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function play() {
    if (!currentTrack || !audioRef.current) return;
    setMessage("");
    audioRef.current.play().then(() => setPlaying(true)).catch(() => {
      setPlaying(false);
      setMessage("播放失败，请检查音频文件。");
    });
  }

  function pause() {
    audioRef.current?.pause();
    setPlaying(false);
  }

  function togglePlay() {
    if (!tracks.length) {
      setExpanded(true);
      return;
    }
    if (playing) pause();
    else play();
  }

  function goPrevious() {
    if (!tracks.length) return;
    setIndex((current) => (current <= 0 ? tracks.length - 1 : current - 1));
  }

  function goNext(forcePlay = false) {
    if (!tracks.length) return;
    setIndex((current) => {
      const next = current >= tracks.length - 1 ? 0 : current + 1;
      return next;
    });
    if (forcePlay) setPlaying(true);
  }

  function updateProgress(value: string) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const next = (Number(value) / 100) * duration;
    audio.currentTime = next;
    setCurrentTime(next);
  }

  function cycleMode() {
    setMode((current) => current === "order" ? "single" : current === "single" ? "loop" : "order");
  }

  function onPointerDown(event: PointerEvent<HTMLButtonElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      dragging: true,
      moved: false,
      offsetX: event.clientX - position.x,
      offsetY: event.clientY - position.y
    };
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!dragRef.current.dragging) return;
    const next = {
      x: clamp(event.clientX - dragRef.current.offsetX, 8, window.innerWidth - playerSize - 8),
      y: clamp(event.clientY - dragRef.current.offsetY, 8, window.innerHeight - playerSize - 8)
    };
    if (Math.abs(next.x - position.x) > 2 || Math.abs(next.y - position.y) > 2) dragRef.current.moved = true;
    setPosition(next);
  }

  function onPointerUp(event: PointerEvent<HTMLButtonElement>) {
    event.currentTarget.releasePointerCapture(event.pointerId);
    const wasMoved = dragRef.current.moved;
    dragRef.current.dragging = false;
    localStorage.setItem(playerKeys.position, JSON.stringify(position));
    if (!wasMoved) setExpanded((current) => !current);
  }

  return (
    <div className="music-player floating" style={{ left: position.x, top: position.y }}>
      <audio ref={audioRef} src={currentTrack?.url || undefined} preload="metadata" />
      <button
        className={`music-player-toggle ${playing ? "is-playing" : ""}`}
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        aria-label="打开音乐播放器"
      >
        <span aria-hidden="true">♪</span>
      </button>

      {expanded ? (
        <div className="music-player-panel">
          <div className="music-player-head">
            <div>
              <p className="eyebrow" data-en="Background Music" data-zh="背景音乐">背景音乐</p>
              <h2>{currentTrack ? currentTrack.title : <span data-en="No music yet" data-zh="暂无音乐">暂无音乐</span>}</h2>
              {currentTrack?.artist ? <p>{currentTrack.artist}</p> : null}
            </div>
            <button type="button" className="music-player-close" onClick={() => setExpanded(false)} aria-label="收起">×</button>
          </div>

          <div className="music-player-progress">
            <input type="range" min="0" max="100" value={progress || 0} onChange={(event) => updateProgress(event.target.value)} disabled={!currentTrack} />
            <div><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
          </div>

          <div className="music-player-controls">
            <button type="button" onClick={goPrevious} disabled={!tracks.length} aria-label="上一首">‹</button>
            <button type="button" className="music-main-control" onClick={togglePlay} disabled={!tracks.length}>
              {playing ? <span data-en="Pause" data-zh="暂停">暂停</span> : <span data-en="Play" data-zh="播放">播放</span>}
            </button>
            <button type="button" onClick={() => goNext()} disabled={!tracks.length} aria-label="下一首">›</button>
          </div>

          <label className="music-player-volume">
            <span data-en="Volume" data-zh="音量">音量</span>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} />
          </label>

          <button type="button" className="music-mode-button" onClick={cycleMode}>
            <span data-en="Mode" data-zh="模式">模式</span>
            <strong data-en={modeLabel.en} data-zh={modeLabel.zh}>{modeLabel.zh}</strong>
          </button>

          {message ? <p className="music-player-message">{message}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
