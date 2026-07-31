# HANDOFF — 个人博客项目交接文档

> 最后更新: 2026-07-30
> 项目路径: `D:\xvniCpan\personal web`
> 线上地址: https://yvdi-abc.github.io/personal-blog-portfolio/
> 技术栈: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + Framer Motion 12

---

## 一、项目概况

个人博客 + 作品集展示网站。全静态导出，毛玻璃视觉风格，支持深色/浅色主题，背景图片轮换，粒子特效，自定义光标，开场 Splash 动画。

### 启动方式

```bash
cd "D:/xvniCpan/personal web"
npm install   # 首次
npm run dev   # 开发 http://localhost:3000
npm run build # 构建静态导出 (out/)
```

---

## 二、项目结构

```
D:\xvniCpan\personal web\
├── public/
│   ├── bg/               # 默认背景图 (bg1.jpg, bg2.jpg, bg3.jpg)
│   └── backgrounds/      # (已弃用)
├── src/
│   ├── app/
│   │   ├── globals.css   # 全局样式 + Tailwind + 毛玻璃 + 滚动条
│   │   ├── layout.tsx    # 根布局 (组件挂载顺序)
│   │   ├── page.tsx      # 首页 (Hero + ProfileCard + 博客 + 项目)
│   │   ├── blog/page.tsx # 博客列表
│   │   ├── projects/page.tsx
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── components/
│   │   ├── Navbar.tsx          # 导航栏 + 显示设置入口
│   │   ├── ThemeProvider.tsx   # 深色/浅色主题
│   │   ├── BackgroundSlider.tsx    # 背景图轮换
│   │   ├── BackgroundEffects.tsx   # 渐变流动 + 光晕
│   │   ├── ParticleBackground.tsx  # 粒子系统 (canvas)
│   │   ├── SplashScreen.tsx        # 开场动画
│   │   ├── PageTransition.tsx      # 页面切换动画
│   │   ├── BgSettings.tsx          # 显示设置面板
│   │   ├── CursorEffect.tsx        # 十字准星光标 + 轨迹
│   │   ├── ClickEffect.tsx         # 点击粒子爆发
│   │   ├── ProfileCard.tsx         # 个人卡片
│   │   ├── Cards.tsx               # BlogCard / ProjectCard / SectionTitle
│   │   └── Footer.tsx              # 页脚
│   ├── data/index.ts     # 项目数据
│   └── siteConfig.ts     # 站点配置
├── next.config.ts     # output: 'export'
├── postcss.config.mjs
├── tsconfig.json
├── package.json
├── .gitignore
├── .github/workflows/deploy.yml  # GitHub Pages 自动部署
└── README.md
```

---

## 三、视觉设计体系

### 配色

| 角色 | 颜色 | 用途 |
|------|------|------|
| 主色 Teal | `#14b8a6` | 导航 active、按钮、标签、滚动条 |
| 辅色 Cyan | `#06b6d4` | 渐变、光晕、辅助 |
| 暖色 Amber | `#f59e0b` | 统计数字、暖色光晕 |
| 毛玻璃 | `backdrop-blur: var(--glass-blur)` | 所有卡片面板 |

### 毛玻璃强度

通过 CSS 变量 `--glass-blur`（默认 24px）控制，用户可在显示设置面板中 0~48px 实时调节。

### 字体

系统中文字体栈：Source Han Serif SC / PingFang SC / Microsoft YaHei → serif

---

## 四、核心组件功能

### SplashScreen (`src/components/SplashScreen.tsx`)

- 首次访问时全屏展示
- 字母逐个 spring 弹入（damping:7, stiffness:90）
- 装饰形状浮动 + 圆环旋转
- 点击任意位置 → 帷幕拉起动画 → 进入主站
- `sessionStorage` 控制只显示一次

### BackgroundSlider (`src/components/BackgroundSlider.tsx`)

两种模式：
- **gradient**: 只显示渐变流动背景 (BackgroundEffects)
- **images**: 图片轮换，支持用户自定义上传

