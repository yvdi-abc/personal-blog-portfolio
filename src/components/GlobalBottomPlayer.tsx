"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useMusic } from "./MusicProvider";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronDown, ChevronUp, Music } from "lucide-react";

export default function GlobalBottomPlayer() {
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
    volume,
    setVolume,
    isMuted,
    toggleMute,
  } = useMusic();

  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 如果关闭了，只显示小图标
  if (isClosed) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsClosed(false)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/50 flex items-center justify-center z-50 transition-all hover:scale-110"
      >
        <Music size={24} className="text-white" />
      </motion.button>
    );
  }

  if (!currentSong) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: isMinimized ? 60 : 0 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      {/* 播放器主体 */}
      <div className="bg-slate-900/95 dark:bg-slate-900/95 border-t border-slate-700/50 backdrop-blur-xl">
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
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="flex gap-1 items-end h-4">
                      <span className="w-1 bg-white rounded-full animate-[bounce_1s_infinite_0ms] h-2" />
                      <span className="w-1 bg-white rounded-full animate-[bounce_1s_infinite_200ms] h-4" />
                      <span className="w-1 bg-white rounded-full animate-[bounce_1s_infinite_400ms] h-2" />
                    </div>
                  </div>
                )}
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
            <div className="hidden md:flex flex-col items-center gap-2 flex-1 max-w-2xl">
              {/* 控制按钮 */}
              <div className="flex items-center gap-4">
                <button
                  onClick={prevSong}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <SkipBack size={20} fill="currentColor" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50 transition-all hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause size={20} fill="white" className="text-white" />
                  ) : (
                    <Play size={20} fill="white" className="text-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={nextSong}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <SkipForward size={20} fill="currentColor" />
                </button>
              </div>

              {/* 进度条 */}
              <div className="w-full flex items-center gap-2 text-xs text-slate-400">
                <span className="tabular-nums w-10 text-right">{formatTime(currentTime)}</span>
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
                <span className="tabular-nums w-10">{formatTime(duration)}</span>
              </div>
            </div>

            {/* 右侧：附加控制 */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              <div className="hidden md:flex items-center gap-2" onMouseLeave={() => setShowVolumeSlider(false)}>
                <AnimatePresence>
                  {showVolumeSlider && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 80, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-full h-1 appearance-none rounded-full bg-slate-700/50 cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-400
                          [&::-webkit-slider-thumb]:cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, rgb(168 85 247) ${volume * 100}%, rgb(51 65 85 / 0.5) ${volume * 100}%)`,
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                  onDoubleClick={toggleMute}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              </div>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                title={isMinimized ? "展开播放器" : "收起播放器"}
              >
                {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              <button
                onClick={() => setIsClosed(true)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                title="关闭播放器"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
