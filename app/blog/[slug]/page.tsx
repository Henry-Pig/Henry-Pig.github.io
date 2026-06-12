import Link from "next/link";
import { cookies } from "next/headers";
import { ACCESS_COOKIE_NAME, hasValidAccessCookie } from "../../../lib/accessControl";
import { AccessKeyGate } from "../../../components/AccessKeyGate";
import { Nav } from "../../../components/Nav";
import { MarkdownView } from "../../../components/MarkdownView";
import { getAccessControlSettings, getSiteData } from "../../../lib/db";

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

  const settings = await getAccessControlSettings();
  const cookieStore = await cookies();
  const hasAccess = hasValidAccessCookie(settings, cookieStore.get(ACCESS_COOKIE_NAME)?.value);

  if (!hasAccess) {
    return (
      <>
        <Nav active="blog" />
        <main className="page-main">
          <article className="page-hero shell blog-article">
            <p className="eyebrow">{post.category} · {post.date}</p>
            <h1>{post.title}</h1>
            <AccessKeyGate title={post.title} description="这篇博客已开启访问保护，请输入查看秘钥。" />
            <Link className="button button-secondary" href="/blog" data-en="Back to Blog" data-zh="返回博客列表">返回博客列表</Link>
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
