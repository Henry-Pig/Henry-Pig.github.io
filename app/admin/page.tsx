import { Nav } from "../../components/Nav";
import { AdminPanel } from "./AdminPanel";

export default function AdminPage() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <section className="page-hero shell">
          <div className="section-heading">
            <p className="eyebrow">Admin</p>
            <h1>添加内容</h1>
            <p className="muted-text">用一个很轻的后台，给动态、清单、书影和博客继续添东西。</p>
          </div>
          <AdminPanel />
        </section>
      </main>
    </>
  );
}
