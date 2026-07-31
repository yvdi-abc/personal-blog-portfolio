"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMusic } from "@/components/MusicProvider";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, VolumeX, Search, X } from "lucide-react";

export default function MusicPage() {
  const {
    playlist,
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    togglePlay,
    nextSong,
    prevSong,
    handleSeek,
    isLoading,
    playMode,
    togglePlayMode,
    volume,
    setVolume,
    isMuted,
    toggleMute,
  } = useMusic();

  const [activeTab, setActiveTab] = useState<"lyrics" | "playlist">("lyrics");
  const [searchQuery, setSearchQuery] = useState("");
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const lyricContainerRef = useRef<HTMLDivElement>(null);
  const activeLyricRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const activeLyricIndex = useMemo(() => {
    if (!currentSong?.lyrics || currentSong.lyrics.length === 0) return -1;
    let idx = currentSong.lyrics.findIndex((l) => l.time > currentTime) - 1;
    if (idx === -2) idx = currentSong.lyrics.length - 1;
    return Math.max(0, idx);
  }, [currentTime, currentSong?.lyrics]);

  useEffect(() => {
    if (activeLyricRef.current && lyricContainerRef.current && activeTab === "lyrics") {
      const container = lyricContainerRef.current;
      const activeItem = activeLyricRef.current;
      const scrollTarget = activeItem.offsetTop - container.offsetHeight / 2 + activeItem.offsetHeight / 2;
      container.scrollTo({ top: scrollTarget, behavior: "smooth" });
    }
  }, [activeLyricIndex, activeTab]);

  const filteredPlaylist = useMemo(() => {
    if (!searchQuery.trim()) return playlist;
    const lowerQuery = searchQuery.toLowerCase();
    return playlist.filter(
      (song) =>
        song.title.toLowerCase().includes(lowerQuery) ||
        song.artist.toLowerCase().includes(lowerQuery)
    );
  }, [playlist, searchQuery]);

  const handlePlaySong = (index: number) => {
    const diff = index - playlist.findIndex(s => s.id === currentSong?.id);
    if (diff > 0) {
      for (let i = 0; i < diff; i++) nextSong();
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) prevSong();
    }
  };

  if (isLoading || !currentSong) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">唤醒音频引擎中...</p>
        </div>
      </div>
    );
  }

  const songCover = currentSong.cover || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400";

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden pb-20">
      {/* 动态背景 */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-[-10%] bg-cover bg-center blur-[80px] opacity-20 transition-all duration-1000"
          style={{ backgroundImage: `url(${songCover})` }}
        />
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 md:pt-36 pb-10">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            云端乐律
          </h1>
          <p className="text-slate-400 text-sm tracking-wider">在代码的缝隙中寻找灵魂的共鸣</p>
        </div>

        {/* 双栏布局 */}
        <div className="grid lg:grid-cols-12 gap-8 lg:h-[600px]">
          {/* 左侧：播放控制 */}
          <div className="lg:col-span-5 glass-dark rounded-3xl p-10 flex flex-col">
            {/* 唱片 */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-64 h-64 mb-8">
                {/* 光晕效果 */}
                <div
                  className={`absolute inset-0 bg-purple-500/25 blur-3xl rounded-full transition-all duration-1000 ${
                    isPlaying ? "opacity-90 scale-110" : "opacity-20 scale-100"
                  }`}
                />
                {/* 唱片 */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-white/10 shadow-2xl overflow-hidden"
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ animationPlayState: isPlaying ? "running" : "paused" }}
                >
                  <Image
                    src={songCover}
                    alt="cover"
                    width={256}
                    height={256}
                    className="w-full h-full object-cover"
                  />
                  {/* 中心点 */}
                  <div className="absolute inset-0 m-auto w-12 h-12 bg-slate-900/90 rounded-full border border-slate-700" />
                  {/* 反光 */}
                  <div
                    className="absolute inset-0 opacity-20 rounded-full"
                    style={{
                      background:
                        "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.4), transparent, rgba(255,255,255,0.4), transparent)",
                    }}
                  />
                </motion.div>
              </div>

              {/* 歌曲信息 */}
              <h1 className="text-2xl font-black text-white truncate max-w-full px-4 text-center">
                {currentSong.title}
              </h1>
              <h2 className="text-sm text-slate-400 mt-2 truncate max-w-full px-4">
                {currentSong.artist}
              </h2>
            </div>

            {/* 控制区 */}
            <div className="mt-auto">
              {/* 进度条 */}
              <div className="mb-6">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress || 0}
                  onChange={handleSeek}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(168 85 247) ${progress}%, rgba(71, 85, 105, 0.3) 0)`,
                  }}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* 按钮 */}
              <div className="flex items-center justify-between">
                <button
                  onClick={togglePlayMode}
                  className="p-2 text-slate-400 hover:text-purple-400 transition"
                  title={playMode === 'loop' ? '列表循环' : playMode === 'single' ? '单曲循环' : '随机播放'}
                >
                  {playMode === 'loop' ? (
                    <Repeat size={20} />
                  ) : playMode === 'single' ? (
                    <Repeat size={20} className="text-purple-400" />
                  ) : (
                    <Shuffle size={20} className="text-purple-400" />
                  )}
                </button>
                <div className="flex items-center gap-4">
                  <button
                    onClick={prevSong}
                    className="p-2 text-slate-300 hover:text-white transition"
                  >
                    <SkipBack size={24} fill="currentColor" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50 transition hover:scale-105"
                  >
                    {isPlaying ? (
                      <Pause size={28} fill="white" className="text-white" />
                    ) : (
                      <Play size={28} fill="white" className="text-white ml-1" />
                    )}
                  </button>
                  <button
                    onClick={nextSong}
                    className="p-2 text-slate-300 hover:text-white transition"
                  >
                    <SkipForward size={24} fill="currentColor" />
                  </button>
                </div>
                <div className="flex items-center relative" onMouseLeave={() => setShowVolumeSlider(false)}>
                  <AnimatePresence>
                    {showVolumeSlider && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 80, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="overflow-hidden mr-2"
                      >
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => setVolume(Number(e.target.value))}
                          className="w-full h-1 appearance-none rounded-full cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, rgb(168 85 247) ${volume * 100}%, rgba(71, 85, 105, 0.3) 0)`,
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                    onDoubleClick={toggleMute}
                    className="p-2 text-slate-400 hover:text-purple-400 transition"
                  >
                    {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：歌词/歌单 */}
          <div className="lg:col-span-7 glass-dark rounded-3xl overflow-hidden flex flex-col">
            {/* Tab切换 */}
            <div className="flex items-center justify-center gap-2 p-4">
              <button
                onClick={() => setActiveTab("lyrics")}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                  activeTab === "lyrics"
                    ? "bg-purple-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                歌词
              </button>
              <button
                onClick={() => setActiveTab("playlist")}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                  activeTab === "playlist"
                    ? "bg-purple-500 text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                歌单 ({playlist.length})
              </button>
            </div>

            {/* 内容区 */}
            <div className="flex-1 relative">
              {activeTab === "lyrics" && (
                <div className="absolute inset-0 flex flex-col">
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-800/50 to-transparent z-10 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-800/50 to-transparent z-10 pointer-events-none" />
                  <div
                    ref={lyricContainerRef}
                    className="h-full overflow-y-auto px-8 scroll-smooth custom-scrollbar"
                  >
                    <div className="py-[40vh] flex flex-col gap-6 text-center">
                      {currentSong.lyrics && currentSong.lyrics.length > 0 ? (
                        currentSong.lyrics.map((line, index) => {
                          const isActive = index === activeLyricIndex;
                          return (
                            <div
                              key={index}
                              ref={isActive ? activeLyricRef : null}
                              onClick={() =>
                                duration > 0 &&
                                handleSeek({
                                  target: { value: String((line.time / duration) * 100) },
                                } as any)
                              }
                              className={`transition-all duration-700 cursor-pointer px-4 py-2 rounded-xl ${
                                isActive
                                  ? "opacity-100 scale-105 bg-white/5"
                                  : "opacity-30 hover:opacity-60"
                              }`}
                            >
                              <p
                                className={`font-black leading-relaxed transition-all duration-700 ${
                                  isActive
                                    ? "text-2xl text-purple-400"
                                    : "text-lg text-slate-300"
                                }`}
                              >
                                {line.text}
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-xl text-purple-400/50">♪ 纯音乐，请欣赏 ♪</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "playlist" && (
                <div className="absolute inset-0 px-6 py-4 flex flex-col">
                  {/* 搜索框 */}
                  <div className="relative mb-4">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="搜索音轨..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 pl-12 pr-12 bg-slate-900/60 border border-slate-700/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-700/50 rounded-full transition"
                      >
                        <X size={16} className="text-slate-400" />
                      </button>
                    )}
                  </div>

                  {/* 歌单列表 */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                    <AnimatePresence>
                      {filteredPlaylist.map((song, index) => {
                        const originalIndex = playlist.findIndex((s) => s.id === song.id);
                        const isPlayingThis = song.id === currentSong.id;
                        return (
                          <motion.div
                            key={song.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={() => handlePlaySong(originalIndex)}
                            className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                              isPlayingThis
                                ? "bg-purple-500/20 border border-purple-500/30"
                                : "hover:bg-slate-700/40"
                            }`}
                          >
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                              <Image
                                src={song.cover}
                                alt="cover"
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                              {isPlayingThis && isPlaying && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <div className="flex gap-1 items-end h-3">
                                    <span className="w-0.5 bg-white rounded-full animate-[bounce_1s_infinite_0ms] h-2" />
                                    <span className="w-0.5 bg-white rounded-full animate-[bounce_1s_infinite_200ms] h-3" />
                                    <span className="w-0.5 bg-white rounded-full animate-[bounce_1s_infinite_400ms] h-2" />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-bold truncate ${
                                  isPlayingThis ? "text-purple-400" : "text-white"
                                }`}
                              >
                                {song.title}
                              </p>
                              <p className="text-xs text-slate-400 truncate mt-0.5">{song.artist}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .glass-dark {
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </div>
  );
}
