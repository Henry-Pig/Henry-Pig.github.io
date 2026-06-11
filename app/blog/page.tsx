import { Nav } from "../../components/Nav";
import { BlogManager } from "../../components/content/ContentManagers";
import { getSiteData } from "../../lib/db";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const data = await getSiteData();

  return (
    <>
      <Nav active="blog" />
      <main className="page-main">
        <section className="page-hero shell">
          <div className="section-heading">
            <p className="eyebrow">Blog</p>
            <h1 data-en="Before Thoughts Scatter" data-zh="在想法散开之前">在想法散开之前</h1>
            <p className="muted-text" data-en="Longer essays, study notes, project reviews, and book or film reflections live here." data-zh="这里放比较完整的小文章、学习笔记、项目复盘和书影音长文。">这里放比较完整的小文章、学习笔记、项目复盘和书影音长文。</p>
          </div>
          <BlogManager initialPosts={data.blogPosts} />
        </section>
      </main>
    </>
  );
}
