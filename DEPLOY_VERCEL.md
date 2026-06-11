# 从 GitHub Pages 迁移到 Vercel

这个项目已经改造成 Next.js 项目，可以部署到 Vercel，并通过 `/admin` 添加动态、清单、书影和博客内容。

## 1. 安装 Node.js

先安装 Node.js LTS：

https://nodejs.org/

安装完成后，在 PowerShell 里检查：

```powershell
node -v
npm -v
```

如果 `npm` 能正常显示版本，之前 `npx` 找不到的问题也会一起解决。

## 2. 本地安装依赖

在项目目录执行：

```powershell
cd D:\mywebsite\Henry-Pig.github.io
npm install
```

然后启动本地开发：

```powershell
npm run dev
```

浏览器打开：

```txt
http://localhost:3000
```

后台页面：

```txt
http://localhost:3000/admin
```

## 3. 准备数据库

推荐使用 Neon Postgres 或 Supabase Postgres。

创建数据库后，复制连接字符串，通常长得像：

```txt
postgres://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

本地新建 `.env.local`：

```txt
DATABASE_URL="你的数据库连接字符串"
ADMIN_TOKEN="你自己的后台密码"
BLOB_READ_WRITE_TOKEN="Vercel Blob 的读写 Token，可选但推荐"
```

注意：不要把 `.env.local` 提交到 GitHub。

## 4. 本地测试添加内容

重新启动：

```powershell
npm run dev
```

打开 `/admin`，输入 `ADMIN_TOKEN` 对应的密码，添加一条动态。

第一次写入时，API 会自动创建这些表：

- `moments`
- `todos`
- `works`
- `blog_posts`

## 5. 安装 Vercel CLI，可选

如果你想在命令行部署：

```powershell
npm install -g vercel
vercel login
vercel
```

不过更推荐新手用 Vercel 网页导入 GitHub 仓库。

## 6. 用 Vercel 网页部署

1. 打开 https://vercel.com/
2. 用 GitHub 登录
3. 点击 `Add New...` / `Project`
4. Import 你的 GitHub 仓库
5. Framework Preset 选择 `Next.js`
6. 在 Environment Variables 添加：
   - `DATABASE_URL`
   - `ADMIN_TOKEN`
   - `BLOB_READ_WRITE_TOKEN`
7. 点击 Deploy

以后你 push 到 GitHub，Vercel 会自动重新部署。

## 7. 访问方式

部署后：

- `/` 首页
- `/about` 关于我
- `/projects` 项目
- `/life/moments` 动态
- `/life/todo` 清单
- `/life/reading` 书影
- `/blog` 博客
- `/admin` 后台添加内容

旧的 `.html` 地址已经配置了重定向，例如 `/about.html` 会跳到 `/about`。

## 8. 图片上传

动态和博客已经支持图片 URL；如果你想直接上传图片，需要在 Vercel 项目里开启 Blob：

1. 进入 Vercel 项目；
2. 打开 `Storage`；
3. 创建一个 Blob Store；
4. 按 Vercel 提示把 `BLOB_READ_WRITE_TOKEN` 添加到 Environment Variables；
5. 重新部署。

如果暂时不配置 Blob，后台表单会提示上传不可用，但你仍然可以粘贴外部图片 URL。
