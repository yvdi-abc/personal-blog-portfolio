"use client";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import ProfileCard from "@/components/ProfileCard";
import CloudPlayer from "@/components/CloudPlayer";
import LyricBar from "@/components/LyricBar";
import LatestPostsCarousel from "@/components/LatestPostsCarousel";
import LatestChatterCarousel from "@/components/LatestChatterCarousel";
import PhotoWallPreview from "@/components/PhotoWallPreview";
import ThemeToggleBlock from "@/components/ThemeToggleBlock";
import SiteDashboard from "@/components/SiteDashboard";
import WeatherWidget from "@/components/WeatherWidget";
import WebcamModeBlock from "@/components/WebcamModeBlock";
import ProjectsBlock from "@/components/ProjectsBlock";
import FriendsBlock from "@/components/FriendsBlock";
import TimelineBlock from "@/components/TimelineBlock";
import ContactBlock from "@/components/ContactBlock";
import { projectsData } from "@/data";

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

export default function Home() {
  const [allPosts] = useState<Post[]>(POSTS_DATA);
  const top5Posts = allPosts.slice(0, 5);
  const chatterCount = 12;
  const realPhotoCount = 50; // 更新为实际照片数量

  return (
    <div className="min-h-screen relative pb-32">
      <div className="w-full max-w-6xl mx-auto mt-24 sm:mt-28 px-4 sm:px-6 lg:px-10 relative z-10">
        <SearchBar posts={allPosts} />

        <div className="flex flex-col gap-4 w-full mt-6">

          {/* 第一行：个人信息 + 播放器 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
            <div className="col-span-1 lg:col-span-7">
              <ProfileCard postCount={allPosts.length} chatterCount={chatterCount} photoCount={realPhotoCount} />
            </div>
            <div className="col-span-1 lg:col-span-5">
              <CloudPlayer />
            </div>
          </div>

          {/* 歌词栏 */}
          <div className="w-full">
            <LyricBar />
          </div>

          {/* 主内容区：照片墙 + 三个小组件（天气、日夜、背景）*/}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
            {/* 左侧：大照片墙 */}
            <div className="col-span-1 lg:col-span-6">
              <PhotoWallPreview />
            </div>

            {/* 右侧：三个功能小组件 */}
            <div className="col-span-1 lg:col-span-6 grid grid-cols-3 gap-4">
              <ThemeToggleBlock />
              <WebcamModeBlock />
              <WeatherWidget />
            </div>
          </div>

          {/* 文章和说说（左）+ 四个带图小组件（右）*/}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
            {/* 左侧：文章和说说 */}
            <div className="col-span-1 lg:col-span-6 grid grid-cols-2 gap-4">
              <LatestPostsCarousel posts={top5Posts} />
              <LatestChatterCarousel />
            </div>

            {/* 右侧：四个带图的小组件 */}
            <div className="col-span-1 lg:col-span-6 grid grid-cols-2 gap-4">
              <ProjectsBlock />
              <FriendsBlock />
              <TimelineBlock />
              <ContactBlock />
            </div>
          </div>

          {/* 站点仪表盘 */}
          <div className="w-full">
            <SiteDashboard />
          </div>

        </div>
      </div>
    </div>
  );
}
