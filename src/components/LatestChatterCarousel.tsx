// components/LatestChatterCarousel.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import type { Chatter } from '@/lib/content-repository';

export default function LatestChatterCarousel({ chatters }: { chatters: Chatter[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (chatters.length <= 1 || isHovering) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % chatters.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [chatters.length, isHovering]);

  if (!chatters || chatters.length === 0) {
    return (
      <CardContainer className="w-full h-full min-h-[220px]">
        <CardBody className="w-full h-full">
          <CardItem translateZ="50" className="w-full h-full">
            <div className="w-full h-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden relative group min-h-[220px] flex flex-col items-center justify-center p-6">
              <p className="text-slate-500 dark:text-slate-400 text-sm">暂无碎语</p>
            </div>
          </CardItem>
        </CardBody>
      </CardContainer>
    );
  }

  const currentChatter = chatters[currentIndex];

  const holoVariants = {
    initial: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 1.05, filter: "blur(10px)" },
  };

  return (
    <CardContainer className="w-full h-full min-h-[220px]">
      <CardBody className="w-full h-full">
        <CardItem
          translateZ="50"
          className="w-full h-full"
        >
          <div className="w-full h-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl overflow-hidden relative group min-h-[220px] flex flex-col">
            <Link href={`/chatter/${currentChatter.slug}`} className="absolute inset-0 z-20" aria-label={`查看碎语: ${currentChatter.title}`} />

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
              <CardItem translateZ="60" className="flex items-end gap-2 mb-2">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10 shadow-sm">
                  Records
                </span>
                {currentChatter.date && (
                  <span className="text-[11px] font-mono text-slate-300 drop-shadow-md">
                    {currentChatter.date}
                  </span>
                )}
              </CardItem>

              <CardItem translateZ="80" as="h3" className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors line-clamp-1 drop-shadow-md">
                {currentChatter.title}
              </CardItem>
              <CardItem translateZ="70" as="p" className="text-sm text-slate-300 font-medium leading-relaxed drop-shadow-md line-clamp-2">
                {currentChatter.content}
              </CardItem>
            </div>

            {chatters.length > 1 && (
              <CardItem translateZ="90" className="absolute bottom-5 right-6 z-30 flex gap-2">
                {chatters.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
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
                    className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${i === currentIndex ? 'w-6 bg-indigo-400' : 'w-2 bg-white/40 hover:bg-white/80'}`}
                    aria-label={`跳转`}
                  />
                ))}
              </CardItem>
            )}
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
