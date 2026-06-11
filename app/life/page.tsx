import Link from "next/link";
import { Nav } from "../../components/Nav";

export default function LifePage() {
  return (
    <>
      <Nav active="life" />
      <main className="page-main">
        <section className="page-hero shell">
          <div className="section-heading">
            <p className="eyebrow" data-en="Life" data-zh="生活">生活</p>
            <h1 data-en="Small Records, Kept Slowly" data-zh="慢慢存放一些生活">慢慢存放一些生活</h1>
            <p className="muted-text" data-en="Moments, lists, books, films, and things that are not quite projects." data-zh="这里放一些不完全属于项目的东西：近况、清单、书与影，以及一些日常的微光。">这里放一些不完全属于项目的东西：近况、清单、书与影，以及一些日常的微光。</p>
          </div>
          <div className="feature-grid">
            <article className="feature-card"><span className="badge">Moments</span><h2 data-en="Recent Notes" data-zh="近况记录">近况记录</h2><p data-en="Life updates, tiny essays, and stage notes." data-zh="生活记录、随笔式更新，以及阶段性的想法。">生活记录、随笔式更新，以及阶段性的想法。</p><Link className="text-link" href="/life/moments" data-en="Open Moments" data-zh="查看动态">查看动态</Link></article>
            <article className="feature-card"><span className="badge">Lists</span><h2 data-en="Things To Do" data-zh="想做的事">想做的事</h2><p data-en="Projects, places, and experiences waiting on the table." data-zh="想完成的项目、想去的地方、想体验的事情。">想完成的项目、想去的地方、想体验的事情。</p><Link className="text-link" href="/life/todo" data-en="Open Lists" data-zh="查看清单">查看清单</Link></article>
            <article className="feature-card"><span className="badge">Books & Films</span><h2 data-en="Reading and Watching" data-zh="阅读与观影">阅读与观影</h2><p data-en="A place for to-read, to-watch, and finished records." data-zh="想读、想看，以及已经读过看过的记录。">想读、想看，以及已经读过看过的记录。</p><Link className="text-link" href="/life/reading" data-en="Open Books & Films" data-zh="查看书影">查看书影</Link></article>
          </div>
        </section>
      </main>
    </>
  );
}
