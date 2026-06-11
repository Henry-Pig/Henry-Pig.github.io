import { Nav } from "../../../components/Nav";
import { getSiteData } from "../../../lib/db";

export default async function MomentsPage() {
  const data = await getSiteData();

  return (
    <>
      <Nav active="life" lifeActive="moments" />
      <main className="page-main">
        <section className="page-hero shell">
          <div className="section-heading">
            <p className="eyebrow">Moments</p>
            <h1>一些最近的痕迹</h1>
            <p className="muted-text">短内容和生活流放在这里，不必每句话都长成一篇文章。</p>
          </div>
          <div className="moments-layout">
            <aside className="moments-side moments-left">
              <div className="side-panel"><h2>最近状态</h2><p>整理主页 / 准备夏令营 / 保持训练</p></div>
              <div className="side-panel"><h2>标签</h2><div className="mini-tags"><span>学习</span><span>健身</span><span>羽毛球</span><span>游戏</span><span>生活</span><span>杂谈</span></div></div>
            </aside>
            <div className="moment-feed">
              {data.moments.map((moment) => (
                <article className="moment-post" key={moment.id}>
                  <div className="moment-meta"><time>{moment.date}</time><span>{moment.tag}</span></div>
                  <p>{moment.content}</p>
                  {moment.linkUrl ? <a className="text-link" href={moment.linkUrl}>相关链接</a> : null}
                </article>
              ))}
            </div>
            <aside className="moments-side moments-right">
              <div className="side-panel"><h2>最近完成</h2><p>把生活区拆成动态、清单和书影。</p></div>
              <div className="side-panel"><h2>本周待办</h2><p>继续整理项目细节，慢慢补博客。</p></div>
              <div className="side-panel"><h2>一句话</h2><p>把事情做小一点，才更容易一直做下去。</p></div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
