"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import siteConfig from '@/siteConfig';

export default function Comments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    // 简化版评论组件 - 暂不实现Gitalk
    const placeholder = document.createElement('div');
    placeholder.className = 'text-center py-8 text-slate-500 dark:text-slate-400';
    placeholder.innerHTML = '<p>评论功能暂未配置</p>';
    containerRef.current.appendChild(placeholder);
  }, [pathname]);

  return (
    <div className="w-full mt-16 relative">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl rounded-full pointer-events-none z-0"></div>
      <div ref={containerRef} className="relative z-10 pt-6 border-t border-slate-200/50 dark:border-slate-700/50" />
    </div>
  );
}
