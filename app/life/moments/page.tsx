import { Nav } from "../../../components/Nav";
import { MomentsManager } from "../../../components/content/ContentManagers";
import { getSiteData } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function MomentsPage() {
  const data = await getSiteData();

  return (
    <>
      <Nav active="life" lifeActive="moments" />
      <main className="page-main">
        <section className="page-hero shell">
          <div className="section-heading">
            <p className="eyebrow">Moments</p>
            <h1 data-en="Recent Traces" data-zh="一些最近的痕迹">一些最近的痕迹</h1>
            <p className="muted-text" data-en="Short notes and life fragments live here; not every sentence needs to become an article." data-zh="短内容和生活流放在这里，不必每句话都长成一篇文章。">短内容和生活流放在这里，不必每句话都长成一篇文章。</p>
          </div>
          <div className="moments-layout">
            <aside className="moments-side moments-left">
              <div className="side-panel"><h2 data-en="Current State" data-zh="最近状态">最近状态</h2><p data-en="Rebuilding the site / preparing for summer camps / keeping training" data-zh="整理主页 / 准备夏令营 / 保持训练">整理主页 / 准备夏令营 / 保持训练</p></div>
              <div className="side-panel"><h2 data-en="Tags" data-zh="标签">标签</h2><div className="mini-tags"><span data-en="Study" data-zh="学习">学习</span><span data-en="Fitness" data-zh="健身">健身</span><span data-en="Badminton" data-zh="羽毛球">羽毛球</span><span data-en="Gaming" data-zh="游戏">游戏</span><span data-en="Life" data-zh="生活">生活</span><span data-en="Notes" data-zh="杂谈">杂谈</span></div></div>
            </aside>
            <MomentsManager initialMoments={data.moments} />
            <aside className="moments-side moments-right">
              <div className="side-panel"><h2 data-en="Recently Done" data-zh="最近完成">最近完成</h2><p data-en="Split life records into moments, lists, and books & films." data-zh="把生活区拆成动态、清单和书影。">把生活区拆成动态、清单和书影。</p></div>
              <div className="side-panel"><h2 data-en="This Week" data-zh="本周待办">本周待办</h2><p data-en="Keep organizing project details and slowly fill the blog." data-zh="继续整理项目细节，慢慢补博客。">继续整理项目细节，慢慢补博客。</p></div>
              <div className="side-panel"><h2 data-en="One Line" data-zh="一句话">一句话</h2><p data-en="Make things small enough, and they become easier to keep doing." data-zh="把事情做小一点，才更容易一直做下去。">把事情做小一点，才更容易一直做下去。</p></div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
