# 个人博客网站

基于 Next.js 15 + React 19 + Tailwind CSS 4 构建的现代化个人博客，完整复刻自 XinghuisamaBlogs 项目。

## 技术栈

- **框架**: Next.js 15.5.22 (App Router)
- **UI库**: React 19
- **样式**: Tailwind CSS 4 (毛玻璃质感设计)
- **动画**: Framer Motion (弹性动效)
- **Markdown**: Unified + Remark + Rehype
- **语法高亮**: highlight.js (Atom One Dark 主题)
- **数学公式**: KaTeX
- **图标**: Lucide React
- **类型安全**: TypeScript

## 启动方式

### ⚠️ 重要：代理配置问题

由于系统设置了HTTP代理（127.0.0.1:7890），npm命令需要清除代理环境变量才能正常运行。

**方法1：使用提供的启动脚本（推荐）**

```bash
bash dev.sh
```

**方法2：手动启动**

```bash
# 安装依赖
HTTP_PROXY= HTTPS_PROXY= npm install

# 启动开发服务器
HTTP_PROXY= HTTPS_PROXY= npm run dev
# 浏览器打开 http://localhost:3000

# 构建生产版本
HTTP_PROXY= HTTPS_PROXY= npm run build
HTTP_PROXY= HTTPS_PROXY= npm start
```

## 功能特性

### 🎨 视觉设计
- **毛玻璃拟态**: backdrop-blur + 半透明背景 + 边框光效
- **背景图片轮播**: 多张背景图自动切换
- **粒子效果**: 点击产生彩色粒子爆发
- **光标效果**: 自定义光标跟随动画
- **弹幕背景**: 可选的弹幕流动效果
- **深色/浅色主题**: 无缝主题切换

### 📝 博客系统
- Markdown 文章渲染（支持 GFM）
- 代码语法高亮（highlight.js）
- 数学公式支持（KaTeX）
- 自动生成文章目录（TOC）
- 文章搜索功能
- 相关文章推荐

### 🎵 音乐播放器
- 网易云音乐集成
- 全局底部播放器
- 旋转专辑封面动画
- 实时歌词显示（打字机效果）
- 音频波形可视化（5色波浪）

### 📸 照片墙
- 相册/照片双层级展示
- 瀑布流布局
- 图片搜索
- 灯箱查看模式
- 悬停卡片叠加效果

### 👤 关于页面
- 个人简介 Markdown 渲染
- GitHub 风格活动热力图
- 时间线展示最近动态
- 评论系统集成位

### 🎯 其他特性
- 网站仪表盘（实时时钟、运行时长、技术栈徽章）
- 全局搜索栏
- 社交媒体链接
- ICP 备案信息
- 访客统计卡片
- 页面过渡动画（Framer Motion）

## 项目结构

```
personal web/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── about/                 # 关于页面
│   │   │   ├── page.tsx           # 服务端渲染
│   │   │   └── about.md           # Markdown 内容
│   │   ├── photowall/             # 照片墙
│   │   │   ├── page.tsx           # 服务端组件
│   │   │   └── PhotoWallClient.tsx # 客户端逻辑
│   │   ├── posts/[slug]/          # 博客文章详情
│   │   │   └── page.tsx           # 动态路由 + SSG
│   │   ├── globals.css            # 全局样式
│   │   ├── layout.tsx             # 根布局
│   │   └── page.tsx               # 首页
│   ├── components/                # React 组件
│   │   ├── AboutClient.tsx        # 关于页客户端组件
│   │   ├── BackgroundSlider.tsx   # 背景图片轮播
│   │   ├── CloudPlayer.tsx        # 网易云播放器
│   │   ├── LyricBar.tsx           # 歌词条（打字机效果）
│   │   ├── Navbar.tsx             # 导航栏
│   │   ├── SearchBar.tsx          # 搜索栏
│   │   ├── SiteDashboard.tsx      # 网站仪表盘
│   │   ├── ClientTOC.tsx          # 文章目录
│   │   └── ...                    # 更多组件
│   ├── contexts/                  # React Context
│   │   ├── MusicContext.tsx       # 音乐状态管理
│   │   └── ThemeContext.tsx       # 主题状态管理
│   ├── data/                      # 数据文件
│   │   ├── albums.ts              # 相册数据
│   │   └── index.ts               # 网站数据
│   └── siteConfig.ts              # 网站配置（重要）
├── posts/                         # Markdown 文章目录
├── public/                        # 静态资源
│   ├── avatar.jpg                 # 头像（需要自己添加）
│   └── favicon.ico                # 网站图标
├── dev.sh                         # 快速启动脚本
└── package.json
```

