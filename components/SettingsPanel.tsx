"use client";

import { useEffect, useState } from "react";
import { DEFAULT_DESIGN, isDesignId, registeredDesigns, type DesignId } from "../lib/designs";

type ColorMode = "system" | "light" | "dark";
type MotionMode = "on" | "reduced";
type DensityMode = "comfortable" | "compact";

const STORAGE_KEYS = {
  design: "site-design",
  colorMode: "site-color-mode",
  motion: "site-motion",
  density: "site-density"
} as const;

const defaults = {
  design: DEFAULT_DESIGN,
  colorMode: "system" as ColorMode,
  motion: "on" as MotionMode,
  density: "comfortable" as DensityMode
};

function getResolvedMode(mode: ColorMode) {
  if (mode !== "system") return mode;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applySettings(settings: {
  design: DesignId;
  colorMode: ColorMode;
  motion: MotionMode;
  density: DensityMode;
}) {
  const root = document.documentElement;
  root.dataset.design = settings.design;
  root.dataset.colorMode = settings.colorMode;
  root.dataset.resolvedMode = getResolvedMode(settings.colorMode);
  root.dataset.motion = settings.motion;
  root.dataset.density = settings.density;
}

function readSettings() {
  const storedDesign = localStorage.getItem(STORAGE_KEYS.design);
  const storedColorMode = localStorage.getItem(STORAGE_KEYS.colorMode) as ColorMode | null;
  const storedMotion = localStorage.getItem(STORAGE_KEYS.motion) as MotionMode | null;
  const storedDensity = localStorage.getItem(STORAGE_KEYS.density) as DensityMode | null;

  return {
    design: isDesignId(storedDesign) ? storedDesign : defaults.design,
    colorMode: storedColorMode === "light" || storedColorMode === "dark" || storedColorMode === "system" ? storedColorMode : defaults.colorMode,
    motion: storedMotion === "reduced" || storedMotion === "on" ? storedMotion : defaults.motion,
    density: storedDensity === "compact" || storedDensity === "comfortable" ? storedDensity : defaults.density
  };
}

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [design, setDesign] = useState<DesignId>(defaults.design);
  const [colorMode, setColorMode] = useState<ColorMode>(defaults.colorMode);
  const [motion, setMotion] = useState<MotionMode>(defaults.motion);
  const [density, setDensity] = useState<DensityMode>(defaults.density);

  useEffect(() => {
    const next = readSettings();
    setDesign(next.design);
    setColorMode(next.colorMode);
    setMotion(next.motion);
    setDensity(next.density);
    applySettings(next);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemMode = () => {
      if ((localStorage.getItem(STORAGE_KEYS.colorMode) || defaults.colorMode) === "system") {
        document.documentElement.dataset.resolvedMode = getResolvedMode("system");
      }
    };
    media.addEventListener("change", syncSystemMode);
    return () => media.removeEventListener("change", syncSystemMode);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("settings-open", open);
    return () => document.body.classList.remove("settings-open");
  }, [open]);

  function updateDesign(next: DesignId) {
    setDesign(next);
    localStorage.setItem(STORAGE_KEYS.design, next);
    applySettings({ design: next, colorMode, motion, density });
  }

  function updateColorMode(next: ColorMode) {
    setColorMode(next);
    localStorage.setItem(STORAGE_KEYS.colorMode, next);
    applySettings({ design, colorMode: next, motion, density });
  }

  function updateMotion(next: MotionMode) {
    setMotion(next);
    localStorage.setItem(STORAGE_KEYS.motion, next);
    applySettings({ design, colorMode, motion: next, density });
  }

  function updateDensity(next: DensityMode) {
    setDensity(next);
    localStorage.setItem(STORAGE_KEYS.density, next);
    applySettings({ design, colorMode, motion, density: next });
  }

  function resetSettings() {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    setDesign(defaults.design);
    setColorMode(defaults.colorMode);
    setMotion(defaults.motion);
    setDensity(defaults.density);
    applySettings(defaults);
  }

  return (
    <>
      <button
        className="settings-trigger"
        type="button"
        aria-expanded={open}
        aria-controls="settings-panel"
        onClick={() => setOpen(true)}
      >
        <span className="settings-trigger-icon" aria-hidden="true"><span /></span>
        <span data-en="Settings" data-zh="设置">设置</span>
      </button>
      {open ? (
        <div className="settings-layer" role="presentation">
          <button className="settings-backdrop" type="button" aria-label="关闭设置面板" onClick={() => setOpen(false)} />
          <aside className="settings-panel" id="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <div className="settings-head">
              <div>
                <p className="eyebrow" data-en="Personalize" data-zh="个性化">个性化</p>
                <h2 id="settings-title" data-en="Settings" data-zh="设置">设置</h2>
              </div>
              <button className="settings-close" type="button" onClick={() => setOpen(false)} aria-label="关闭">×</button>
            </div>

            <section className="settings-section">
              <div className="settings-section-head">
                <h3 data-en="Page Design" data-zh="页面风格">页面风格</h3>
                <p data-en="Choose a registered design. It applies across the whole site." data-zh="选择一个已注册风格，会应用到整个网站。">选择一个已注册风格，会应用到整个网站。</p>
              </div>
              <div className="design-options">
                {registeredDesigns.map((item) => (
                  <button
                    className={`design-option ${design === item.id ? "is-selected" : ""}`}
                    type="button"
                    key={item.id}
                    onClick={() => updateDesign(item.id)}
                    aria-pressed={design === item.id}
                  >
                    <span className="design-preview" data-preview={item.id} aria-hidden="true" />
                    <span className="design-option-copy">
                      <strong data-en={item.nameEn} data-zh={item.nameZh}>{item.nameZh}</strong>
                      <span data-en={item.descriptionEn} data-zh={item.descriptionZh}>{item.descriptionZh}</span>
                      <em data-en={item.recommendedEn} data-zh={item.recommendedZh}>{item.recommendedZh}</em>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="settings-section">
              <h3 data-en="Color Mode" data-zh="明暗模式">明暗模式</h3>
              <div className="segmented-control" role="group" aria-label="Color Mode">
                <button type="button" className={colorMode === "system" ? "is-selected" : ""} onClick={() => updateColorMode("system")} data-en="System" data-zh="跟随系统">跟随系统</button>
                <button type="button" className={colorMode === "light" ? "is-selected" : ""} onClick={() => updateColorMode("light")} data-en="Light" data-zh="浅色">浅色</button>
                <button type="button" className={colorMode === "dark" ? "is-selected" : ""} onClick={() => updateColorMode("dark")} data-en="Dark" data-zh="深色">深色</button>
              </div>
            </section>

            <section className="settings-section">
              <h3 data-en="Motion" data-zh="动效">动效</h3>
              <div className="segmented-control" role="group" aria-label="Motion">
                <button type="button" className={motion === "on" ? "is-selected" : ""} onClick={() => updateMotion("on")} data-en="On" data-zh="开启">开启</button>
                <button type="button" className={motion === "reduced" ? "is-selected" : ""} onClick={() => updateMotion("reduced")} data-en="Reduced" data-zh="减弱">减弱</button>
              </div>
            </section>

            <section className="settings-section">
              <h3 data-en="Reading Density" data-zh="阅读密度">阅读密度</h3>
              <div className="segmented-control" role="group" aria-label="Reading Density">
                <button type="button" className={density === "comfortable" ? "is-selected" : ""} onClick={() => updateDensity("comfortable")} data-en="Comfortable" data-zh="舒展">舒展</button>
                <button type="button" className={density === "compact" ? "is-selected" : ""} onClick={() => updateDensity("compact")} data-en="Compact" data-zh="紧凑">紧凑</button>
              </div>
            </section>

            <div className="settings-footer">
              <button className="button button-secondary" type="button" onClick={resetSettings} data-en="Reset" data-zh="恢复默认">恢复默认</button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
