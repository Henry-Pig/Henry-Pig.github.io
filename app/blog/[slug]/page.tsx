import Link from "next/link";
import { Nav } from "../../../components/Nav";
import { MarkdownView } from "../../../components/MarkdownView";
import { getSiteData } from "../../../lib/db";

export const dynamic = "force-dynamic";

type BlogDetailProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const data = await getSiteData();
  const post = data.blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <>
        <Nav active="blog" />
        <main className="page-main">
          <article className="page-hero shell blog-article">
            <p className="eyebrow">Blog</p>
            <h1>文章暂时没有找到</h1>
            <p className="muted-text">可能是链接里的 slug 变化了，或者文章已经被删除。</p>
            <Link className="button button-secondary" href="/blog">返回博客列表</Link>
          </article>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav active="blog" />
      <main className="page-main">
        <article className="page-hero shell blog-article">
          <p className="eyebrow">{post.category} · {post.date}</p>
          <h1>{post.title}</h1>
          <p className="muted-text">{post.summary}</p>
          {post.coverImageUrl ? <img className="article-cover" src={post.coverImageUrl} alt={post.title} /> : null}
          <div className="lead-card">
            {post.content ? <MarkdownView content={post.content} /> : <p>这篇文章还只是一个占位，之后可以在后台继续补正文。</p>}
          </div>
          <Link className="button button-secondary" href="/blog">返回博客列表</Link>
        </article>
      </main>
    </>
  );
}
