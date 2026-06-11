import Link from "next/link";
import { Nav } from "../../components/Nav";
import { getSiteData } from "../../lib/db";

export default async function BlogPage() {
  const data = await getSiteData();

  return (
    <>
      <Nav active="blog" />
      <main className="page-main">
        <section className="page-hero shell">
          <div className="section-heading">
            <p className="eyebrow">Blog</p>
            <h1>在想法散开之前</h1>
            <p className="muted-text">这里放比较完整的小文章、学习笔记、项目复盘和书影音长文。</p>
          </div>
          <div className="blog-index">
            {data.blogPosts.map((post) => (
              <article className="blog-row" key={post.id}>
                <time>{post.date}</time>
                <div>
                  <span className="badge">{post.category}</span>
                  <h2>{post.title}</h2>
                  <p>{post.summary}</p>
                  <Link className="text-link" href={`/blog/${post.slug}`}>阅读全文</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
