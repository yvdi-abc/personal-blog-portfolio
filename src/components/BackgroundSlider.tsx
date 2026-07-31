"use client";
import { useState, useEffect } from "react";
import { readBg, BG_UPDATE_EVENT, getActiveImages, type BgSettingsData } from "./BgSettings";

export default function BackgroundSlider() {
  const [settings, setSettings] = useState<BgSettingsData | null>(null);
  const [idx, setIdx] = useState(0);
  const [next, setNext] = useState(1);
  const [fading, setFading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 初始化和事件监听
  useEffect(() => {
    setMounted(true);
    const sync = () => setSettings(readBg());
    sync();
    window.addEventListener(BG_UPDATE_EVENT, sync);
    return () => window.removeEventListener(BG_UPDATE_EVENT, sync);
  }, []);

  const s = settings ?? readBg();
  const enabled = s.enabled ?? true;
  const interval = s.interval ?? 6;
  const opacity = ((s.opacity ?? 20)) / 100;
  const mode = s.mode ?? "images";
  const allImages = getActiveImages(s);

  // 图片轮换
  useEffect(() => {
    if (!mounted || !enabled || allImages.length < 2 || mode !== "images") return;
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIdx((i) => (i + 1) % allImages.length);
        setNext((i) => (i + 1) % allImages.length);
        setFading(false);
      }, 1200);
    }, interval * 1000);
    return () => clearInterval(t);
  }, [mounted, enabled, interval, allImages.length, mode]);

  // 防止 hydration 错误
  if (!mounted) {
    return (
      <div className="fixed inset-0 pointer-events-none zi-bg">
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.20)' }} />
      </div>
    );
  }

  if (mode === "gradient") {
    return (
      <div className="fixed inset-0 pointer-events-none zi-bg">
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${opacity * 0.6})` }} />
      </div>
    );
  }

  const img = allImages[0] || "";
  if (!enabled || allImages.length < 2) {
    return (
      <div className="fixed inset-0 pointer-events-none zi-bg">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${opacity})` }} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden zi-bg">
      <div className="absolute inset-0 bg-cover bg-center transition-all duration-[1200ms] ease-in-out"
        style={{ backgroundImage: `url(${allImages[idx]})`, opacity: fading ? 0 : 1, transform: fading ? "scale(1.05)" : "scale(1)" }} />
      <div className="absolute inset-0 bg-cover bg-center transition-all duration-[1200ms] ease-in-out"
        style={{ backgroundImage: `url(${allImages[next]})`, opacity: fading ? 1 : 0, transform: fading ? "scale(1)" : "scale(1.05)" }} />
      <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${opacity})` }} />
    </div>
  );
}
