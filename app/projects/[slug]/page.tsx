import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "../../../components/Nav";
import { getProjectBySlug } from "../../../lib/db";

type ProjectDetailProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

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
              {project.description ? <p className="muted-text">{project.description}</p> : null}
              <div className="detail-meta-grid">
                <div><span>时间</span><strong>{project.period}</strong></div>
                <div><span>角色</span><strong>{project.role}</strong></div>
                <div><span>类型</span><strong>{project.type}</strong></div>
              </div>
              {project.coverImage ? <img className="article-cover" src={project.coverImage} alt={project.title} /> : null}
              <section className="detail-section"><h2>项目简介</h2><p>{project.summary}</p></section>
              {(project.content || []).map((section) => (
                <section className="detail-section" key={section.title}>
                  <h2>{section.title}</h2>
                  {section.body ? <p>{section.body}</p> : null}
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
              {project.repoUrl ? <a className="button button-primary" href={project.repoUrl} target="_blank" rel="noopener">查看代码</a> : null}
              <Link className="button button-secondary" href="/projects">返回项目目录</Link>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
