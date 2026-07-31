"use client";

import { useEffect, useState, useMemo } from "react";

export default function GlobalSnow() {
  const [isWinter, setIsWinter] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkWinter = () => {
      const isActive = document.body.classList.contains("winter-mode") || localStorage.getItem("winter-mode") === "true";
      setIsWinter(isActive);
      if (isActive) document.body.classList.add("winter-mode");
    };

    checkWinter();

    // 监控 body 类名变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsWinter(document.body.classList.contains("winter-mode"));
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const snowParticles = useMemo(() => {
    const types = ["❄", "❅", "❆"];
    return Array.from({ length: 40 }).map(() => ({
      char: types[Math.floor(Math.random() * types.length)],
      size: Math.random() * 15 + 10,
      left: Math.random() * 100,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, []);

  if (!mounted || !isWinter) return null;

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
            left: `${p.left}vw`,
            top: "-20px",
            opacity: p.opacity,
            animation: `snowDrop ${p.duration}s linear ${p.delay}s infinite`,
            filter: "drop-shadow(0 0 2px rgba(255,255,255,0.8))",
          }}
        >
          {p.char}
        </div>
      ))}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes snowDrop {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(105vh) rotate(360deg); }
        }
      `}} />
    </div>
  );
}
