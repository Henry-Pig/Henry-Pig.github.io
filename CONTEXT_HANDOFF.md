# 个人主页项目交接文档

更新时间：2026-06-12  
项目目录：`D:\mywebsite\Henry-Pig.github.io`

这份文档用于新开 Codex 对话时快速接续当前项目。新对话开始后，可以直接说：“请先阅读 `CONTEXT_HANDOFF.md`，继续帮我维护这个项目。”

## 项目现状

这是一个个人主页项目，已经从早期的 GitHub Pages 静态 HTML 逐步改造成：

- Next.js App Router 项目
- Node.js API Route 后端
- Neon Postgres 数据库
- Vercel 部署
- Vercel Blob 用于图片上传
- 管理员登录后可在页面内添加/管理内容

旧的静态 HTML 文件仍然保留，例如：

- `index.html`
- `about.html`
- `projects.html`
- `moments.html`
- `todo.html`
- `reading.html`
- `blog.html`

但当前线上主要运行的是 Next.js 的 `app/` 目录。

## 当前技术栈

- Next.js
- React / TypeScript
- Neon Postgres
- Vercel
- Vercel Blob
- `react-markdown`
- `remark-gfm`

关键配置文件：

- `package.json`
- `next.config.mjs`
- `tsconfig.json`
- `.env.example`
- `.env.local`
- `.gitignore`

注意：`.env.local` 包含真实密钥，不要提交，不要在对话里打印。

## 环境变量

本地 `.env.local` 和 Vercel Environment Variables 至少需要：

```env
DATABASE_URL=你的 Neon Postgres 连接串
ADMIN_TOKEN=你的管理员 token
BLOB_READ_WRITE_TOKEN=你的 Vercel Blob token
```

注意事项：

- `DATABASE_URL` 用于 Neon Postgres。
- `ADMIN_TOKEN` 用于管理员权限校验。
- `BLOB_READ_WRITE_TOKEN` 用于 Vercel Blob 图片上传。
- 目前图片上传要求 Blob Store 是 **Public**。
- 如果 Blob Store 是 Private，会报错：

```text
Cannot use public access on a private store. The store is configured with private access.
```

原因是当前 `@vercel/blob` 版本和网站展示需求使用的是公开图片 URL。正确做法是新建 Public Blob Store，然后替换 Vercel 环境变量里的 `BLOB_READ_WRITE_TOKEN`，再重新部署。

## 重要目录与文件

### 页面

- `app/page.tsx`：首页
- `app/about/page.tsx`：关于我
- `app/projects/page.tsx`：项目目录
- `app/projects/[slug]/page.tsx`：项目详情页
- `app/life/page.tsx`：生活总览
- `app/life/moments/page.tsx`：动态
- `app/life/todo/page.tsx`：清单 / Todo
- `app/life/reading/page.tsx`：书影 / To Read
- `app/blog/page.tsx`：博客列表
- `app/blog/[slug]/page.tsx`：博客详情
- `app/admin/page.tsx`：旧的集中管理页，目前不再强依赖

### 组件

- `components/Nav.tsx`：导航栏与语言切换按钮
- `components/MarkdownView.tsx`：Markdown 渲染组件
- `components/content/ContentManagers.tsx`：动态、博客、Todo、书影的页面内管理组件
- `components/content/ProjectManager.tsx`：项目页面内管理组件

### API

- `app/api/content/route.ts`：动态、博客、Todo、书影等内容 API
- `app/api/projects/route.ts`：项目 API
- `app/api/upload/route.ts`：图片上传 API

### 数据和数据库

- `lib/db.ts`：数据库连接、建表、查询、写入、更新、删除
- `lib/seed.ts`：初始数据
- `lib/types.ts`：类型定义
- `lib/project-data.ts`：项目默认数据与结构化项目详情

### 样式与语言

- `styles.css`：全局样式
- `public/language.js`：中英文切换脚本
- `DESIGN.md`：早期设计规范文档
- `design/`：不同风格设计参考文档

目前代码中没有直接引用 `DESIGN.md` 或 `design/DESIGN_*.md`。它们是设计参考文档，不参与运行。

## 已完成的主要功能

### 1. Next.js + Vercel + Neon 改造

项目已经能通过 Vercel 部署，并连接 Neon Postgres。

本地运行：

```bash
npm run dev
```

构建检查：

```bash
npm run build
```

### 2. 管理员权限

写操作需要管理员 token。

前端会保存或使用管理员 token，后端 API 也会校验：

```http
x-admin-token: ADMIN_TOKEN
```

