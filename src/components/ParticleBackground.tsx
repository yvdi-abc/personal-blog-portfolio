"use client";
import { useEffect, useRef } from "react";
import { useEffectToggle } from './useEffectToggle';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enabled = useEffectToggle('particle');

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || !enabled) return;
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;

    const ctx = cv.getContext("2d")!;
    const hues = [150, 165, 175, 190, 35, 45, 55]; // teal/cyan + amber
    let P: any[] = [], mx = -9999, my = -9999, w = 0, h = 0, rid = 0;

    const resize = () => { w = cv.width = window.innerWidth; h = cv.height = window.innerHeight; };

    class Pt {
      x: number; y: number; vx: number; vy: number; s: number; o: number; h: number;
      constructor() {
        this.x = Math.random() * w; this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3;
        this.s = Math.random() * 3 + 1.5; this.o = Math.random() * 0.5 + 0.25;
        this.h = hues[Math.floor(Math.random() * hues.length)];
      }
      up() {
        const dx = this.x - mx, dy = this.y - my, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150 && d > 0) { const f = (1 - d / 150) * 3; this.vx += (dx / d) * f * 0.1; this.vy += (dy / d) * f * 0.1; }
        this.vx *= 0.98; this.vy *= 0.98;
        const sp = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (sp > 2.5) { this.vx = (this.vx / sp) * 2.5; this.vy = (this.vy / sp) * 2.5; }
        this.x += this.vx; this.y += this.vy;
        if (this.x < -20) this.x = w + 20; if (this.x > w + 20) this.x = -20;
        if (this.y < -20) this.y = h + 20; if (this.y > h + 20) this.y = -20;
      }
      dr() {
        // Outer glow
        ctx.beginPath(); ctx.arc(this.x, this.y, this.s * 6, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.h},60%,65%,${this.o * 0.06})`; ctx.fill();
        // Mid glow
        ctx.beginPath(); ctx.arc(this.x, this.y, this.s * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.h},60%,65%,${this.o * 0.15})`; ctx.fill();
        // Core
        ctx.beginPath(); ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.h},70%,70%,${this.o})`; ctx.fill();
      }
    }

    const init = () => {
      const n = Math.min(Math.floor((w * h) / 20000), 50);
      P = Array.from({ length: n }, () => new Pt());
    };

    // Draw connections between nearby particles
    const link = () => {
      for (let i = 0; i < P.length; i++) {
        for (let j = i + 1; j < P.length; j++) {
          const dx = P[i].x - P[j].x, dy = P[i].y - P[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(P[j].x, P[j].y);
            ctx.strokeStyle = `hsla(170,50%,60%,${(1 - d / 100) * 0.05})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
    };

    const anim = () => {
      ctx.clearRect(0, 0, w, h);
      P.forEach((p) => { p.up(); p.dr(); });
      link();
      rid = requestAnimationFrame(anim);
    };

    document.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });
    resize(); init(); anim();
    window.addEventListener("resize", () => { resize(); init(); });
    return () => cancelAnimationFrame(rid);
  }, []);

  return (
    <canvas ref={canvasRef}
      className="fixed inset-0 zi-fx pointer-events-none"
      aria-hidden="true" />
  );
}
