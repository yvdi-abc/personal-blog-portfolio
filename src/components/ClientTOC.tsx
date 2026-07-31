"use client";
import { useEffect, useState } from 'react';

type TocItem = {
  level: number;
  text: string;
  id: string;
};

const cleanMarkdownHeading = (rawText: string) => {
  if (!rawText) return '';
  return rawText
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/[*_~`#]/g, '')
    .trim();
};

const getSafeId = (rawText: string) => {
  const cleanText = cleanMarkdownHeading(rawText);
  return 'toc-' + cleanText
    .replace(/[^一-龥a-zA-Z0-9]/g, '')
    .toLowerCase();
};

const getDisplayText = (rawText: string) => {
  return cleanMarkdownHeading(rawText);
};

export default function ClientTOC({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const contentDiv = document.getElementById('article-content');
    if (!contentDiv) return;

    const headings = Array.from(contentDiv.querySelectorAll('h1, h2, h3'));

    headings.forEach((heading) => {
      heading.id = getSafeId(heading.textContent || '');
    });

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = 150;

      let currentActiveId = "";

      for (const heading of headings) {
        const elementTop = heading.getBoundingClientRect().top + scrollY;
        if (scrollY >= elementTop - offset) {
          currentActiveId = heading.id;
        } else {
          break;
        }
      }

      if (currentActiveId) setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  const scrollToHeading = (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    const targetElement = document.getElementById(id);
    if (!targetElement) return;

    const offset = 100;
    const targetY = targetElement.getBoundingClientRect().top + window.scrollY - offset;
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 600;
    let startTime: number | null = null;

    const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t + b;
      t -= 2;
      return c / 2 * (t * t * t + 2) + b;
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;

      const nextY = easeInOutCubic(timeElapsed, startY, distance, duration);
      window.scrollTo(0, nextY);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        window.scrollTo(0, targetY);
      }
    };

    requestAnimationFrame(animation);
    setActiveId(id);
  };

  if (!toc || toc.length === 0) return null;

  return (
    <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-white/40 dark:border-white/10 shadow-xl sticky top-28 transition-colors duration-700 max-h-[75vh] overflow-y-auto custom-scrollbar">
      <h3 className="font-black text-slate-900 dark:text-white mb-4 border-l-4 border-indigo-500 pl-2 text-sm uppercase tracking-widest">
        Table of Contents
      </h3>
      <nav className="flex flex-col gap-2 relative">
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-700/50 rounded-full"></div>

        {toc.map((item, index) => {
          const displayText = getDisplayText(item.text);
          const safeId = getSafeId(item.text);
          const isActive = activeId === safeId;

          return (
            <button
              key={index}
              onClick={(e) => scrollToHeading(e, safeId)}
              className={`text-left text-sm transition-all duration-300 line-clamp-2 cursor-pointer relative pl-4
                ${item.level === 1 ? 'font-bold mt-2' : ''}
                ${item.level === 2 ? 'ml-2' : ''}
                ${item.level === 3 ? 'ml-4 text-xs' : ''}
                ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105 origin-left' : 'text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400'}
              `}
            >
              {isActive && (
                <span className="absolute left-[-5px] top-[50%] -translate-y-[50%] w-[6px] h-[6px] rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
              )}
              {displayText}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