普通访客只能浏览，不能添加、删除、勾选或修改状态。

### 3. 页面内内容管理

现在不是完全依赖 `/admin` 集中添加内容，而是在对应页面里管理：

- 动态页：添加动态，支持文本和图片 URL / 上传
- 博客页：添加博客，支持标题、摘要、正文 Markdown、封面图、正文图片
- Todo 页：添加待办，管理员可以勾选完成状态
- 书影页：添加书籍/电影，管理员可以切换状态

核心实现位于：

```text
components/content/ContentManagers.tsx
```

### 4. 图片上传

图片上传 API：

```text
app/api/upload/route.ts
```

当前逻辑：

- 只允许管理员上传
- 限制文件类型：jpg / png / webp / gif
- 限制大小：5MB
- 使用 Vercel Blob
- 返回图片 URL

关键注意：

- 代码里使用 `access: "public"`。
- 当前安装的 `@vercel/blob` 类型定义只允许 public。
- 不能简单改成 `private`，会导致 TypeScript / build 报错，也不适合公开个人主页图片展示。
- 如果上传报 Access denied，大概率是 token 不对、Blob Store 没关联当前项目、或者使用了 Private Store 的 token。

### 5. Markdown 渲染

已经添加：

```text
components/MarkdownView.tsx
```

依赖：

- `react-markdown`
- `remark-gfm`

博客详情页已经使用 Markdown 渲染。

项目详情页也已经改为使用 Markdown 渲染项目正文：

```text
app/projects/[slug]/page.tsx
```

注意：项目详情中的“实验结果三个指标卡片”不是从 Markdown 里来的，而是来自项目结构化数据：

```text
section.metrics
```

这些数据存在于：

```text
lib/project-data.ts
```

或数据库 `projects.content` 的 JSON 中。

目前项目编辑表单主要编辑 `section.body`，还没有做可视化 metrics 编辑器。

## 项目页面内容

已经建立了多个项目详情页，包括：

- 篮球持球人身份重识别：`basketball-reid`
- ConvNeXt V2 论文复现与改进：`convnextv2-lightlygrn`
- DTI 双通道子图注意力框架：`dti-subgraph-attention`
- DenseNet121 Caltech-101 图像识别：`densenet-caltech101`

默认数据在：

```text
lib/project-data.ts
```

数据库首次为空时，会从默认数据 seed。

如果已经部署过并写入数据库，修改 `lib/project-data.ts` 不一定会影响线上已有项目，因为线上可能优先读取数据库里的旧 JSON。需要通过项目编辑功能或手动 migration 更新数据库内容。

## 中英文切换

语言切换使用：

```text
public/language.js
```

机制：

- 页面元素通过 `data-zh` 和 `data-en` 配置中英文
- 点击导航栏语言按钮后切换
- 当前语言保存到 `localStorage`
- 刷新后保持上次语言
- 使用 `MutationObserver` 处理动态加载内容

注意事项：

- 动态数据库内容暂时不要求双语。
- 静态 UI 文案应该尽量加 `data-zh` / `data-en`。
- 不要把 `data-zh` / `data-en` 加到包含 input、select、button 子元素的父标签上，否则脚本会用 `textContent` 替换并破坏子元素。

已知曾经的问题：

- 英文切换后只有部分内容变英文。
- 修复方向是继续给静态标题、按钮、说明文字补充 `data-zh` / `data-en`。
- 新对话如果继续修，要全局搜索硬编码中文。

推荐检查命令：

```bash
rg "[\u4e00-\u9fff]" app components lib public -g "!node_modules/**" -g "!.next/**"
```

## 关于我内容

当前 `app/about/page.tsx` 中中文自我介绍应为：

```text
你好，我是于书蘅，本科就读于吉林大学。

平时主要在计算机的世界里打怪升级，和代码、算法、专业课以及各种意义上的 bug 斗智斗勇；学习之余，也会在健身房和羽毛球馆随机刷新。

但说到底，我也是一个很贪玩的人。尽管没有多么精湛的技术，但当我化身 Tenno 在星际间穿梭，拿起 AK 在沙二出生入死，或是举起金箍棒面对大圣残躯时，我仿佛又变回了那个尚未长大的、无忧无虑的小孩。

我没有漩涡鸣人那样强大的毅力，也没有宇智波佐助那样惊人的天赋，但我依然在磕磕绊绊中努力长大，慢慢成为更好的自己。
```

不要再压缩成简短版。

## Todo / To Read 布局

曾经修复过删除按钮布局问题：

