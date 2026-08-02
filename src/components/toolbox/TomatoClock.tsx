"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function TomatoClock() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev === 0) {
            setMinutes(m => {
              if (m === 0) {
                // 时间到
                setIsRunning(false);
                if (mode === 'work') {
                  setMode('break');
                  setMinutes(5);
                } else {
                  setMode('work');
                  setMinutes(25);
                }
                // 播放提示音（可选）
                if (typeof window !== 'undefined') {
                  const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryxnMpBSh+zPLaizsIGGS56+mcTgwKUKXh8bllHAU7k9n0yoUrBSV7yfDajT0HEmS56+mcUQwLT6nn8rZkHQU6kdXzyoMuBSh9zPLajz4HE2a66+icUgwMUqvm8bZlHgU7ktnzyYQuBSeAzfHakD4HFWi76+mcUgwLUank8bZmHgU7kdjzyoQvBSd/y/HZkD8HF2m86+idUwwKUafl8rdmHgU8ktj0yYUvBSh/y/HakUAHF2q96+ieUw==');
                  audio.play().catch(() => {});
                }
                return 0;
              }
              return m - 1;
            });
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  const reset = () => {
    setIsRunning(false);
    setMode('work');
    setMinutes(25);
    setSeconds(0);
  };

  const toggleMode = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setMode('break');
      setMinutes(5);
    } else {
      setMode('work');
      setMinutes(25);
    }
    setSeconds(0);
  };

  const progress = mode === 'work'
    ? ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100
    : ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 模式切换 */}
      <div className="flex gap-2 w-full">
        <button
          onClick={toggleMode}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
            mode === 'work'
              ? 'bg-red-500 text-white'
              : 'bg-green-500 text-white'
          }`}
        >
          {mode === 'work' ? '🍅 工作' : '☕ 休息'}
        </button>
      </div>

      {/* 时间显示 */}
      <div className="relative w-40 h-40">
        {/* 进度环 */}
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-slate-200 dark:text-slate-700"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 70}`}
            strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
            className={mode === 'work' ? 'text-red-500' : 'text-green-500'}
            strokeLinecap="round"
          />
        </svg>

        {/* 时间文字 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-800 dark:text-white tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {mode === 'work' ? '专注时间' : '休息时间'}
            </div>
          </div>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex gap-2 w-full">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          {isRunning ? '暂停' : '开始'}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
