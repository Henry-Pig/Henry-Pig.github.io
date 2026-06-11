const lifeData = {
  moments: {
    status: [
      { label: { en: "Status", zh: "最近状态" }, value: { en: "Rebuilding this site", zh: "整理个人主页中" } },
      { label: { en: "Doing", zh: "最近在做" }, value: { en: "Summer camp prep", zh: "准备夏令营" } },
      { label: { en: "Listening", zh: "最近在听" }, value: { en: "Piano pieces and quiet playlists", zh: "钢琴曲和安静歌单" } },
      { label: { en: "Watching", zh: "最近在看" }, value: { en: "Project notes and papers", zh: "项目笔记和论文" } }
    ],
    tags: ["学习", "健身", "羽毛球", "游戏", "生活", "杂谈"],
    posts: [
      {
        date: "2026.06.11",
        tag: "生活",
        body: {
          en: "Recently I have been rebuilding my personal website. I want it to feel less like a template and more like a place that actually belongs to me.",
          zh: "最近在整理个人主页，想让这个网站不要只是一个模板，而是更像一个真正属于我的地方。"
        }
      },
      {
        date: "2026.06.10",
        tag: "运动",
        body: {
          en: "Training felt average today, but I still finished the plan. Some days count simply because I did not skip them.",
          zh: "今天训练状态一般，但还是完成了计划。有些日子的意义就是没有跳过它。"
        }
      },
      {
        date: "2026.06",
        tag: "随想",
        body: {
          en: "Sometimes I do not want to write a complete blog post. I just want to leave a few words before the thought disappears.",
          zh: "有时候比起写一篇完整博客，更想随手记几句话，在想法消失之前先把它放下来。"
        }
      },
      {
        date: "2026.06",
        tag: "学习",
        body: {
          en: "I am preparing for summer camps and slowly adjusting my study rhythm. A little nervous, but still moving forward.",
          zh: "最近在准备夏令营，也在慢慢调整自己的学习节奏。有点紧张，但还在往前走。"
        },
        link: { href: "projects.html", label: { en: "Project archive", zh: "项目整理" } }
      }
    ],
    side: [
      { title: { en: "Recently Finished", zh: "最近完成" }, items: [{ en: "Reworked project detail pages", zh: "重写项目详情页" }, { en: "Set up life and blog sections", zh: "搭好生活和博客栏目" }] },
      { title: { en: "This Week", zh: "本周待办" }, items: [{ en: "Polish navigation", zh: "打磨导航结构" }, { en: "Organize notes", zh: "整理学习笔记" }] },
      { title: { en: "A Line", zh: "一句话摘录" }, items: [{ en: "Move slowly, but keep the page open.", zh: "慢慢来，但别把页面关掉。" }] }
    ]
  },
  todos: [
    {
      title: { en: "Projects I Want to Finish", zh: "想完成的项目" },
      items: [
        { text: { en: "Keep polishing my personal website", zh: "继续打磨个人主页" }, status: "doing" },
        { text: { en: "Organize project notes", zh: "整理项目笔记" }, status: "todo" },
        { text: { en: "Add a tag system to the blog", zh: "给博客增加标签系统" }, status: "todo" }
      ]
    },
    {
      title: { en: "Places I Want to Visit", zh: "想去的地方" },
      items: [
        { text: { en: "Go to the seaside once", zh: "去一次海边" }, status: "todo" },
        { text: { en: "Walk in a quiet city", zh: "找个安静的城市散步" }, status: "todo" },
        { text: { en: "Watch a sunrise", zh: "看一场日出" }, status: "todo" }
      ]
    },
    {
      title: { en: "Things I Want to Try", zh: "想体验的事情" },
      items: [
        { text: { en: "Try a new training plan", zh: "试一套新的训练计划" }, status: "doing" },
        { text: { en: "Practice a complete piano piece", zh: "练一首完整的钢琴曲" }, status: "todo" },
        { text: { en: "Learn a little photography seriously", zh: "认真学一点摄影" }, status: "todo" }
      ]
    },
    {
      title: { en: "Small Maybe-Plans", zh: "也许会做的小计划" },
      items: [
        { text: { en: "Record life fragments for a while", zh: "记录一段时间的生活碎片" }, status: "doing" },
        { text: { en: "Build my own books and films page", zh: "做一个自己的书影音记录页" }, status: "done" },
        { text: { en: "Write a few informal essays", zh: "写几篇不那么正式的小文章" }, status: "paused" }
      ]
    }
  ],
  works: {
    books: [
      { title: "置身事内", creator: "兰小欢", status: "want", note: { en: "A book I want to read carefully with notes.", zh: "想认真读一遍，并顺手做些笔记。" } },
      { title: "深入理解计算机系统", creator: "Randal E. Bryant / David R. O'Hallaron", status: "reading", note: { en: "Slow reading, but worth keeping nearby.", zh: "读得慢，但值得一直放在手边。" } },
      { title: "明朝那些事儿", creator: "当年明月", status: "done", date: "2025", note: { en: "Readable, vivid, and surprisingly sticky.", zh: "很好读，也很容易让人一直翻下去。" } }
    ],
    movies: [
      { title: "Interstellar", creator: "Christopher Nolan", status: "wantWatch", note: { en: "Saved for a night when I can watch it quietly.", zh: "留给一个能安静看完的晚上。" } },
      { title: "The Truman Show", creator: "Peter Weir", status: "watched", date: "2025", note: { en: "A short note may later become a longer blog post.", zh: "短感想先放这里，以后也许写成长文。" }, blogHref: "blog.html" },
      { title: "Soul", creator: "Pete Docter", status: "watched", note: { en: "Gentle, light, and a little sad.", zh: "温柔、轻盈，也有一点点难过。" } }
    ]
  },
  blogPosts: [
    {
      title: { en: "How I Rebuilt This Website", zh: "我是如何重构这个个人主页的" },
      date: "2026.06",
      category: { en: "Essay", zh: "随笔" },
      summary: { en: "About structure, style, and how a personal website slowly becomes personal.", zh: "关于结构、风格，以及一个个人主页如何慢慢变得像自己。" },
      href: "#"
    },
    {
      title: { en: "Notes on Graph Learning", zh: "图学习笔记" },
      date: "Draft",
      category: { en: "Study", zh: "学习总结" },
      summary: { en: "A future place for heterogeneous graphs, attention, and project reflections.", zh: "以后可以放异构图、注意力机制和科研项目复盘。" },
      href: "#"
    },
    {
      title: { en: "A Small Training Log", zh: "一点训练日志" },
      date: "Draft",
      category: { en: "Project Review", zh: "项目复盘" },
      summary: { en: "For deep learning experiments, debugging notes, and tiny lessons from failed runs.", zh: "给深度学习实验、调试记录和那些失败运行留下的小教训。" },
      href: "#"
    },
    {
      title: { en: "After Watching The Truman Show", zh: "看完《楚门的世界》之后" },
      date: "Draft",
      category: { en: "Film Notes", zh: "观后感" },
      summary: { en: "A placeholder for a longer film note linked from the books and films shelf.", zh: "从书影页跳转过来的长文占位，以后可以扩展成完整观后感。" },
      href: "#"
    }
  ]
};

