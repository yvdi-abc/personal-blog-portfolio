"use client";
import { useState, useEffect } from 'react';
import { useMusic } from './MusicProvider';

const formatTime = (time: number) => {
  if (!time || isNaN(time)) return "00:00";
  const m = Math.floor(time / 60).toString().padStart(2, '0');
  const s = Math.floor(time % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    currentLyric,
    isLoading,
    playlist,
    currentIndex,
    togglePlay,
    nextSong,
    prevSong,
    handleSeek,
  } = useMusic();

  const [displayedLyric, setDisplayedLyric] = useState("");

  // 打字机效果
  useEffect(() => {
    let i = 0;
    setDisplayedLyric("");
    const target = currentLyric || "";
    if (!target) return;

    const typingInterval = setInterval(() => {
      if (i <= target.length) {
        setDisplayedLyric(target.slice(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentLyric]);

  if (isLoading) {
    return (
      <div className="glass rounded-3xl p-6 flex flex-col items-center justify-center min-h-[220px]">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-slate-800 dark:text-white font-bold tracking-widest animate-pulse text-sm">
          CONNECTING...
        </span>
      </div>
    );
  }

  if (!currentSong || playlist.length === 0) {
    return (
      <div className="glass rounded-3xl p-6 flex flex-col items-center justify-center min-h-[220px]">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-200/50 dark:bg-slate-700/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
        <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">暂无音乐</span>
      </div>
    );
  }

  return (
    <>
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #14b8a6;
          cursor: pointer;
          transition: transform 0.1s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.3);
        }
        @keyframes wave {
          0%, 100% { height: 4px; }
          50% { height: 28px; }
        }
        .wave-bar {
          animation: wave 1s ease-in-out infinite;
          transform-origin: bottom;
        }
      `}</style>

      {/* 主播放器 */}
      <div className="glass rounded-3xl p-6 flex flex-col justify-between transition-all duration-700 hover:scale-[1.01] relative group overflow-hidden min-h-[220px]">
        <div className={`absolute -top-20 -right-20 w-48 h-48 bg-teal-500/20 blur-[50px] rounded-full transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-30'}`}></div>

        <div className="flex items-center gap-5 relative z-10 mb-6 mt-2">
          {/* 封面 */}
          <div className={`w-20 h-20 rounded-full border-2 border-white/50 dark:border-slate-600/50 shadow-lg flex-shrink-0 overflow-hidden relative ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}`}>
            <img src={currentSong.cover} alt="cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-300 shadow-inner"></div>
          </div>

          {/* 歌曲信息 */}
          <div className="flex-col overflow-hidden w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black text-teal-600 dark:text-teal-400 tracking-widest uppercase bg-white/50 dark:bg-slate-900/50 px-2 py-0.5 rounded-sm shadow-sm">
                Cloud Music
              </span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-slate-700/50 px-2 rounded-full">
                {currentIndex + 1} / {playlist.length}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate drop-shadow-sm">
              {currentSong.title}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate drop-shadow-sm">
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* 进度条和控制 */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-bold mb-3">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-white/40 dark:bg-slate-700/50 rounded-full appearance-none outline-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #14b8a6 ${progress}%, rgba(255,255,255,0.2) ${progress}%)`
              }}
            />
            <span className="w-10">{formatTime(duration)}</span>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={prevSong}
              className="text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 bg-teal-500 dark:bg-teal-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-teal-600 dark:hover:bg-teal-700 hover:scale-110 transition-all border-2 border-white/50 dark:border-slate-600"
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={nextSong}
              className="text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 歌词显示条 */}
      <div className="mt-4 rounded-3xl bg-slate-900/80 dark:bg-slate-950/90 backdrop-blur-xl border border-white/10 shadow-2xl p-5 flex items-center justify-between transition-all duration-700 hover:shadow-teal-500/20 min-h-[80px]">
        {/* 音波动画 */}
        <div className="flex items-end justify-center gap-[4px] h-8 w-16">
          {isPlaying ? (
            <>
              <div className="w-1.5 bg-teal-400 rounded-t-sm wave-bar" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 bg-cyan-400 rounded-t-sm wave-bar" style={{ animationDelay: '200ms' }}></div>
              <div className="w-1.5 bg-teal-500 rounded-t-sm wave-bar" style={{ animationDelay: '400ms' }}></div>
              <div className="w-1.5 bg-cyan-500 rounded-t-sm wave-bar" style={{ animationDelay: '100ms' }}></div>
              <div className="w-1.5 bg-teal-300 rounded-t-sm wave-bar" style={{ animationDelay: '300ms' }}></div>
            </>
          ) : (
            <>
              <div className="w-1.5 h-1 bg-slate-600 rounded-t-sm"></div>
              <div className="w-1.5 h-1 bg-slate-600 rounded-t-sm"></div>
              <div className="w-1.5 h-1 bg-slate-600 rounded-t-sm"></div>
              <div className="w-1.5 h-1 bg-slate-600 rounded-t-sm"></div>
              <div className="w-1.5 h-1 bg-slate-600 rounded-t-sm"></div>
            </>
          )}
        </div>

        {/* 歌词文字 */}
        <div className="flex-1 px-8 flex justify-center items-center overflow-hidden">
          <p className="text-white text-lg font-bold tracking-widest truncate drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]">
            {displayedLyric}
            <span className="inline-block w-[3px] h-5 bg-teal-400 align-middle ml-1 shadow-[0_0_8px_rgba(20,184,166,0.8)] animate-pulse"></span>
          </p>
        </div>

        {/* 音乐图标 */}
        <div className="w-16 flex justify-end">
          <svg className={`w-6 h-6 text-teal-400/50 ${isPlaying ? 'animate-bounce' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
      </div>
    </>
  );
}
