import { Nav } from "../../../components/Nav";
import { ReadingManager } from "../../../components/content/ContentManagers";
import { getSiteData } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function ReadingPage() {
  const data = await getSiteData();

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
          <ReadingManager initialWorks={data.works} />
        </section>
      </main>
    </>
  );
}
