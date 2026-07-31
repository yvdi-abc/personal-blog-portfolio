"use client";
import { useEffect, useCallback } from "react";

export default function ClickEffect() {
  const handleClick = useCallback((e: MouseEvent) => {
    const colors = ["#14b8a6", "#06b6d4", "#0ea5e9", "#f59e0b", "#10b981", "#fbbf24"];
    for (let i = 0; i < 8; i++) {
      const el = document.createElement("div");
      const size = Math.random() * 6 + 4;
      const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.5;
      const dist = Math.random() * 40 + 20;
      el.style.cssText = `
        position:fixed;left:${e.clientX}px;top:${e.clientY}px;
        width:${size}px;height:${size}px;border-radius:50%;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        pointer-events:none;z-index:9999;
        transition:all ${0.4 + Math.random() * 0.3}s cubic-bezier(.22,1,.36,1);
        opacity:1;
      `;
      document.body.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`;
        el.style.opacity = "0";
      });
      setTimeout(() => el.remove(), 800);
    }
  }, []);

  useEffect(() => {
    // Only on desktop (touch devices excluded)
    if (window.matchMedia("(pointer:coarse)").matches) return;
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [handleClick]);

  return null;
}
