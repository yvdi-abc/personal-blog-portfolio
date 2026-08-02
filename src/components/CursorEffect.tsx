"use client";
import { useEffect, useRef, useCallback } from "react";
import { useEffectToggle } from './useEffectToggle';

export default function CursorEffect() {
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rAF = useRef(0);
  const enabled = useEffectToggle('cursor');

  const updateRing = useCallback(() => {
    ring.current.x += (mouse.current.x - ring.current.x) * 0.15;
    ring.current.y += (mouse.current.y - ring.current.y) * 0.15;
    if (ringRef.current) {
      ringRef.current.style.left = `${ring.current.x}px`;
      ringRef.current.style.top = `${ring.current.y}px`;
    }
    rAF.current = requestAnimationFrame(updateRing);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(pointer:coarse)").matches) return;
    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const onLeave = () => {
      mouse.current.x = -999;
      mouse.current.y = -999;
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    rAF.current = requestAnimationFrame(updateRing);

    const targets = document.querySelectorAll<HTMLElement>(
      "a,button,.blog-card,.project-card"
    );
    const expand = () => ringRef.current?.classList.add("active");
    const shrink = () => ringRef.current?.classList.remove("active");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", expand);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rAF.current);
      document.documentElement.style.cursor = "";
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", expand);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, [updateRing]);

  return (
    <div
      ref={ringRef}
      className="fixed pointer-events-none zi-cursor"
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        border: "2px solid rgba(168,85,247,0.5)",
        willChange: "left, top",
        transition: "width 0.2s ease, height 0.2s ease",
        transform: "translate(-50%, -50%)",
        left: 0,
        top: 0,
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
      >
        <div style={{
          width: 12,
          height: 2,
          background: "rgba(168,85,247,0.6)",
          borderRadius: 1,
          position: "absolute"
        }} />
        <div style={{
          width: 2,
          height: 12,
          background: "rgba(168,85,247,0.6)",
          borderRadius: 1,
          position: "absolute"
        }} />
        <div style={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "rgba(168,85,247,0.8)"
        }} />
      </div>
    </div>
  );
}
