"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useMusic } from "./MusicProvider";
import { useEffect, useRef } from "react";

interface LyricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LyricsModal({ isOpen, onClose }: LyricsModalProps) {
  const { currentSong, currentTime, currentLyric } = useMusic();
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  // 自动滚动到当前歌词
  useEffect(() => {
    if (isOpen && lyricsContainerRef.current) {
      const activeElement = lyricsContainerRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTime, isOpen]);

  if (!currentSong) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* 歌词弹窗 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[80vh] z-50"
          >
            <div className="glass rounded-3xl border border-slate-700/50 shadow-2xl h-full flex flex-col overflow-hidden">
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">{currentSong.title}</h2>
                    <p className="text-slate-400 text-sm">{currentSong.artist}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full glass border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 歌词内容 */}
              <div ref={lyricsContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                {currentSong.lyrics.length > 0 ? (
                  currentSong.lyrics.map((lyric, index) => {
                    const isActive = currentTime >= lyric.time &&
                      (index === currentSong.lyrics.length - 1 || currentTime < currentSong.lyrics[index + 1].time);

                    return (
                      <motion.div
                        key={index}
                        data-active={isActive}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={`transition-all duration-500 ${
                          isActive
                            ? "text-white text-2xl font-bold scale-105"
                            : "text-slate-500 text-lg"
                        }`}
                      >
                        {lyric.text}
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <p className="text-lg">♪ 纯音乐，请欣赏 ♪</p>
                  </div>
                )}
              </div>

              {/* 底部装饰 */}
              <div className="p-4 border-t border-slate-700/50">
                <div className="flex items-center justify-center gap-1">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-purple-500/30 rounded-full"
                      animate={{
                        height: [4, 12, 4],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.05,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
