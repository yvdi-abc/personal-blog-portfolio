"use client";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import ProfileCard from "@/components/ProfileCard";
import CloudPlayer from "@/components/CloudPlayer";
import LyricBar from "@/components/LyricBar";
import LatestPostsCarousel from "@/components/LatestPostsCarousel";
import LatestChatterCarousel from "@/components/LatestChatterCarousel";
import ThemeToggleBlock from "@/components/ThemeToggleBlock";
import SiteDashboard from "@/components/SiteDashboard";
import WeatherWidget from "@/components/WeatherWidget";
import { projectsData } from "@/data";
import Link from "next/link";

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
}

// 临时硬编码数据
const POSTS_DATA: Post[] = [
  {
    slug: 'welcome',
    title: '欢迎来到我的博客',
    description: '这是第一篇博客文章，介绍博客的功能和特色',
    date: '2026-07-30',
    tags: ['博客', '介绍', '欢迎']
  },
  {
    slug: 'react-19-features',
    title: 'React 19 新特性解析',
    description: '深入探讨 React 19 带来的革命性新特性',
    date: '2026-07-29',
    tags: ['React', '前端', '技术']
  },
  {
    slug: 'nextjs-best-practices',
    title: 'Next.js 15 最佳实践',
    description: '构建高性能 Next.js 应用的实用技巧和最佳实践',
    date: '2026-07-28',
    tags: ['Next.js', '性能优化', '最佳实践']
  },
  {
    slug: 'typescript-tips',
    title: 'TypeScript 高级技巧',
    description: '提升 TypeScript 开发效率的实用技巧和模式',
    date: '2026-07-25',
    tags: ['TypeScript', '前端', '技术']
  },
  {
    slug: 'web-performance',
    title: 'Web 性能优化指南',
    description: '全面的前端性能优化策略和实践',
    date: '2026-07-20',
    tags: ['性能优化', '前端', '最佳实践']
  },
];

const PHOTO_ALBUM = {
  id: 'latest',
  title: '照片墙',
  description: '记录生活中的美好瞬间',
  cover: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&h=600&fit=crop',
  date: '2026-07-30'
};

export default function Home() {
  const [allPosts] = useState<Post[]>(POSTS_DATA);
  const top5Posts = allPosts.slice(0, 5);
  const chatterCount = 12;
  const realPhotoCount = 24;

  return (
    <div className="min-h-screen relative pb-32">
      <div className="w-full max-w-6xl mx-auto mt-24 sm:mt-28 px-4 sm:px-6 lg:px-10 relative z-10">
        <SearchBar posts={allPosts} />

        <div className="flex flex-col gap-6 w-full mt-6">

          {/* 第一行：个人信息 + 播放器 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
            <div className="col-span-1 lg:col-span-7 flex flex-col">
              <ProfileCard postCount={allPosts.length} chatterCount={chatterCount} photoCount={realPhotoCount} />
            </div>
            <div className="col-span-1 lg:col-span-5 flex flex-col">
              <CloudPlayer />
            </div>
          </div>

          {/* 歌词栏 */}
          <div className="w-full mt-[-10px]">
            <LyricBar />
          </div>

          {/* 第二行：文章轮播 + 照片墙 + 说说 + 主题切换 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">

            {/* 左侧：文章轮播 (电脑端占4列) */}
            <div className="col-span-1 lg:col-span-4 flex flex-col min-h-[300px]">
              <LatestPostsCarousel posts={top5Posts} />
            </div>

            {/* 右侧：组合面板 (电脑端占8列) */}
            <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">

              {/* 照片墙大海报 */}
              <Link
                href="/photos"
                className="w-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden transition-all duration-700 hover:scale-[1.02] relative group min-h-[200px] sm:min-h-[220px] flex-shrink-0"
              >
                <img
                  src={PHOTO_ALBUM.cover}
                  alt={PHOTO_ALBUM.title}
                  className="w-full h-full absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                />
                <div className="absolute inset-0 bg-black/30 dark:bg-black/50 group-hover:bg-black/10 transition-colors duration-500"></div>
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-6">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 underline decoration-pink-400">
                    {PHOTO_ALBUM.title}
                  </h3>
                  <p className="text-white/90 text-sm sm:text-lg line-clamp-1">
                    {PHOTO_ALBUM.description}
                  </p>
                </div>
              </Link>

              {/* 底层网格：说说轮播 + 主题切换器 + 天气 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full flex-1">
                <div className="sm:col-span-2 flex flex-col min-h-[200px]">
                  <LatestChatterCarousel />
                </div>
                <div className="sm:col-span-1 flex flex-col gap-6">
                  <div className="min-h-[120px]">
                    <ThemeToggleBlock />
                  </div>
                  <div className="min-h-[140px]">
                    <WeatherWidget />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 底部数据面板 */}
          <div className="w-full mt-4">
            <SiteDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}
