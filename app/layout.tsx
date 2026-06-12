import type { Metadata } from "next";
import Script from "next/script";
import "../styles.css";

export const metadata: Metadata = {
  title: "于书蘅 | Personal Homepage",
  description: "于书蘅的个人主页、项目展示、生活记录与博客。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const themeInitializer = `
    (function () {
      try {
        var root = document.documentElement;
        var design = localStorage.getItem("site-design") || "default";
        var colorMode = localStorage.getItem("site-color-mode") || "system";
        var motion = localStorage.getItem("site-motion") || "on";
        var density = localStorage.getItem("site-density") || "comfortable";
        var validDesigns = ["default", "dark-academic", "glassmorphism", "minimal-light", "cyber-game"];
        if (validDesigns.indexOf(design) === -1) design = "default";
        if (["system", "light", "dark"].indexOf(colorMode) === -1) colorMode = "system";
        if (["on", "reduced"].indexOf(motion) === -1) motion = "on";
        if (["comfortable", "compact"].indexOf(density) === -1) density = "comfortable";
        var resolvedMode = colorMode === "system"
          ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
          : colorMode;
        root.dataset.design = design;
        root.dataset.colorMode = colorMode;
        root.dataset.resolvedMode = resolvedMode;
        root.dataset.motion = motion;
        root.dataset.density = density;
      } catch (error) {
        document.documentElement.dataset.design = "default";
        document.documentElement.dataset.colorMode = "system";
        document.documentElement.dataset.resolvedMode = "light";
        document.documentElement.dataset.motion = "on";
        document.documentElement.dataset.density = "comfortable";
      }
    })();
  `;

  return (
    <html lang="zh-CN">
      <body>
        <Script id="theme-initializer" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitializer }} />
        {children}
        <Script src="/language.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
