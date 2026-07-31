"use client";
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface Danmaku {
  id: number;
  text: string;
  lane: number; // 轨道编号
  color: string;
  fontSize: number;
}

const DANMAKU_TEXTS = [
  "欢迎来到我的博客",
  "热爱编程 热爱生活",
  "Keep Learning",
  "Code with Love",
  "让代码更优雅",
  "追求极致体验",
  "永远保持好奇心",
  "创造有温度的产品",
  "用心写好每一行代码",
  "Stay Hungry Stay Foolish",
  "技术改变世界",
  "专注成就卓越",
  "梦想驱动创造",
  "用代码书写诗意",
  "探索无限可能",
];

const COLORS = [
  '#FFFFFF',  // 白色（最常见）
  '#FB7299',  // 粉色
  '#00D1F1',  // 青色
  '#FFA54F',  // 橙色
  '#9B59B6',  // 紫色
  '#FFD700',  // 金色
  '#00FF7F',  // 春绿
];

const LANE_COUNT = 12; // 轨道数量
const LANE_HEIGHT = 40; // 每条轨道高度

export default function DanmakuBackground() {
  const pathname = usePathname();
  const [danmakus, setDanmakus] = useState<Danmaku[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const laneTimers = useRef<number[]>(new Array(LANE_COUNT).fill(0));
  const nextId = useRef(0);
  const textIndex = useRef(0);

  const isHomePage = pathname === '/';

  // 检查轨道是否可用
  const isLaneAvailable = (lane: number, currentTime: number): boolean => {
    return currentTime - laneTimers.current[lane] > 1500; // 1.5秒间隔
  };

  // 获取可用轨道
  const getAvailableLane = (): number => {
    const currentTime = Date.now();
    for (let i = 0; i < LANE_COUNT; i++) {
      if (isLaneAvailable(i, currentTime)) {
        laneTimers.current[i] = currentTime;
        return i;
      }
    }
    // 如果没有空闲轨道，随机选一个
    const lane = Math.floor(Math.random() * LANE_COUNT);
    laneTimers.current[lane] = currentTime;
    return lane;
  };

  // 创建新弹幕
  const createDanmaku = (): Danmaku => {
    const lane = getAvailableLane();

    return {
      id: nextId.current++,
      text: DANMAKU_TEXTS[textIndex.current++ % DANMAKU_TEXTS.length],
      lane,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      fontSize: 16 + Math.floor(Math.random() * 3) * 2, // 16, 18, 20
    };
  };

  useEffect(() => {
    if (!isHomePage) {
      setDanmakus([]);
      return;
    }

    // 初始化：先发射1条弹幕
    const firstDanmaku = createDanmaku();
    setDanmakus([firstDanmaku]);

    // 12秒后清理
    setTimeout(() => {
      setDanmakus((prev) => prev.filter((d) => d.id !== firstDanmaku.id));
    }, 12000);

    // 定期发射新弹幕，每次只发射一条
    const interval = setInterval(() => {
      const newDanmaku = createDanmaku();
      setDanmakus((prev) => [...prev, newDanmaku]);

      // 12秒后清理
      setTimeout(() => {
        setDanmakus((prev) => prev.filter((d) => d.id !== newDanmaku.id));
      }, 12000);
    }, 3000 + Math.random() * 2000); // 3-5秒发射一条

    return () => {
      clearInterval(interval);
      setDanmakus([]);
    };
  }, [isHomePage]);

  if (!isHomePage) return null;

  return (
    <>
      <style jsx>{`
        @keyframes danmaku-scroll {
          from {
            transform: translateX(100vw);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>

      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none overflow-hidden z-[5]"
      >
        {danmakus.map((dm) => {
          const top = dm.lane * LANE_HEIGHT + 80;

          return (
            <div
              key={dm.id}
              className="absolute whitespace-nowrap font-bold select-none"
              style={{
                top: `${top}px`,
                color: dm.color,
                fontSize: `${dm.fontSize}px`,
                opacity: 0.85,
                textShadow: `
                  1px 0 1px rgba(0,0,0,0.5),
                  0 1px 1px rgba(0,0,0,0.5),
                  0 -1px 1px rgba(0,0,0,0.5),
                  -1px 0 1px rgba(0,0,0,0.5),
                  1px 1px 2px rgba(0,0,0,0.5)
                `,
                fontWeight: 500,
                letterSpacing: '0.5px',
                animation: `danmaku-scroll 12s linear`,
                zIndex: 5,
              }}
            >
              {dm.text}
            </div>
          );
        })}
      </div>
    </>
  );
}
