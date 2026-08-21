"use client";
import { useEffect, useState } from 'react';
import { useMusic } from './MusicProvider';
import { useRouter } from 'next/navigation';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

const formatTime = (time: number) => {
  if (!time || isNaN(time)) return "00:00";
  const m = Math.floor(time / 60).toString().padStart(2, '0');
  const s = Math.floor(time % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export default function CloudPlayer() {
  const { playlist, currentSong, isPlaying, progress, currentTime, duration, currentLyric, isLoading, togglePlay, nextSong, prevSong, handleSeek, playMode, togglePlayMode } = useMusic();
  const [displayedLyric, setDisplayedLyric] = useState("");
  const router = useRouter();

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
      <div className="h-full w-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-6 flex flex-col items-center justify-center transition-colors duration-700">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-slate-800 dark:text-white font-bold tracking-widest animate-pulse text-sm">CONNECTING...</span>
      </div>
    );
  }

  if (playlist.length === 0 || !currentSong) {
    return (
      <div className="h-full w-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-6 flex flex-col items-center justify-center transition-all duration-700">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shadow-inner opacity-50">
          <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
        </div>
        <span className="text-slate-500 dark:text-slate-400 font-bold tracking-widest text-xs uppercase">No Music Available</span>
        <span className="text-[10px] text-slate-400 mt-1">请检查播放列表或网络连接</span>
      </div>
    );
  }

  const safeTogglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    togglePlay();
  };

  const safePrevSong = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    prevSong();
  };

  const safeNextSong = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    nextSong();
  };

  const safeTogglePlayMode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    togglePlayMode();
  };

  // 播放模式图标
  const getPlayModeIcon = () => {
    switch (playMode) {
      case 'single':
        // 单曲循环：带数字1的循环图标
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            <text x="12" y="15" fontSize="10" fontWeight="bold" textAnchor="middle" fill="currentColor">1</text>
          </svg>
        );
      case 'random':
        // 随机播放：交叉箭头图标
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
          </svg>
        );
      default: // loop
        // 列表循环：普通循环图标
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
          </svg>
        );
    }
  };

  // 播放模式文字
  const getPlayModeText = () => {
    switch (playMode) {
      case 'single':
        return '单曲循环';
      case 'random':
        return '随机播放';
      default:
        return '列表循环';
    }
  };

  const safeHandleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    handleSeek(e);
  };

  return (
    <>
      <style>{`
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #6366f1; cursor: pointer; transition: transform 0.1s; }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.3); }
        @keyframes safeWave { 0%, 100% { height: 4px; } 50% { height: 28px; } }
        .safe-wave { animation: safeWave 1s ease-in-out infinite; transform-origin: bottom; will-change: height; }
      `}</style>

      <CardContainer className="w-full h-full">
        <CardBody className="w-full h-full">
          <CardItem
            translateZ="50"
            className="w-full h-full"
          >
            <div
              onClick={() => router.push('/music')}
              className="h-full w-full rounded-3xl bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl p-6 flex flex-col justify-between transition-all duration-700 relative group overflow-hidden cursor-pointer"
            >
              <div className={`absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/20 blur-[50px] rounded-full transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-30'}`}></div>

              <div className="flex items-center gap-5 relative z-10 mb-6 mt-2">
                <CardItem
                  translateZ="100"
                  rotateZ="10"
                  className="w-20 h-20 rounded-full border-2 border-white/50 shadow-lg flex-shrink-0 overflow-hidden relative animate-[spin_6s_linear_infinite]"
                  style={{
                    animationPlayState: isPlaying ? 'running' : 'paused',
                    willChange: 'transform'
                  }}
                >
                  <img src={currentSong.cover} alt="cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-300 shadow-inner"></div>
                </CardItem>

                <div className="flex flex-col overflow-hidden w-full">
                  <CardItem translateZ="60" className="flex items-center mb-1 w-full">
                    <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 tracking-widest uppercase bg-white/50 dark:bg-slate-900/50 px-2 py-0.5 rounded-sm shadow-sm transition-colors duration-700">Cloud Music</span>
                  </CardItem>
                  <CardItem translateZ="80" as="h3" className="text-xl font-bold text-slate-900 dark:text-white truncate drop-shadow-sm transition-colors duration-700 w-full text-left">{currentSong.title}</CardItem>
                  <CardItem translateZ="70" as="p" className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate drop-shadow-sm transition-colors duration-700 w-full text-left">{currentSong.artist}</CardItem>
                </div>
              </div>

              <CardItem translateZ="60" className="relative z-10 mb-2 h-6 overflow-hidden">
                 <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate text-center">{displayedLyric}</p>
              </CardItem>

              <div className="relative z-10 mt-auto">
                <CardItem
                   translateZ="50"
                   className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-bold mb-3 transition-colors duration-700"
                   onClick={(e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); }}
                   onPointerDown={(e: React.PointerEvent) => { e.stopPropagation(); }}
                >
                  <span className="w-11 text-center">{formatTime(currentTime)}</span>
                  <input
                    type="range" min="0" max="100"
                    value={progress}
                    onChange={safeHandleSeek}
                    className="flex-1 min-w-0 h-1.5 bg-white/40 dark:bg-slate-700/50 rounded-full appearance-none outline-none cursor-pointer shadow-inner"
                    style={{ background: `linear-gradient(to right, #818cf8 ${progress}%, rgba(148,163,184,0.4) ${progress}%)` }}
                  />
                  <span className="w-11 text-center">{formatTime(duration)}</span>
                </CardItem>

                <CardItem translateZ="80" className="flex items-center justify-center gap-6">
                  <button
                    onClick={safeTogglePlayMode}
                    className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors drop-shadow-sm relative z-20"
                    title={getPlayModeText()}
                  >
                    {getPlayModeIcon()}
                  </button>

                  <button onClick={safePrevSong} className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors drop-shadow-sm relative z-20">
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                  </button>

                  <button onClick={safeTogglePlay} className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-600 hover:scale-110 transition-all border-2 border-white/50 dark:border-slate-600 relative z-20">
                    {isPlaying ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
                  </button>

                  <button onClick={safeNextSong} className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors drop-shadow-sm relative z-20">
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                  </button>

                  <button className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors drop-shadow-sm relative z-20 opacity-50 cursor-default">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                  </button>
                </CardItem>
              </div>
            </div>
          </CardItem>
        </CardBody>
      </CardContainer>
    </>
  );
}
