import Link from "next/link";
import { Nav } from "../../components/Nav";
import { projects } from "../../lib/projects";

export default function ProjectsPage() {
  return (
    <>
      <Nav active="projects" />
      <main className="page-main">
        <section className="page-hero section-soft">
          <div className="shell">
            <div className="section-heading">
              <p className="eyebrow" data-en="Projects" data-zh="项目">项目</p>
              <h1 data-en="Research and Projects" data-zh="科研与项目经历">科研与项目经历</h1>
              <p data-en="A chronological selection of my research and engineering work." data-zh="按时间顺序整理的科研与工程项目。">按时间顺序整理的科研与工程项目。</p>
            </div>
            <div className="project-timeline">
              {projects.map((project) => (
                <article className="project-row" key={project.slug}>
                  <time className="project-time">{project.time}</time>
                  <div className="project-card">
                    <div className="project-card-head">
                      <span className="badge">{project.type}</span>
                      <span className="project-role">{project.role}</span>
                    </div>
                    <h2><Link href={`/projects/${project.slug}`}>{project.title}</Link></h2>
                    <p>{project.summary}</p>
                    <div className="project-tags">
                      {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                    <Link className="button button-secondary" href={`/projects/${project.slug}`} data-en="View Details" data-zh="查看详情">查看详情</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
