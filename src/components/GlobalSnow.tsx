"use client";

import { useEffect, useState, useMemo } from "react";
import { useEffectToggle } from './useEffectToggle';

export default function GlobalSnow() {
  const enabled = useEffectToggle('snow');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const snowParticles = useMemo(() => {
    const types = ["❄", "❅", "❆", "✦", "✧"];
    return Array.from({ length: 50 }).map(() => {
      const size = Math.random() * 18 + 8;
      const duration = Math.random() * 8 + 5; // 5-13秒
      const delay = Math.random() * 8;
      const swayAmount = Math.random() * 100 - 50; // 左右摆动幅度

      return {
        char: types[Math.floor(Math.random() * types.length)],
        size,
        left: Math.random() * 100,
        duration,
        delay,
        opacity: Math.random() * 0.6 + 0.3, // 0.3-0.9
        swayAmount,
        blur: Math.random() * 2, // 景深模糊
        rotate: 360 + Math.random() * 360,
      };
    });
  }, []);

  if (!mounted || !enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[190] overflow-hidden">
      {/* 全局冷色调滤镜 */}
      <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-900/10 mix-blend-overlay transition-opacity duration-1000" />

      {/* 雪花粒子 */}
      {snowParticles.map((p, i) => (
        <div
          key={i}
          className="absolute text-white select-none pointer-events-none"
          style={{
            fontSize: p.size,
            left: `${p.left}%`,
            top: "-30px",
            opacity: p.opacity,
            animation: `snowDrop${i} ${p.duration}s linear ${p.delay}s infinite`,
            filter: `drop-shadow(0 0 3px rgba(255,255,255,0.9)) blur(${p.blur}px)`,
            textShadow: "0 0 5px rgba(255,255,255,0.8)",
          }}
        >
          {p.char}
        </div>
      ))}

      <style dangerouslySetInnerHTML={{ __html: `
        ${snowParticles.map((p, i) => `
          @keyframes snowDrop${i} {
            0% {
              transform: translateY(0) translateX(0) rotate(0deg) scale(0.5);
              opacity: 0;
            }
            10% {
              opacity: ${p.opacity};
              transform: scale(1);
            }
            90% {
              opacity: ${p.opacity};
            }
            100% {
              transform: translateY(105vh) translateX(${p.swayAmount}px) rotate(${p.rotate}deg) scale(0.8);
              opacity: 0;
            }
          }
        `).join('\n')}
      `}} />
    </div>
  );
}
