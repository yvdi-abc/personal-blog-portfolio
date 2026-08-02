"use client";
import { useEffect, useState } from 'react';
import { useEffectToggle } from './useEffectToggle';

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  swing: number;
  opacity: number;
}

export default function SakuraEffect() {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [isDark, setIsDark] = useState(true);
  const enabled = useEffectToggle('sakura');

  useEffect(() => {
    const checkTheme = () => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDark(dark);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isDark || !enabled) {
      setPetals([]);
      return;
    }

    // 生成60-80片花瓣（增加密度）
    const count = 60 + Math.floor(Math.random() * 20);
    const newPetals: Petal[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 16 + Math.random() * 12, // 16-28px（更大）
      duration: 8 + Math.random() * 6, // 8-14秒（更快）
      delay: Math.random() * 8,
      swing: 50 + Math.random() * 80, // 50-130px（更大摇摆）
      opacity: 0.6 + Math.random() * 0.3, // 0.6-0.9（更明显）
    }));

    setPetals(newPetals);
  }, [isDark, enabled]);

  if (isDark || petals.length === 0) return null;

  return (
    <>
      <style jsx>{`
        @keyframes sakura-fall {
          from {
            transform: translateY(-10vh) rotate(0deg);
          }
          to {
            transform: translateY(110vh) rotate(720deg);
          }
        }
        @keyframes sakura-swing {
          0%, 100% {
            margin-left: 0;
          }
          50% {
            margin-left: var(--swing-distance);
          }
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[3]">
        {petals.map((petal) => (
          <div
            key={petal.id}
            className="absolute"
            style={{
              left: `${petal.left}%`,
              top: '-10vh',
              width: `${petal.size}px`,
              height: `${petal.size}px`,
              opacity: petal.opacity,
              animation: `sakura-fall ${petal.duration}s linear infinite, sakura-swing ${petal.duration * 0.4}s ease-in-out infinite`,
              animationDelay: `${petal.delay}s`,
              ['--swing-distance' as any]: `${petal.swing}px`,
            }}
          >
            {/* 樱花花瓣 SVG - 更鲜艳的颜色 */}
            <svg width="100%" height="100%" viewBox="0 0 24 24">
              <defs>
                <filter id={`glow-${petal.id}`}>
                  <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <g fill="#FF8FB4" opacity="0.95" filter={`url(#glow-${petal.id})`}>
                <ellipse cx="12" cy="8" rx="4" ry="6" />
                <ellipse cx="12" cy="16" rx="4" ry="6" />
                <ellipse cx="8" cy="12" rx="6" ry="4" />
                <ellipse cx="16" cy="12" rx="6" ry="4" />
                <circle cx="12" cy="12" r="3" fill="#FFCCE0" />
              </g>
              <circle cx="12" cy="12" r="1.8" fill="#FF1493" />
            </svg>
          </div>
        ))}
      </div>
    </>
  );
}
