import Link from "next/link";
import { Nav } from "../components/Nav";

export default function HomePage() {
  return (
    <div className="home-page">
      <Nav active="home" />
      <main className="home-stage" aria-label="主页入口">
        <section className="darkness-hero">
          <h1 className="darkness-title" data-title="en" aria-label="Hello Darkness" hidden>
            {"Hello Darkness".split("").map((letter, index) => (
              letter === " "
                ? <span key={index} className="word-gap" aria-hidden="true" />
                : <span key={index} style={{ "--d": `${Math.abs(index - 6) * 0.08}s` } as React.CSSProperties}>{letter}</span>
            ))}
          </h1>
          <h1 className="darkness-title darkness-title-zh" data-title="zh" aria-label="与暗和，终见明">
            {"与暗和，终见明".split("").map((letter, index) => (
              <span key={index} style={{ "--d": `${Math.abs(index - 3) * 0.16}s` } as React.CSSProperties}>{letter}</span>
            ))}
          </h1>
          <p className="home-subtitle" data-en="Yu Shuheng · Computer Science Student · Algorithms / Projects / Graduate Recommendation" data-zh="于书蘅 · 计算机学生 · 算法 / 项目展示 / 保研准备">
            于书蘅 · 计算机学生 · 算法 / 项目展示 / 保研准备
          </p>
          <div className="home-actions">
            <Link className="button button-primary home-enter" href="/about" data-en="About" data-zh="关于我">关于我</Link>
            <Link className="button button-secondary home-enter" href="/projects" data-en="Projects" data-zh="项目展示">项目展示</Link>
            <Link className="button button-secondary home-enter" href="/life" data-en="Life" data-zh="生活">生活</Link>
            <Link className="button button-secondary home-enter" href="/blog" data-en="Blog" data-zh="博客">博客</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
