import { Nav } from "../../../components/Nav";
import { TodoManager } from "../../../components/content/ContentManagers";
import { getSiteData } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function TodoPage() {
  const data = await getSiteData();

  return (
    <>
      <Nav active="life" lifeActive="todo" />
      <main className="page-main">
        <section className="page-hero shell">
          <div className="section-heading">
            <p className="eyebrow">Lists</p>
            <h1 data-en="Things Waiting To Be Done" data-zh="等着去做的事">等着去做的事</h1>
            <p className="muted-text" data-en="A clean little list for things I want to do, places I want to go, and projects I want to finish." data-zh="一个可以持续添加的小清单，放想做、想去和想完成的事情。">一个可以持续添加的小清单，放想做、想去和想完成的事情。</p>
          </div>
          <TodoManager initialTodos={data.todos} />
        </section>
      </main>
    </>
  );
}
