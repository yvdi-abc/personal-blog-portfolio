'use client';
import { motion } from "framer-motion";
import { BlogCard, SectionTitle } from "@/components/Cards";
import { useEffect, useState } from "react";
import { Search, Tag, Calendar, TrendingUp } from "lucide-react";

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  cover: string;
}

// 临时硬编码数据，直到 API 路由问题解决
const POSTS_DATA: Post[] = [
  {
    slug: 'welcome',
    title: '欢迎来到我的博客',
    description: '这是第一篇博客文章，介绍博客的功能和特色',
    date: '2026-07-30',
    tags: ['博客', '介绍', '欢迎'],
    cover: '/personal-blog-portfolio/bg/bg1.jpg'
  },
  {
    slug: 'react-19-features',
    title: 'React 19 新特性解析',
    description: '深入探讨 React 19 带来的革命性新特性',
    date: '2026-07-29',
    tags: ['React', '前端', '技术'],
    cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop'
  },
  {
    slug: 'nextjs-best-practices',
    title: 'Next.js 15 最佳实践',
    description: '构建高性能 Next.js 应用的实用技巧和最佳实践',
    date: '2026-07-28',
    tags: ['Next.js', '性能优化', '最佳实践'],
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop'
  },
  {
    slug: 'typescript-tips',
    title: 'TypeScript 高级技巧',
    description: '提升 TypeScript 开发效率的实用技巧和模式',
    date: '2026-07-25',
    tags: ['TypeScript', '前端', '技术'],
    cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=600&fit=crop'
  },
  {
    slug: 'web-performance',
    title: 'Web 性能优化指南',
    description: '全面的前端性能优化策略和实践',
    date: '2026-07-20',
    tags: ['性能优化', '前端', '最佳实践'],
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop'
  },
];

export default function Blog() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('全部');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  // 获取所有标签
  const allTags = ['全部', ...Array.from(new Set(POSTS_DATA.flatMap(p => p.tags)))];

  useEffect(() => {
    setAllPosts(POSTS_DATA);
    setFilteredPosts(POSTS_DATA);
    setLoading(false);
  }, []);

  useEffect(() => {
    let result = [...allPosts];

    // 按标签过滤
    if (selectedTag !== '全部') {
      result = result.filter(post => post.tags.includes(selectedTag));
    }

    // 按搜索词过滤
    if (searchTerm) {
      result = result.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 排序
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return a.title.localeCompare(b.title, 'zh-CN');
      }
    });

    setFilteredPosts(result);
  }, [allPosts, selectedTag, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-[90%] max-w-6xl mx-auto mt-24 md:mt-28 px-4 relative z-10 pb-32">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3">
          技术博客
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
          记录技术探索，分享实践经验 · {allPosts.length} 篇文章
        </p>
      </motion.div>

      {/* 搜索和过滤栏 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="mb-8 space-y-4"
      >
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索文章标题或内容..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl glass border-none outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* 标签过滤 */}
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  selectedTag === tag
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                    : 'glass text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
                }`}
              >
                {tag === '全部' ? <Tag className="w-4 h-4 inline mr-1" /> : null}
                {tag}
              </button>
            ))}
          </div>

          {/* 排序选项 */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('date')}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                sortBy === 'date'
                  ? 'bg-purple-500 text-white'
                  : 'glass text-slate-700 dark:text-slate-300'
              }`}
            >
              <Calendar className="w-4 h-4" />
              最新
            </button>
            <button
              onClick={() => setSortBy('title')}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                sortBy === 'title'
                  ? 'bg-purple-500 text-white'
                  : 'glass text-slate-700 dark:text-slate-300'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              标题
            </button>
          </div>
        </div>
      </motion.div>

      {/* 文章列表 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {filteredPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((p, i) => (
              <BlogCard
                key={p.slug}
                title={p.title}
                desc={p.description}
                date={p.date}
                tag={p.tags[0] || '未分类'}
                slug={p.slug}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-3xl">
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-200/50 dark:bg-slate-700/50 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
              未找到相关文章
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              试试其他关键词或标签
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
