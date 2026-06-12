import Link from "next/link";
import { SettingsPanel } from "./SettingsPanel";

type NavProps = {
  active?: "home" | "about" | "projects" | "life" | "blog";
  lifeActive?: "moments" | "todo" | "reading";
};

export function Nav({ active, lifeActive }: NavProps) {
  return (
    <header className="site-header">
      <nav className="nav shell" aria-label="主导航">
        <Link className={`brand ${active === "home" ? "active" : ""}`} href="/">
          <span className="brand-mark" aria-hidden="true">*</span>
          <span data-en="Home" data-zh="首页">首页</span>
        </Link>
        <div className="nav-right">
          <div className="nav-links">
            <Link className={active === "about" ? "active" : ""} href="/about" data-en="About" data-zh="关于我">关于我</Link>
            <Link className={active === "projects" ? "active" : ""} href="/projects" data-en="Projects" data-zh="项目">项目</Link>
            <div className={`nav-dropdown ${active === "life" ? "active" : ""}`} data-dropdown>
              <button className="nav-dropdown-toggle" type="button" aria-expanded="false" data-dropdown-toggle data-en="Life" data-zh="生活">
                生活
              </button>
              <div className="nav-dropdown-menu">
                <Link className={lifeActive === "moments" ? "active" : ""} href="/life/moments" data-en="Moments" data-zh="动态">动态</Link>
                <Link className={lifeActive === "todo" ? "active" : ""} href="/life/todo" data-en="Lists" data-zh="清单">清单</Link>
                <Link className={lifeActive === "reading" ? "active" : ""} href="/life/reading" data-en="Books & Films" data-zh="书影">书影</Link>
              </div>
            </div>
            <Link className={active === "blog" ? "active" : ""} href="/blog" data-en="Blog" data-zh="博客">博客</Link>
          </div>
          <SettingsPanel />
          <button className="language-toggle" type="button" aria-label="切换中英文" data-lang-toggle>EN</button>
        </div>
      </nav>
    </header>
  );
}