(function () {
  const zhStatus = { todo: "想做", doing: "进行中", done: "已完成", paused: "暂时搁置", want: "想读", reading: "在读", wantWatch: "想看", watched: "已看" };
  const enStatus = { todo: "To Do", doing: "Doing", done: "Done", paused: "Paused", want: "To Read", reading: "Reading", wantWatch: "To Watch", watched: "Watched" };

  function lang() {
    return document.documentElement.lang === "zh-CN" ? "zh" : "en";
  }

  function t(value) {
    if (typeof value === "string") return value;
    return value[lang()] || value.zh || value.en || "";
  }

  function statusLabel(status) {
    return lang() === "zh" ? zhStatus[status] : enStatus[status];
  }

  function renderMoments() {
    const root = document.querySelector("[data-moments-root]");
    if (!root) return;
    const data = lifeData.moments;
    root.innerHTML = `
      <aside class="moments-side moments-left">
        <section class="side-panel">
          <h2>${lang() === "zh" ? "辅助状态" : "Status"}</h2>
          ${data.status.map((item) => `<div class="status-line"><span>${t(item.label)}</span><strong>${t(item.value)}</strong></div>`).join("")}
        </section>
        <section class="side-panel">
          <h2>${lang() === "zh" ? "本周关键词" : "This Week"}</h2>
          <div class="mini-tags">${data.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        </section>
      </aside>
      <section class="moment-feed" aria-label="${lang() === "zh" ? "动态流" : "Moment feed"}">
        ${data.posts.map((post) => `
          <article class="moment-post">
            <div class="moment-meta"><time>${post.date}</time><span>${post.tag}</span></div>
            <p>${t(post.body)}</p>
            ${post.link ? `<a class="text-link" href="${post.link.href}">${t(post.link.label)}</a>` : ""}
          </article>
        `).join("")}
      </section>
      <aside class="moments-side moments-right">
        ${data.side.map((block) => `
          <section class="side-panel">
            <h2>${t(block.title)}</h2>
            <ul>${block.items.map((item) => `<li>${t(item)}</li>`).join("")}</ul>
          </section>
        `).join("")}
      </aside>
    `;
  }

  function renderTodos() {
    const root = document.querySelector("[data-todo-root]");
    if (!root) return;
    root.innerHTML = lifeData.todos.map((group) => `
      <section class="todo-group">
        <h2>${t(group.title)}</h2>
        <ul>
          ${group.items.map((item) => `
            <li>
              <span class="todo-check" aria-hidden="true">${item.status === "done" ? "✓" : ""}</span>
              <span>${t(item.text)}</span>
              <em class="status-pill status-${item.status}">${statusLabel(item.status)}</em>
            </li>
          `).join("")}
        </ul>
      </section>
    `).join("");
  }

  function renderWorks() {
    const root = document.querySelector("[data-works-root]");
    if (!root) return;
    const renderItem = (item) => `
      <article class="work-item">
        <div>
          <h3>${item.title}</h3>
          <p>${item.creator || ""}</p>
        </div>
        <span class="status-pill status-${item.status}">${statusLabel(item.status)}</span>
        ${item.date ? `<time>${item.date}</time>` : ""}
        <p>${t(item.note)}</p>
        ${item.blogHref ? `<a class="text-link" href="${item.blogHref}">${lang() === "zh" ? "去博客看长文" : "Read long note"}</a>` : ""}
      </article>
    `;
    root.innerHTML = `
      <section class="works-section">
        <h2>${lang() === "zh" ? "书" : "Books"}</h2>
        <div class="works-list">${lifeData.works.books.map(renderItem).join("")}</div>
      </section>
      <section class="works-section">
        <h2>${lang() === "zh" ? "影" : "Films"}</h2>
        <div class="works-list">${lifeData.works.movies.map(renderItem).join("")}</div>
      </section>
    `;
  }

  function renderBlog() {
    const root = document.querySelector("[data-blog-root]");
    if (!root) return;
    root.innerHTML = lifeData.blogPosts.map((post) => `
      <article class="blog-row">
        <time>${post.date}</time>
        <div>
          <span class="badge">${t(post.category)}</span>
          <h2>${t(post.title)}</h2>
          <p>${t(post.summary)}</p>
          <a class="text-link" href="${post.href}">${lang() === "zh" ? "阅读全文" : "Read More"}</a>
        </div>
      </article>
    `).join("");
  }

  function renderLifeContent() {
    renderMoments();
    renderTodos();
    renderWorks();
    renderBlog();
  }

  document.addEventListener("DOMContentLoaded", renderLifeContent);
  document.addEventListener("site-language-change", renderLifeContent);
})();
