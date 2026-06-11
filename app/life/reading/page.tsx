import { Nav } from "../../../components/Nav";
import { getSiteData } from "../../../lib/db";

export default async function ReadingPage() {
  const data = await getSiteData();
  const books = data.works.filter((item) => item.type === "book");
  const movies = data.works.filter((item) => item.type === "movie");

  return (
    <>
      <Nav active="life" lifeActive="reading" />
      <main className="page-main">
        <section className="page-hero shell">
          <div className="section-heading">
            <p className="eyebrow">Books & Films</p>
            <h1>想读，也想看</h1>
            <p className="muted-text">书影页是轻量索引，短感想留在这里，长文放去博客。</p>
          </div>
          <div className="works-board">
            <WorkSection title="书" items={books} />
            <WorkSection title="影" items={movies} />
          </div>
        </section>
      </main>
    </>
  );
}

function WorkSection({ title, items }: { title: string; items: Awaited<ReturnType<typeof getSiteData>>["works"] }) {
  return (
    <section className="works-section">
      <h2>{title}</h2>
      <div className="works-list">
        {items.map((item) => (
          <article className="work-item" key={item.id}>
            <div>
              <h3>{item.title}</h3>
              <p>{[item.creator, item.date].filter(Boolean).join(" · ")}</p>
            </div>
            <span className="status-pill">{item.status}</span>
            {item.note ? <p>{item.note}</p> : null}
            {item.blogUrl ? <a className="text-link" href={item.blogUrl}>去博客看长文</a> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