图片选择通过 `getActiveImages()` 函数过滤，取消勾选的图片不进入轮换池。
只选 1 张图时固定显示不轮换。

### ParticleBackground (`src/components/ParticleBackground.tsx`)

- Canvas 粒子系统 (100 粒子)
- 3 层辉光渲染 (核 / 3x / 6x)
- 近距粒子连线 (100px)
- 鼠标排斥交互 (150px)
- z-index: -1

### CursorEffect (`src/components/CursorEffect.tsx`)

- 十字准星: 圆环 + 十字线 + 中心点
- hover 交互元素时放大至 56px + 辉光
- 8 点鼠标轨迹 (透明度/尺寸递减)
- `cursor: none` 隐藏默认箭头
- 触屏设备自动禁用

### BgSettings (`src/components/BgSettings.tsx`)

导航栏 🎨 按钮触发右侧滑出面板，设置项：
| 控制项 | 类型 | 范围 |
|--------|------|------|
| 背景模式 | 切换按钮 | 渐变 / 图片轮换 |
| 自动轮换 | 开关 | on/off |
| 切换间隔 | 滑块 | 3~20s |
| 遮罩透明度 | 滑块 | 0~80% |
| 毛玻璃强度 | 滑块 | 0~48px |
| 图片选择 | 复选框 | 每张图独立勾选 |
| 上传图片 | 文件选择 | 自动压缩至 600px |

所有设置持久化到 `localStorage`，通过 `bg-update` 自定义事件广播。

### PageTransition (`src/components/PageTransition.tsx`)

- Framer Motion AnimatePresence
- spring 曲线切换: opacity + y + scale
- `mode="wait"` 确保旧页切完才入新页

---

## 五、数据流

```
BgSettings (修改) → localStorage.setItem → dispatchEvent('bg-update')
                                            ↓
BackgroundSlider useEffect 监听 'bg-update' → readBg() → setState
```

**注意**: 
- `BgSettingsPanel` 中 `update()` 只做 `setState`，持久化通过 `useEffect` 完成
- 事件广播用 `requestAnimationFrame` 延迟到下一帧，避免渲染中 setState

---

## 六、已知问题 / 待办

### 待实现功能
1. **博客文章详情页** — `/blog/[slug]` 页面需要实现，目前卡片点击指向 `/blog/:slug` 但路由未配置
2. **文章 Markdown 渲染** — 需要集成 `react-markdown` + 代码高亮 + 目录生成
3. **音乐播放器** — 可参考 XinghuisamaBlogs 的 CloudPlayer 实现全局播放器
4. **评论系统** — 可集成 giscus / waline 等
5. **搜索功能** — 文章搜索、标签筛选
6. **SEO 优化** — 每个页面独立的 meta/og 信息

### 已知问题
- 图片上传到 localStorage 有 5MB 限制，压缩至 600px 后约可存 3-5 张
- Next.js `output: 'export'` 模式下不支持 API routes / server components 的动态功能

---

## 七、部署

### GitHub Pages (已配置)

`.github/workflows/deploy.yml` 自动构建部署：
1. push 到 main 分支触发
2. `npm ci` → `npm run build` → `upload-pages-artifact` → `deploy-pages`
3. 静态导出在 `out/` 目录

### 手动部署

```bash
npm run build
# out/ 目录即为完整静态网站
```

---

## 八、配置参考

### siteConfig.ts (`src/siteConfig.ts`)

```typescript
const siteConfig = {
  title: "Yuxi Wang · 全栈开发",
  authorName: "Yuxi Wang",
  navTitle: "Yuxi",
  bio: "全栈开发工程师 | ...",
  themeColors: ["#14b8a6", "#06b6d4", "#0ea5e9", "#10b981", "#f59e0b"],
  social: { github: "...", email: "..." },
};
```

### next.config.ts

```typescript
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
};
```

---

## 九、开发路线 (建议)

1. 博客文章详情页 + Markdown 渲染 ← **优先级最高**
2. 文章搜索 + 标签分类
3. 图片存储从 localStorage 迁移到 IndexedDB
4. 音乐播放器组件
5. SEO 元信息完善
6. PWA 支持
