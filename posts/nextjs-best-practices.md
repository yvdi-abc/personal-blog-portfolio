---
title: "Next.js 15 最佳实践"
date: "2026-07-28"
description: "构建高性能 Next.js 应用的实用技巧和最佳实践"
cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop"
tags: ["Next.js", "性能优化", "最佳实践"]
---

## Next.js 15 最佳实践指南

作为最流行的 React 框架，Next.js 15 带来了许多强大的特性。

### 1. App Router 架构

使用新的 App Router 可以获得更好的性能：

```typescript
// app/blog/[slug]/page.tsx
export default async function BlogPost({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  return <article>{post.content}</article>;
}
```

### 2. 服务端组件优先

**默认使用服务端组件**可以减少客户端 JavaScript：

```tsx
// 服务端组件 (默认)
async function BlogList() {
  const posts = await fetchPosts();
  
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

只在需要交互时才使用客户端组件：

```tsx
'use client';

import { useState } from 'react';

export function SearchBar() {
  const [query, setQuery] = useState('');
  
  return (
    <input 
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
```

### 3. 图片优化

使用 `next/image` 自动优化图片：

```tsx
import Image from 'next/image';

export function Avatar() {
  return (
    <Image
      src="/avatar.jpg"
      alt="Avatar"
      width={200}
      height={200}
      priority
    />
  );
}
```

### 4. 数据获取策略

**静态生成（SSG）**：

```typescript
export async function generateStaticParams() {
  const posts = await getPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

**动态渲染（SSR）**：

```typescript
export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### 5. 性能优化清单

- ✅ 使用 Server Components 减少 bundle 大小
- ✅ 使用 `generateStaticParams` 预渲染页面
- ✅ 启用图片优化
- ✅ 使用 Suspense 和流式渲染
- ✅ 代码分割和懒加载
- ✅ 使用 Metadata API 优化 SEO

### 6. 环境变量管理

```bash
# .env.local
DATABASE_URL=postgresql://...
NEXT_PUBLIC_API_URL=https://api.example.com
```

```typescript
// 仅服务端可用
const dbUrl = process.env.DATABASE_URL;

// 客户端和服务端都可用
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### 性能基准测试

| 指标 | 优化前 | 优化后 |
|------|--------|--------|
| FCP | 2.1s | 0.8s |
| LCP | 3.5s | 1.2s |
| TTI | 4.2s | 1.8s |
| Bundle Size | 250KB | 120KB |

### 总结

遵循这些最佳实践，你可以构建：

1. ⚡ **极速加载**的应用
2. 🎯 **SEO 友好**的网站
3. 💰 **成本优化**的架构

> 性能不是奢侈品，而是必需品。

---

**延伸阅读：**

- [Next.js 文档](https://nextjs.org/docs)
- [Web.dev 性能指南](https://web.dev/performance)
