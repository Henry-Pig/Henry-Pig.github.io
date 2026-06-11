import { Nav } from "../../../components/Nav";
import { getSiteData } from "../../../lib/db";

const statusText: Record<string, string> = {
  todo: "想做",
  doing: "进行中",
  done: "已完成",
  paused: "暂时搁置"
};

export default async function TodoPage() {
  const data = await getSiteData();
  const groups = Array.from(new Set(data.todos.map((item) => item.category)));

  return (
    <>
      <Nav active="life" lifeActive="todo" />
      <main className="page-main">
        <section className="page-hero shell">
          <div className="section-heading">
            <p className="eyebrow">Lists</p>
            <h1>等着去做的事</h1>
            <p className="muted-text">一个可以持续添加的小清单，放想做、想去和想完成的事情。</p>
          </div>
          <div className="todo-list-page">
            {groups.map((group) => (
              <section className="todo-group" key={group}>
                <h2>{group}</h2>
                <ul>
                  {data.todos.filter((item) => item.category === group).map((item) => (
                    <li key={item.id}>
                      <span className={`todo-check ${item.status === "done" ? "is-done" : ""}`} aria-hidden="true">{item.status === "done" ? "✓" : ""}</span>
                      <span>{item.title}</span>
                      <span className={`status-pill status-${item.status}`}>{statusText[item.status] || item.status}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
