import TimelineClient from '@/components/TimelineClient';
import { siteConfig } from "@/siteConfig";

export const metadata = {
  title: "归档与探索 | " + siteConfig.title,
};

// 临时硬编码数据
const POSTS_DATA = [
  {
    slug: 'welcome',
    title: '欢迎来到我的博客',
    description: '这是第一篇博客文章，介绍博客的功能和特色',
    date: '2026-07-30',
    tags: ['博客', '介绍'],
    cover: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop'
  },
  {
    slug: 'react-19-features',
    title: 'React 19 新特性解析',
    description: '深入探讨 React 19 带来的革命性新特性',
    date: '2026-07-29',
    tags: ['React', '前端'],
    cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop'
  },
  {
    slug: 'nextjs-best-practices',
    title: 'Next.js 15 最佳实践',
    description: '构建高性能 Next.js 应用的实用技巧和最佳实践',
    date: '2026-07-28',
    tags: ['Next.js', '性能优化'],
    cover: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&h=600&fit=crop'
  },
  {
    slug: 'typescript-tips',
    title: 'TypeScript 高级技巧',
    description: '提升 TypeScript 开发效率的实用技巧和模式',
    date: '2026-07-25',
    tags: ['TypeScript', '前端'],
    cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop'
  },
  {
    slug: 'web-performance',
    title: 'Web 性能优化指南',
    description: '全面的前端性能优化策略和实践',
    date: '2026-07-20',
    tags: ['性能优化', '最佳实践'],
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
  },
  {
    slug: 'tailwind-design-system',
    title: 'Tailwind CSS 设计系统构建',
    description: '使用 Tailwind CSS 构建可维护的设计系统',
    date: '2026-07-18',
    tags: ['Tailwind', '设计系统'],
    cover: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=600&fit=crop'
  },
  {
    slug: 'git-workflow',
    title: 'Git 工作流最佳实践',
    description: '团队协作中的 Git 分支管理和代码审查流程',
    date: '2026-07-15',
    tags: ['Git', '团队协作'],
    cover: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=600&fit=crop'
  },
  {
    slug: 'docker-deployment',
    title: 'Docker 容器化部署实战',
    description: '使用 Docker 实现应用的容器化部署',
    date: '2026-07-10',
    tags: ['Docker', '部署'],
    cover: 'https://images.unsplash.com/photo-1605745341075-1e674764f49f?w=800&h=600&fit=crop'
  },
];

export default function TimelinePage() {
  // 计算标签统计
  const tagCounts: Record<string, number> = {};
  POSTS_DATA.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const tagsArray = Object.keys(tagCounts)
    .map(name => ({ name, count: tagCounts[name] }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen relative pb-32">
      <TimelineClient posts={POSTS_DATA} tags={tagsArray} />
    </div>
  );
}
