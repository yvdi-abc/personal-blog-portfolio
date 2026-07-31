"use client";
import { useEffect, useState } from 'react';

interface Firefly {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  glowSize: number;
}

export default function FireflyEffect() {
  const [fireflies, setFireflies] = useState<Firefly[]>([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 检测当前主题
    const checkTheme = () => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDark(dark);
    };

    checkTheme();

    // 监听主题变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // 只在暗色模式显示
    if (!isDark) {
      setFireflies([]);
      return;
    }

    // 生成20-30只萤火虫
    const count = 20 + Math.floor(Math.random() * 10);
    const newFireflies: Firefly[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3, // 2-5px
      duration: 3 + Math.random() * 4, // 3-7秒
      delay: Math.random() * 5,
      glowSize: 8 + Math.random() * 12, // 8-20px 光晕
    }));

    setFireflies(newFireflies);
  }, [isDark]);

  if (!isDark || fireflies.length === 0) return null;

  return (
    <>
      <style jsx>{`
        @keyframes firefly-float {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          25% {
            transform: translate(20px, -30px);
          }
          50% {
            transform: translate(-10px, -60px);
            opacity: 0.8;
          }
          75% {
            transform: translate(15px, -90px);
          }
          90% {
            opacity: 1;
          }
        }
        @keyframes firefly-glow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[3]">
        {fireflies.map((firefly) => (
          <div
            key={firefly.id}
            className="absolute"
            style={{
              left: `${firefly.x}%`,
              top: `${firefly.y}%`,
              animation: `firefly-float ${firefly.duration}s ease-in-out infinite`,
              animationDelay: `${firefly.delay}s`,
            }}
          >
            {/* 光晕 */}
            <div
              className="absolute rounded-full"
              style={{
                width: `${firefly.glowSize}px`,
                height: `${firefly.glowSize}px`,
                background: `radial-gradient(circle, rgba(255, 223, 100, 0.6) 0%, rgba(255, 200, 50, 0.3) 30%, transparent 70%)`,
                transform: 'translate(-50%, -50%)',
                animation: `firefly-glow ${firefly.duration * 0.5}s ease-in-out infinite`,
                animationDelay: `${firefly.delay}s`,
                filter: 'blur(2px)',
              }}
            />
            {/* 核心光点 */}
            <div
              className="absolute rounded-full bg-yellow-300"
              style={{
                width: `${firefly.size}px`,
                height: `${firefly.size}px`,
                transform: 'translate(-50%, -50%)',
                boxShadow: `0 0 ${firefly.size * 2}px rgba(255, 223, 100, 0.8)`,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
