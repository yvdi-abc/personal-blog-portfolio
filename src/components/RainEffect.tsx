"use client";
import { useEffect, useRef } from 'react';
import { useEffectToggle } from './useEffectToggle';

interface Raindrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

export default function RainEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enabled = useEffectToggle('rain');
  const raindropsRef = useRef<Raindrop[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      raindropsRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置 canvas 尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 创建雨滴
    const createRaindrops = () => {
      const dropCount = Math.floor((canvas.width * canvas.height) / 8000); // 密度
      raindropsRef.current = [];
      for (let i = 0; i < dropCount; i++) {
        raindropsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          length: Math.random() * 20 + 10, // 10-30px
          speed: Math.random() * 3 + 5, // 5-8px per frame
          opacity: Math.random() * 0.3 + 0.3, // 0.3-0.6
        });
      }
    };

    createRaindrops();

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制雨滴
      raindropsRef.current.forEach((drop) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(174, 194, 224, ${drop.opacity})`;
        ctx.lineWidth = 1;
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        // 更新位置
        drop.y += drop.speed;

        // 雨滴落到底部后重置
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[3]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
