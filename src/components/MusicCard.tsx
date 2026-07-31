"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useMusic } from "./MusicProvider";
import Image from "next/image";

interface MusicCardProps {
  song: {
    id: string;
    title: string;
    artist: string;
    cover: string;
    src: string;
    lyrics: { time: number; text: string }[];
  };
  index: number;
}

export default function MusicCard({ song, index }: MusicCardProps) {
  const { currentSong, togglePlay, currentIndex, playlist, nextSong, prevSong } = useMusic();
  const [isHovered, setIsHovered] = useState(false);
  const isCurrentSong = currentSong?.id === song.id;
  const songIndex = playlist.findIndex(s => s.id === song.id);

  const handlePlay = () => {
    // 如果不是当前歌曲，切换到这首歌
    if (songIndex !== -1 && currentIndex !== songIndex) {
      const diff = songIndex - currentIndex;
      if (diff > 0) {
        // 向后切换
        for (let i = 0; i < diff; i++) {
          nextSong();
        }
      } else {
        // 向前切换
        for (let i = 0; i < Math.abs(diff); i++) {
          prevSong();
        }
      }
      // 延迟后播放
      setTimeout(() => togglePlay(), 300);
    } else {
      // 当前歌曲，直接切换播放状态
      togglePlay();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      {/* 卡片容器 */}
      <div className="glass rounded-2xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
        {/* 封面区域 */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={song.cover}
            alt={song.title}
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* 悬浮遮罩 */}
          <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

          {/* 播放按钮 */}
          <motion.button
            onClick={handlePlay}
            initial={false}
            animate={{
              scale: isHovered ? 1 : 0.8,
              opacity: isHovered ? 1 : 0,
            }}
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50 transition-colors"
          >
            {isCurrentSong ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </motion.button>

          {/* 当前播放标识 */}
          {isCurrentSong && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-3 left-3 px-3 py-1 rounded-full bg-purple-500/90 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              正在播放
            </motion.div>
          )}
        </div>

        {/* 信息区域 */}
        <div className="p-4">
          <h3 className="text-white font-bold text-base mb-1 line-clamp-1 group-hover:text-purple-400 transition-colors">
            {song.title}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-1">
            {song.artist}
          </p>

          {/* 标签 */}
          <div className="mt-3 flex gap-2 flex-wrap">
            {song.lyrics.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs">
                有歌词
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-slate-700/30 border border-slate-600/30 text-slate-400 text-xs">
              二次元
            </span>
          </div>
        </div>
      </div>

      {/* 发光效果 */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 -z-10 blur-2xl bg-purple-500/20 rounded-2xl"
        />
      )}
    </motion.div>
  );
}
