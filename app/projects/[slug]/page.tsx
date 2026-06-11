import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "../../../components/Nav";
import { projects } from "../../../lib/projects";

type ProjectDetailProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  return (
    <>
      <Nav active="projects" />
      <main className="page-main">
        <section className="page-hero shell">
          <div className="project-detail-layout">
            <article className="detail-main">
              <p className="eyebrow">{project.type}</p>
              <h1>{project.title}</h1>
              <p className="muted-text">{project.enTitle}</p>
              <div className="detail-meta-grid">
                <div><span>时间</span><strong>{project.time}</strong></div>
                <div><span>角色</span><strong>{project.role}</strong></div>
                <div><span>类型</span><strong>{project.type}</strong></div>
              </div>
              <section className="detail-section">
                <h2>项目简介</h2>
                <p>{project.summary}</p>
              </section>
              <section className="detail-section">
                <h2>展示重点</h2>
                <ul className="detail-list">
                  <li>保留原有项目展示内容的核心信息，迁移到 Next.js 路由体系。</li>
                  <li>后续可以继续把论文细节、实验表格和个人贡献整理为数据库内容或 Markdown 页面。</li>
                  <li>当前页面先作为迁移后的项目详情入口，保证 Vercel 部署后链接可访问。</li>
                </ul>
              </section>
              <div className="project-tags">
                {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <Link className="button button-secondary" href="/projects">返回项目目录</Link>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
