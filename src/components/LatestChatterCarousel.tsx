// components/LatestChatterCarousel.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Chatter {
  slug: string;
  title: string;
  description: string;
  cover?: string;
  date?: string;
}

const DEFAULT_CHATTERS: Chatter[] = [
  {
    slug: '1',
    title: '今天天气真好',
    description: '适合写代码，适合思考人生 ☀️',
    cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    date: '2026-07-31',
  },
  {
    slug: '2',
    title: '解决了一个困扰三天的bug',
    description: '成就感爆棚！原来是一个小小的逻辑错误 💪',
    cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop',
    date: '2026-07-30',
  },
  {
    slug: '3',
    title: '学习新技术的过程',
    description: '总是令人着迷，每天都在进步 🚀',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
    date: '2026-07-29',
  },
];

export default function LatestChatterCarousel({ chatters }: { chatters?: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayChatters = chatters && chatters.length > 0 ? chatters : DEFAULT_CHATTERS;

  useEffect(() => {
    if (displayChatters.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayChatters.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displayChatters.length]);

  if (!displayChatters || displayChatters.length === 0) return null;

  const currentChatter = displayChatters[currentIndex];

  const holoVariants = {
    initial: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 1.05, filter: "blur(10px)" },
  };

  return (
    <div className="w-full h-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden relative group min-h-[220px] flex flex-col">
      <Link href={currentChatter.slug === 'none' ? '/moments' : `/moments`} className="absolute inset-0 z-20" aria-label={`查看杂谈: ${currentChatter.title}`} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentChatter.slug}
          variants={holoVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <img src={currentChatter.cover} className="w-full h-full object-cover opacity-80 dark:opacity-60 transition-transform duration-1000 group-hover:scale-105" alt="Chatter Cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10"></div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex flex-col justify-center p-6 md:p-8 h-full pointer-events-none w-full md:w-[85%]">
        <div className="flex items-end gap-2 mb-2">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10 shadow-sm">
            Records
          </span>
          {currentChatter.date && (
            <span className="text-[11px] font-mono text-slate-300 drop-shadow-md">
              {currentChatter.date}
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors line-clamp-1 drop-shadow-md">
          {currentChatter.title}
        </h3>
        <p className="text-sm text-slate-300 font-medium leading-relaxed drop-shadow-md line-clamp-2">
          {currentChatter.description}
        </p>
      </div>

      {displayChatters.length > 1 && (
        <div className="absolute bottom-5 right-6 z-30 flex gap-2">
          {displayChatters.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
              className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${i === currentIndex ? 'w-6 bg-indigo-400' : 'w-2 bg-white/40 hover:bg-white/80'}`}
              aria-label={`跳转`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
