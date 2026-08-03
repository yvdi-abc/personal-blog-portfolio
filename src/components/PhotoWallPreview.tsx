"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { albums } from '@/data/albums';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

export default function PhotoWallPreview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 自动轮播
  useEffect(() => {
    if (albums.length <= 1 || isHovering) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % albums.length);
    }, 5000); // 5秒切换一次

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovering]);

  if (!albums || albums.length === 0) return null;

  const currentAlbum = albums[currentIndex];

  return (
    <CardContainer className="w-full min-h-[200px] sm:min-h-[220px]">
      <CardBody className="w-full h-full">
        <CardItem
          translateZ="50"
          className="w-full h-full"
        >
          <Link
            href="/photowall"
            className="w-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden transition-all duration-700 relative group min-h-[200px] sm:min-h-[220px] flex-shrink-0 block"
          >
            {/* 背景图片轮播 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAlbum.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 z-0"
              >
                <img
                  src={currentAlbum.cover}
                  alt={currentAlbum.title}
                  className="w-full h-full absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-black/30 dark:bg-black/50 group-hover:bg-black/10 transition-colors duration-500 z-10"></div>

            {/* 文字内容 */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-6 z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAlbum.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <CardItem translateZ="60" className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-pink-500/80 backdrop-blur-lg rounded-full text-[10px] text-white font-black uppercase tracking-widest shadow-lg">
                      Gallery
                    </span>
                    <span className="text-[10px] text-white/80 font-mono">
                      {currentAlbum.photos.length} 张照片
                    </span>
                  </CardItem>
                  <CardItem translateZ="80" as="h3" className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 underline decoration-pink-400">
                    {currentAlbum.title}
                  </CardItem>
                  <CardItem translateZ="70" as="p" className="text-white/90 text-sm sm:text-lg line-clamp-1">
                    {currentAlbum.description}
                  </CardItem>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 导航指示点 */}
            {albums.length > 1 && (
              <CardItem translateZ="90" className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex gap-2">
                {albums.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentIndex(i);
                    }}
                    onMouseEnter={() => {
                      setIsHovering(true);
                      setCurrentIndex(i);
                    }}
                    onMouseLeave={() => {
                      setIsHovering(false);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === currentIndex ? 'w-6 bg-pink-400' : 'w-2 bg-white/40 hover:bg-white/80'
                    }`}
                    aria-label={`切换到相册 ${albums[i].title}`}
                  />
                ))}
              </CardItem>
            )}
          </Link>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
