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
            <h1 data-en="Admin Dashboard" data-zh="后台管理">后台管理</h1>
            <p className="muted-text" data-en="Login first, then manage global settings such as music and access keys." data-zh="请先登录，然后管理背景音乐、访问秘钥等全局设置。">请先登录，然后管理背景音乐、访问秘钥等全局设置。</p>
          </div>
          <AdminPanel />
        </section>
      </main>
    </>
  );
}
