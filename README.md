# 🌐 个人博客全栈项目

基于 **Next.js 15** + **TypeScript** + **React 19** 构建的现代化个人博客网站，支持**在线管理后台**、**GitHub API 集成**、**自动部署**等功能。

[![Next.js](https://img.shields.io/badge/Next.js-15.5.22-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## ✨ 核心特性

### 🎨 前台展示
- **首页** - 个人信息、动态弹幕背景、音乐播放器、网站仪表盘
- **博客系统** - Markdown 文章、语法高亮、数学公式、目录导航
- **碎语动态** - 短内容发布、时间线展示
- **项目展示** - 个人项目、技术标签、GitHub 链接
- **照片墙** - 相册管理、瀑布流布局、灯箱查看
- **友情链接** - 友链管理
- **AI 助手** - 集成 Gemini API 的智能对话

### 🛠️ 管理后台（核心亮点）
- ✅ **在线编辑** - 网站配置、文章、碎语、项目、友链、相册
- ✅ **图片上传** - 支持拖拽上传
- ✅ **实时生效** - 本地开发修改即刻生效
- ✅ **GitHub 集成** - 生产环境自动提交到仓库并触发部署
- ✅ **双模式支持** - 自动适配本地/生产环境
- ✅ **类型安全** - 完整的 TypeScript 类型定义

### 🚀 技术亮点
- **完整类型系统** - 所有配置和数据都有 TypeScript 类型定义
- **统一文件管理** - 自动适配本地文件系统和 GitHub API
- **错误处理** - 完善的 API 错误处理和用户提示
- **响应式设计** - 适配桌面端和移动端
- **暗黑模式** - 自动跟随系统主题
- **动画效果** - Framer Motion 流畅动画

## 📦 技术栈

| 分类 | 技术 | 版本 |
|------|------|------|
| **框架** | Next.js | 15.5.22 |
| | React | 19.0 |
| | TypeScript | 5.x |
| **样式** | Tailwind CSS | 3.x |
| **动画** | Framer Motion | - |
| **Markdown** | React Markdown | - |
| | Remark GFM | - |
| **代码高亮** | Highlight.js | - |
| **数学公式** | KaTeX | - |
| **API** | Gemini AI | 2.0 |
| | 网易云音乐 | - |

## 🚀 快速开始

### 环境要求
- Node.js **18.x** 或更高版本
- npm 或 yarn
- Git

### 本地开发

#### 1. 克隆项目
```bash
git clone https://github.com/yvdi-abc/personal-blog-portfolio.git
cd personal-blog-portfolio
```

#### 2. 安装依赖
```bash
# 如果有代理问题，清除代理变量
HTTP_PROXY= HTTPS_PROXY= npm install

# 或使用快速启动脚本
bash dev.sh
```

#### 3. 启动开发服务器
```bash
npm run dev
```

#### 4. 访问应用
- **前台**：http://localhost:3000
- **管理后台**：http://localhost:3000/admin
- **默认密码**：`admin123`

> 💡 **修改密码**：编辑 `src/app/api/admin/login/route.ts`

## 🎯 管理后台使用

### 功能模块

| 模块 | 功能 | 说明 |
|------|------|------|
| **网站设置** | 标题、简介、社交链接、音乐、弹幕 | 保存后需重启生效 |
| **博客文章** | 创建、编辑、删除文章 | Markdown 编辑器 |
| **碎语** | 发布短动态 | 时间线展示 |
| **项目** | 管理项目列表 | 支持标签和链接 |
| **相册** | 管理照片墙 | 多相册支持 |
| **友链** | 管理友情链接 | 头像、描述、链接 |

### 本地开发流程

1. 访问 http://localhost:3000/admin
2. 登录管理后台
3. 修改内容并保存
4. **网站设置修改后需重启服务器**
5. 其他内容修改立即生效

### 生产环境流程

1. 访问 https://你的域名/admin
2. 登录管理后台
3. 修改内容并保存
4. **自动提交到 GitHub 并触发 Vercel 部署（1-2分钟）**

## 🌐 部署到生产环境

详细部署指南请查看 **[DEPLOY.md](./DEPLOY.md)**

### 快速部署步骤

#### 1. 部署到 Vercel
1. 访问 [Vercel](https://vercel.com)
2. 导入 GitHub 仓库
3. 一键部署

#### 2. 配置 GitHub API（必需）

为了让管理后台能在线修改内容，需要配置 GitHub API：

##### 创建 GitHub Token
1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 勾选 **repo**（完整仓库权限）
4. 生成并复制 Token（`ghp_xxxxx`）

##### 在 Vercel 添加环境变量
进入 Vercel 项目 → Settings → Environment Variables：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `GITHUB_OWNER` | `yvdi-abc` | GitHub 用户名 |
| `GITHUB_REPO` | `personal-blog-portfolio` | 仓库名 |
| `GITHUB_TOKEN` | `ghp_xxxxx` | 刚才创建的 Token |
| `GITHUB_BRANCH` | `main` | 分支名 |

##### 重新部署
在 Vercel 点击 **Redeploy** 使环境变量生效。

#### 3. 完成！
现在在管理后台的修改会自动提交到 GitHub 并触发部署。

## 📁 项目结构

```
personal-blog-portfolio/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── api/                    # API 路由
│   │   │   ├── admin/             # 🔐 管理后台 API
│   │   │   │   ├── site-settings/ # 网站配置
│   │   │   │   ├── posts/        # 文章管理
│   │   │   │   ├── chatters/     # 碎语管理
│   │   │   │   ├── projects/     # 项目管理
│   │   │   │   ├── albums/       # 相册管理
│   │   │   │   ├── friends/      # 友链管理
│   │   │   │   ├── login/        # 登录认证
│   │   │   │   └── upload/       # 图片上传
│   │   │   ├── chat/             # AI 对话
│   │   │   └── music/            # 音乐 API
│   │   ├── admin/                 # 🎨 管理后台页面
│   │   ├── blog/                  # 博客页面
│   │   ├── chatters/              # 碎语页面
│   │   ├── friends/               # 友链页面
│   │   ├── gallery/               # 相册页面
│   │   ├── projects/              # 项目页面
│   │   └── layout.tsx             # 根布局
│   ├── components/                # React 组件
│   │   ├── admin/                # 🛠️ 管理后台组件
│   │   │   ├── PostsManager.tsx
│   │   │   ├── ChattersManager.tsx
│   │   │   ├── ProjectsManager.tsx
│   │   │   ├── AlbumsManager.tsx
│   │   │   ├── FriendsManager.tsx
│   │   │   └── SiteSettingsManager.tsx
│   │   ├── BackgroundSlider.tsx   # 背景轮播
│   │   ├── CloudPlayer.tsx        # 音乐播放器
│   │   ├── DanmakuBackground.tsx  # 弹幕背景
│   │   ├── Navbar.tsx             # 导航栏
│   │   └── ...                    # 更多组件
│   ├── lib/                       # 🔧 工具函数
│   │   ├── api-utils.ts          # API 工具（认证、验证、错误处理）
│   │   ├── file-manager.ts       # 文件管理（自动适配本地/GitHub）
│   │   └── github.ts             # GitHub API 客户端
│   ├── types/                     # 📝 TypeScript 类型
│   │   └── siteConfig.ts         # 配置类型定义
│   ├── data/                      # 📊 数据文件
│   │   ├── index.ts              # 项目数据
│   │   ├── albums.ts             # 相册数据
│   │   ├── posts.json            # 文章数据
│   │   ├── chatters.json         # 碎语数据
│   │   └── friends.json          # 友链数据
│   └── siteConfig.ts              # ⚙️ 网站配置（核心）
├── public/                        # 静态资源
├── posts/                         # Markdown 文章
├── DEPLOY.md                      # 📖 部署指南
├── README.md                      # 本文件
└── package.json
```

## ⚙️ 配置说明

### 网站配置 (src/siteConfig.ts)

```typescript
export const siteConfig: SiteConfig = {
  // 基本信息
  title: "Yvdiの小窝",
  author: { name: "Yvdi" },
  navTitle: "Yvdiの小窝",
  bio: "在校大学生|喜欢做一些小东西",
  avatarUrl: "/avatar.jpg",
  
  // 社交链接
  social: {
    email: "your@email.com",
    github: "https://github.com/username",
  },
  
  // 音乐播放器（网易云音乐ID）
  musicIds: ["1809646618", "2755332551", ...],
  
  // 弹幕内容
  danmakuList: ["欢迎来到我的小站~", "今天学习了吗？", ...],
  
  // ICP 备案
  icpConfig: {
    name: "萌ICP备20260249号",
    link: "https://icp.gov.moe/?keyword=20260249"
  },
  
  // AI 配置（可选）
  geminiConfig: {
    modelId: "gemini-2.0-flash-exp",
    systemPrompt: "你是一个友好的AI助手...",
    maxOutputTokens: 1000,
    temperature: 0.7
  },
  
  // Gitalk 评论（可选）
  gitalkConfig: {
    clientID: "",
    clientSecret: "",
    repo: "",
    owner: "",
    admin: []
  },
  
  // 默认文章封面
  defaultPostCover: "https://images.unsplash.com/...",
  
  // 页脚技术栈徽章
  footerBadges: [
    { name: "Next.js", color: "text-slate-900", svg: "..." },
    { name: "React", color: "text-cyan-500", svg: "..." },
    // ...
  ]
};
```

## 🔐 安全建议

1. **修改默认密码** - 编辑 `src/app/api/admin/login/route.ts`
2. **保护 Token** - 不要将 GitHub Token 提交到代码仓库
3. **环境变量** - 使用 Vercel 环境变量管理敏感信息
4. **Token 过期** - 定期更换 GitHub Token

## 📝 常见问题

<details>
<summary><strong>Q: npm 安装失败，提示代理错误？</strong></summary>

**A**: 清除代理环境变量：
```bash
HTTP_PROXY= HTTPS_PROXY= npm install
```
或使用快速启动脚本：`bash dev.sh`
</details>

<details>
<summary><strong>Q: 如何修改管理员密码？</strong></summary>

**A**: 编辑 `src/app/api/admin/login/route.ts`，修改密码验证逻辑。
</details>

<details>
<summary><strong>Q: 线上修改不生效怎么办？</strong></summary>

**A**: 检查：
1. Vercel 环境变量是否正确配置
2. GitHub Token 是否有 `repo` 权限
3. 查看 Vercel 部署日志是否有错误
</details>

<details>
<summary><strong>Q: 如何添加新的博客文章？</strong></summary>

**A**: 两种方式：
1. 通过管理后台在线创建（推荐）
2. 直接编辑 `src/data/posts.json` 或在 `posts/` 目录添加 `.md` 文件
</details>

<details>
<summary><strong>Q: 如何自定义样式？</strong></summary>

**A**: 所有组件使用 Tailwind CSS，直接修改组件中的 `className`。
</details>

<details>
<summary><strong>Q: 如何更换音乐？</strong></summary>

**A**: 
1. 打开网易云音乐网页版
2. 复制歌曲 URL 中的数字 ID
3. 在管理后台 → 网站设置 → 音乐播放列表中添加
</details>

## 🎨 自定义主题

编辑 `tailwind.config.ts` 自定义颜色、字体等：

```typescript
export default {
  theme: {
    extend: {
      colors: {
        // 自定义颜色
      },
      fontFamily: {
        // 自定义字体
      },
    },
  },
}
```

## 📊 数据管理

### 数据持久化方式

| 环境 | 方式 | 说明 |
|------|------|------|
| **本地开发** | 直接文件修改 | 修改 JSON/TS 文件 |
| **生产环境** | GitHub API | 自动提交并触发部署 |

### 数据文件

- `src/siteConfig.ts` - 网站配置
- `src/data/posts.json` - 博客文章
- `src/data/chatters.json` - 碎语
- `src/data/index.ts` - 项目数据
- `src/data/albums.ts` - 相册数据
- `src/data/friends.json` - 友链数据

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📜 致谢

本项目基于 [XinghuisamaBlogs](https://github.com/Xinghuisama/XinghuisamaBlogs) 复刻并大幅扩展，感谢原作者的优秀设计。

## 📄 许可证

MIT License

## 📞 联系方式

- **Email**: 3625607718@qq.com
- **GitHub**: [@yvdi-abc](https://github.com/yvdi-abc)
- **网站**: https://www.20071103.xyz

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！
