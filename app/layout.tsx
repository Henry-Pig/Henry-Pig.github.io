import type { Metadata } from "next";
import Script from "next/script";
import "../styles.css";

export const metadata: Metadata = {
  title: "于书蘅 | Personal Homepage",
  description: "于书蘅的个人主页、项目展示、生活记录与博客。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <Script src="/language.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
