"use client";
import { motion } from "framer-motion";
import { useMusic } from "./MusicProvider";
import Image from "next/image";
import { useState, useEffect } from "react";

interface GlobalMusicPlayerProps {
  onOpenLyrics: () => void;
}

export default function GlobalMusicPlayer({ onOpenLyrics }: GlobalMusicPlayerProps) {
  const {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    togglePlay,
    nextSong,
    prevSong,
    handleSeek,
  } = useMusic();

  const [volume, setVolume] = useState(80);
  const [isMinimized, setIsMinimized] = useState(false);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentSong) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: isMinimized ? 60 : 0 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      {/* 播放器主体 */}
      <div className="glass border-t border-slate-700/50 backdrop-blur-xl">
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* 左侧：歌曲信息 */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 group">
                <Image
                  src={currentSong.cover}
                  alt={currentSong.title}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-white font-bold text-sm truncate">
                  {currentSong.title}
                </div>
                <div className="text-slate-400 text-xs truncate">
                  {currentSong.artist}
                </div>
              </div>
            </div>

            {/* 中间：播放控制 */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
              {/* 控制按钮 */}
              <div className="flex items-center gap-4">
                <button
                  onClick={prevSong}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </button>

                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50 transition-all hover:scale-105"
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={nextSong}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </button>
              </div>

              {/* 进度条 */}
              <div className="w-full flex items-center gap-2 text-xs text-slate-400">
                <span className="tabular-nums">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="flex-1 h-1 rounded-full appearance-none bg-slate-700/50 cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500
                    [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all
                    hover:[&::-webkit-slider-thumb]:scale-110"
                  style={{
                    background: `linear-gradient(to right, rgb(168 85 247) ${progress}%, rgb(51 65 85 / 0.5) ${progress}%)`,
                  }}
                />
                <span className="tabular-nums">{formatTime(duration)}</span>
              </div>
            </div>

            {/* 右侧：附加控制 */}
            <div className="flex items-center gap-3 flex-1 justify-end">
              <button
                onClick={onOpenLyrics}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-purple-400 transition-colors"
                title="显示歌词"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>

              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-20 h-1 rounded-full appearance-none bg-slate-700/50 cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-400
                    [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                title={isMinimized ? "展开播放器" : "收起播放器"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMinimized ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