## 配置指南

### 网站基本信息 (src/siteConfig.ts)

```typescript
const siteConfig = {
  title: "你的名字 · 全栈开发",
  authorName: "你的名字",
  bio: "你的简介",
  avatarUrl: "/avatar.jpg",           // 头像路径（需要放在 public/）
  defaultPostCover: "封面图URL",       // 默认文章封面
  
  // 背景图片轮播
  useGradient: false,                 // true=渐变背景, false=图片轮播
  bgImages: [
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    // 添加更多背景图...
  ],
  
  // 网易云音乐歌曲ID（从网易云音乐URL中获取）
  cloudMusicIds: [
    "1809646618",   // 云月谣
    "2755332551",   // DAMIDAMI
    // 添加更多歌曲ID...
  ],
  
  // 社交链接
  social: {
    github: "https://github.com/your-username",
    email: "your-email@example.com",
  },
  
  // 主题配置
  themeColors: ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#43e97b"],
  
  // ICP备案
  icpConfig: {
    name: "萌ICP备 20260240号",
    link: "https://icp.gov.moe/?keyword=20260240"
  }
};
```

### 添加博客文章

在 `posts/` 目录下创建 `.md` 文件：

```markdown
---
title: 文章标题
date: 2026-01-01
tags: [标签1, 标签2]
cover: https://封面图片URL
excerpt: 文章摘要（可选）
---

# 文章标题

这里是文章正文，支持完整的 Markdown 语法...

## 代码高亮

\`\`\`typescript
const hello = "world";
\`\`\`

## 数学公式

行内公式：$E = mc^2$

块级公式：
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### 添加照片相册

编辑 `src/data/albums.ts`：

```typescript
export const albums: Album[] = [
  {
    id: 'summer-2026',
    title: '夏日回忆',
    description: '2026年夏天的美好瞬间',
    cover: 'https://封面图URL',
    date: '2026-07-01',
    photos: [
      {
        id: 'photo-1',
        url: 'https://图片URL',
        title: '日落',
        description: '海边的日落',
      },
      // 更多照片...
    ],
  },
  // 更多相册...
];
```

### 修改关于页面

编辑 `src/app/about/about.md`：

```markdown
---
cover: https://封面图URL
---

# 你好，世界

我是 **你的名字**，一名全栈开发工程师...

## 关于我

简介内容...

## 技术栈

- **前端**: React, Next.js, TypeScript
- **后端**: Node.js, PostgreSQL
```

## 常见问题

### Q: npm 安装失败，提示 ECONNREFUSED 127.0.0.1:7890？

**A**: 这是代理配置问题。使用以下命令清除代理后执行：

```bash
HTTP_PROXY= HTTPS_PROXY= npm install
```

或者直接使用 `bash dev.sh` 启动（脚本已自动处理）。

### Q: 如何更换音乐？

**A**: 
1. 打开网易云音乐网页版
2. 找到想要的歌曲，复制URL中的数字ID
3. 编辑 `src/siteConfig.ts` 中的 `cloudMusicIds` 数组
4. 添加歌曲ID到数组中

### Q: 如何自定义主题颜色？

**A**: 编辑 `src/siteConfig.ts` 中的 `themeColors` 数组，支持任何CSS颜色值。

### Q: 如何禁用背景特效？

**A**: 在 `src/app/layout.tsx` 中移除或注释相关特效组件：
- `<BackgroundSlider />` - 背景图片轮播
- `<ClickEffect />` - 点击粒子效果
- `<CursorEffect />` - 光标跟随效果

### Q: 开发服务器启动成功，但页面显示不正常？

**A**: 检查以下几点：
1. 确保 `public/avatar.jpg` 存在
2. 检查 `posts/` 目录下至少有一篇文章
3. 打开浏览器控制台查看错误信息

### Q: 如何部署到生产环境？

**A**: 

**Vercel 部署（推荐）:**
```bash
npm install -g vercel
HTTP_PROXY= HTTPS_PROXY= vercel
```

**自建服务器:**
```bash
HTTP_PROXY= HTTPS_PROXY= npm run build
HTTP_PROXY= HTTPS_PROXY= npm start
```

## 原项目致谢

本项目完整复刻自 [XinghuisamaBlogs](https://github.com/Xinghuisama/XinghuisamaBlogs)，感谢原作者的优秀设计和实现。

## 开发状态

✅ 所有核心功能已完成
✅ 依赖安装成功
✅ 开发服务器运行正常 (http://localhost:3000)

## 许可证

MIT License
