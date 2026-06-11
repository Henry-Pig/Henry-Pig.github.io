import type { SiteData } from "./types";

export const seedData: SiteData = {
  moments: [
    {
      id: "seed-moment-1",
      date: "2026.06",
      tag: "生活",
      content: "最近在整理个人主页，想让这个网站更像我自己一点。"
    },
    {
      id: "seed-moment-2",
      date: "2026.06",
      tag: "运动",
      content: "今天训练状态一般，但还是完成了计划。"
    },
    {
      id: "seed-moment-3",
      date: "2026.06",
      tag: "随想",
      content: "有时候比起写一篇完整博客，更想随手记几句话。"
    },
    {
      id: "seed-moment-4",
      date: "2026.06",
      tag: "学习",
      content: "最近在准备夏令营，也在慢慢调整自己的学习节奏。"
    }
  ],
  todos: [
    { id: "seed-todo-1", category: "想完成的项目", title: "继续打磨个人主页", status: "doing" },
    { id: "seed-todo-2", category: "想完成的项目", title: "整理项目笔记", status: "todo" },
    { id: "seed-todo-3", category: "想完成的项目", title: "给博客增加标签系统", status: "todo" },
    { id: "seed-todo-4", category: "想去的地方", title: "去一次海边", status: "todo" },
    { id: "seed-todo-5", category: "想去的地方", title: "找个安静的城市散步", status: "todo" },
    { id: "seed-todo-6", category: "想去的地方", title: "看一场日出", status: "todo" },
    { id: "seed-todo-7", category: "想体验的事情", title: "试一套新的训练计划", status: "doing" },
    { id: "seed-todo-8", category: "想体验的事情", title: "练一首完整的钢琴曲", status: "todo" },
    { id: "seed-todo-9", category: "想体验的事情", title: "认真学一点摄影", status: "todo" },
    { id: "seed-todo-10", category: "也许会做的小计划", title: "记录一段时间的生活碎片", status: "doing" },
    { id: "seed-todo-11", category: "也许会做的小计划", title: "做一个自己的书影音记录页", status: "done" },
    { id: "seed-todo-12", category: "也许会做的小计划", title: "写几篇不那么正式的小文章", status: "todo" }
  ],
  works: [
    {
      id: "seed-work-1",
      type: "book",
      title: "置身事内",
      creator: "兰小欢",
      status: "想读",
      note: "想补一点关于现实运行机制的理解。"
    },
    {
      id: "seed-work-2",
      type: "book",
      title: "纳瓦尔宝典",
      creator: "Eric Jorgenson",
      status: "已读",
      date: "2026.05",
      note: "有些句子适合慢慢嚼，不急着变成方法论。"
    },
    {
      id: "seed-work-3",
      type: "movie",
      title: "海边的曼彻斯特",
      creator: "Kenneth Lonergan",
      status: "想看",
      note: "一直听说它很安静，也很重。"
    },
    {
      id: "seed-work-4",
      type: "movie",
      title: "心灵奇旅",
      creator: "Pete Docter",
      status: "已看",
      date: "2026.04",
      note: "关于热爱，也关于生活本身不必总被证明。"
    }
  ],
  blogPosts: [
    {
      id: "seed-blog-1",
      title: "把个人主页改得更像自己",
      slug: "make-homepage-more-like-me",
      date: "2026.06",
      category: "随笔",
      summary: "关于为什么想把主页从项目展板，慢慢改成一个能留下生活痕迹的小地方。"
    },
    {
      id: "seed-blog-2",
      title: "一次项目复盘的开始",
      slug: "project-review-start",
      date: "2026.06",
      category: "项目复盘",
      summary: "先留一个位置，之后把做过的科研和课程项目拆开讲清楚。"
    },
    {
      id: "seed-blog-3",
      title: "读后感和观后感应该放在哪里",
      slug: "reading-notes-and-reviews",
      date: "2026.06",
      category: "书影",
      summary: "短记录放在书影页，完整表达放在博客页。这样它们都能待在舒服的位置。"
    }
  ]
};
