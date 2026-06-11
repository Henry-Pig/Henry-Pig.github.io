import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "../../../components/Nav";
import { getSiteData } from "../../../lib/db";

type BlogDetailProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const data = await getSiteData();
  const post = data.blogPosts.find((item) => item.slug === slug);

  if (!post) notFound();

  return (
    <>
      <Nav active="blog" />
      <main className="page-main">
        <article className="page-hero shell blog-article">
          <p className="eyebrow">{post.category} · {post.date}</p>
          <h1>{post.title}</h1>
          <p className="muted-text">{post.summary}</p>
          <div className="lead-card">
            {post.content ? post.content.split("\n").map((line) => <p key={line}>{line}</p>) : <p>这篇文章还只是一个占位，之后可以在后台继续补正文。</p>}
          </div>
          <Link className="button button-secondary" href="/blog">返回博客列表</Link>
        </article>
      </main>
    </>
  );
}
