import { Nav } from "../../components/Nav";
import { ProjectManager } from "../../components/content/ProjectManager";
import { getProjects } from "../../lib/db";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();
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
            <ProjectManager initialProjects={projects} />
          </div>
        </section>
      </main>
    </>
  );
}
