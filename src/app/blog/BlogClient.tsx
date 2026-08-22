'use client';
import { motion } from "framer-motion";
import { BlogCard } from "@/components/Cards";
import { useEffect, useState } from "react";
import { Search, Tag, Calendar, TrendingUp } from "lucide-react";
import type { Post } from "@/lib/posts";

export default function BlogClient({ posts }: { posts: Post[] }) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('全部');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  // 获取所有标签
  const allTags = ['全部', ...Array.from(new Set(posts.flatMap(p => p.tags)))];

  useEffect(() => {
    let result = [...posts];

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
  }, [posts, selectedTag, searchTerm, sortBy]);

  return (
    <div className="min-h-screen w-[90%] max-w-6xl mx-auto mt-24 md:mt-28 px-4 relative z-10 pb-32">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3">
          技术博客
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
          记录技术探索，分享实践经验 · {posts.length} 篇文章
        </p>
      </motion.div>

      {/* 搜索和过滤栏 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
        transition={{ delay: 0.2 }}
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
