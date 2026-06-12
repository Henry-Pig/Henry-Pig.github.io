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
            <h1 data-en="Add Content" data-zh="添加内容">添加内容</h1>
            <p className="muted-text" data-en="A lightweight admin page for moments, lists, books, films, blogs, and background music." data-zh="用一个很轻的后台，给动态、清单、书影、博客和背景音乐继续添东西。">用一个很轻的后台，给动态、清单、书影、博客和背景音乐继续添东西。</p>
          </div>
          <AdminPanel />
        </section>
      </main>
    </>
  );
}