- 删除按钮被挤成“删 / 除”竖排
- checkbox、标题、状态标签、删除按钮错位

修复点大致在：

- `components/content/ContentManagers.tsx`
- `styles.css`

相关类名包括：

- `.todo-title`
- `.item-actions`
- `.item-delete`
- `.text-danger`

预期：

```text
[checkbox] 标题文字                         [状态标签] [删除]
```

普通访客不应看到删除按钮。

## 生活与博客页面结构

导航结构目标：

```text
首页 / 关于我 / 项目 / 生活 / 博客
```

生活下拉菜单：

```text
动态
清单
书影
```

动态页：

- 桌面端三栏布局
- 左侧状态区
- 中间动态流
- 右侧碎片区
- 移动端单栏，优先展示动态流

清单页：

- 竖直列表
- 按类别分组
- 轻量 checkbox / 状态标签

书影页：

- 书 / 影
- 想读、已读、想看、已看等状态
- 简短记录放书影页，长文放博客页

博客页：

- 文章列表
- 标题、日期、分类、摘要、阅读全文

## Vercel 部署流程

一般流程：

```bash
git status
git add .
git commit -m "描述这次修改"
git push
```

然后 Vercel 会自动部署。

如果只是改了 Vercel 环境变量：

1. Vercel Dashboard
2. Project
3. Settings
4. Environment Variables
5. 修改变量
6. Deployments
7. 选择最新部署
8. Redeploy

建议选择不要使用旧缓存，或使用 Redeploy with cleared cache。

## Git 注意事项

不要提交：

- `.env.local`
- `.next/`
- `node_modules/`

`.gitignore` 应该已经忽略这些。

如果 push 失败，之前遇到过 GitHub 443 / TLS / 代理问题。解决方向：

- 检查代理端口
- 用 `git ls-remote` 测试连接
- 确保 GitHub 可访问
- 不要乱改 remote

## 已知问题 / 后续可继续优化

### 1. Blob 上传

如果仍然上传失败，优先检查：

- Blob Store 是否是 Public
- Vercel 项目是否绑定了正确 Blob Store
- Vercel 里的 `BLOB_READ_WRITE_TOKEN` 是否来自新的 Public Store
- 修改环境变量后是否重新部署
- 本地 `.env.local` 是否也更新了同一个 token

### 2. 项目 metrics 编辑

项目详情页的指标卡片来自结构化 JSON，不在 Markdown 正文里。

如果想在编辑页面里改这些指标，需要给 `ProjectManager` 增加：

- metrics 添加
- metrics 删除
- label/value/note 编辑
- 保存到 `projects.content`

### 3. 中英文切换未覆盖所有静态文案

如果英文模式仍有中文标题，需要继续检查：

- `app/projects/page.tsx`
- `app/projects/[slug]/page.tsx`
- `app/life/page.tsx`
- `app/life/moments/page.tsx`
- `app/life/todo/page.tsx`
- `app/life/reading/page.tsx`
- `app/blog/page.tsx`
- `components/content/*.tsx`

给静态文案补 `data-zh` / `data-en`。

数据库内容暂时可以不翻译。

### 4. 项目数据来源

线上项目内容如果来自数据库，改本地 `lib/project-data.ts` 不会自动覆盖线上已有数据。

解决方式：

- 用项目管理功能编辑数据库内容
- 或写一次 migration/update SQL
- 或清空相关表后重新 seed，注意这会影响已有编辑内容

## 新对话建议起手问题

新开对话后可以这样说：

```text
请先阅读项目根目录的 CONTEXT_HANDOFF.md，并检查当前 git 状态。接下来我想继续修复/优化……
```

如果要继续修 Blob：

```text
请基于 CONTEXT_HANDOFF.md，继续排查 Vercel Blob 上传失败问题。
```

如果要继续修英文切换：

```text
请基于 CONTEXT_HANDOFF.md，全面扫描 app 和 components 里的静态中文文案，补齐 data-zh/data-en，不要动数据库内容。
```

如果要继续做项目 metrics 编辑器：

```text
请基于 CONTEXT_HANDOFF.md，为项目编辑页面增加 metrics 指标卡片的可视化编辑功能。
```

## 最后提醒

- 不要泄露 `.env.local`。
- 不要粗暴删除旧 HTML 文件，除非确认不再需要。
- 改功能前先读现有代码，不要重写项目。
- 写操作接口必须保留管理员校验。
- 图片不要存进 Postgres 二进制字段，只存 URL。
- 保持当前网站风格：极简、文艺、留白多、克制、柔和。
