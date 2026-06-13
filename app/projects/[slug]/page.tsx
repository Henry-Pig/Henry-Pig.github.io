import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ACCESS_COOKIE_NAME, hasValidAccessCookie } from "../../../lib/accessControl";
import { ADMIN_COOKIE_NAME, hasValidAdminCookie } from "../../../lib/adminAuth";
import { AccessKeyGate } from "../../../components/AccessKeyGate";
import { MarkdownView } from "../../../components/MarkdownView";
import { Nav } from "../../../components/Nav";
import { getAccessControlSettings, getProjectBySlug } from "../../../lib/db";

type ProjectDetailProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const settings = await getAccessControlSettings();
  const cookieStore = await cookies();
  const hasAccess = hasValidAdminCookie(cookieStore.get(ADMIN_COOKIE_NAME)?.value) || hasValidAccessCookie(settings, cookieStore.get(ACCESS_COOKIE_NAME)?.value);

  if (!hasAccess) {
    return (
      <>
        <Nav active="projects" />
        <main className="page-main">
          <section className="page-hero shell">
            <div className="project-detail-layout">
              <article className="detail-main">
                <p className="eyebrow">{project.type}</p>
                <h1>{project.title}</h1>
                <AccessKeyGate title={project.title} description="这个项目详情已开启访问保护，请输入查看秘钥。" />
                <Link className="button button-secondary" href="/projects" data-en="Back to Projects" data-zh="返回项目目录">返回项目目录</Link>
              </article>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav active="projects" />
      <main className="page-main">
        <section className="page-hero shell">
          <div className="project-detail-layout">
            <article className="detail-main">
              <p className="eyebrow">{project.type}</p>
              <h1>{project.title}</h1>
              {project.description ? <p className="muted-text">{project.description}</p> : null}
              <div className="detail-meta-grid">
                <div><span data-en="Time" data-zh="时间">时间</span><strong>{project.period}</strong></div>
                <div><span data-en="Role" data-zh="角色">角色</span><strong>{project.role}</strong></div>
                <div><span data-en="Type" data-zh="类型">类型</span><strong>{project.type}</strong></div>
              </div>
              {project.coverImage ? <img className="article-cover" src={project.coverImage} alt={project.title} /> : null}
              <section className="detail-section"><h2 data-en="Overview" data-zh="项目简介">项目简介</h2><p>{project.summary}</p></section>
              {(project.content || []).map((section) => (
                <section className="detail-section" key={section.title}>
                  <h2>{section.title}</h2>
                  {section.body ? <MarkdownView content={section.body} /> : null}
                  {section.metrics?.length ? (
                    <div className="metric-grid">
                      {section.metrics.map((metric) => (
                        <article className="metric-card" key={metric.label}>
                          <span>{metric.label}</span>
                          <strong>{metric.value}</strong>
                          {metric.note ? <p>{metric.note}</p> : null}
                        </article>
                      ))}
                    </div>
                  ) : null}
                  {section.items?.length ? <ul className="detail-list">{section.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}
                </section>
              ))}
              <div className="project-tags">
                {project.techStack.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              {project.repoUrl ? <a className="button button-primary" href={project.repoUrl} target="_blank" rel="noopener" data-en="View Code" data-zh="查看代码">查看代码</a> : null}
              <Link className="button button-secondary" href="/projects" data-en="Back to Projects" data-zh="返回项目目录">返回项目目录</Link>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
