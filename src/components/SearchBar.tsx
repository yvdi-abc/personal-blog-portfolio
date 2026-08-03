"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

interface Post {
  slug: string;
  title?: string;
  description?: string;
  tags?: string[];
  date?: string;
  [key: string]: any;
}

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const Highlight = ({ text = '', query = '' }) => {
  if (!query.trim() || !text) return <>{text}</>;

  const safeQuery = escapeRegExp(query);
  const regex = new RegExp(`(${safeQuery})`, 'gi');
  const parts = String(text).split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-300 dark:bg-yellow-500/80 text-slate-900 dark:text-white px-1 mx-[1px] rounded-[4px] shadow-sm font-bold transition-all">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

export default function SearchBar({ posts = [] }: { posts: Post[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();

    return posts.filter(post => {
      const titleMatch = (post.title || '').toLowerCase().includes(query);
      const descMatch = (post.description || '').toLowerCase().includes(query);
      const tagMatch = (post.tags || []).some(tag => tag.toLowerCase().includes(query));

      return titleMatch || descMatch || tagMatch;
    });
  }, [searchQuery, posts]);

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-10 z-[100]" ref={containerRef}>
      <form className="relative" onSubmit={(e) => e.preventDefault()}>

        {/* 炫酷边框容器 */}
        <div
          id="search-container"
          className="relative flex items-center justify-center group"
          onMouseEnter={() => {}}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {/* 最外层光晕 */}
          <div className={`search-glow absolute inset-0 rounded-[20px] overflow-hidden transition-all duration-[2s] ${isFocused ? 'search-glow-active' : ''}`}>
            <div className="search-glow-before"></div>
          </div>

          {/* 深色边框背景 */}
          <div className={`search-dark-border absolute inset-0 rounded-[18px] overflow-hidden transition-all duration-[2s] ${isFocused ? 'search-dark-border-active' : ''}`}>
            <div className="search-dark-border-before"></div>
          </div>

          {/* 白色层 */}
          <div className={`search-white absolute inset-0 rounded-[16px] overflow-hidden transition-all duration-[2s] ${isFocused ? 'search-white-active' : ''}`}>
            <div className="search-white-before"></div>
          </div>

          {/* 边框层 */}
          <div className={`search-border absolute inset-0 rounded-[15px] overflow-hidden transition-all duration-[2s] ${isFocused ? 'search-border-active' : ''}`}>
            <div className="search-border-before"></div>
          </div>

          {/* 粉色遮罩 */}
          {!isFocused && (
            <div className="search-pink-mask absolute pointer-events-none w-[30px] h-[20px] bg-[#cf30aa] top-[10px] left-[5px] blur-[20px] opacity-80 transition-opacity duration-[2s] group-hover:opacity-0"></div>
          )}

          {/* 输入遮罩 */}
          {!isFocused && !searchQuery && (
            <div className="search-input-mask pointer-events-none w-[100px] h-[20px] absolute top-[18px] left-[70px] bg-gradient-to-r from-transparent to-black"></div>
          )}

          {/* Input 输入框 */}
          <input
            type="text"
            className="relative bg-[#010201] border-none w-full h-[56px] rounded-[10px] text-white px-[59px] text-lg focus:outline-none placeholder-[#c0b9c0]"
            placeholder="搜寻标题、描述或标签..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              setIsOpen(true);
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
            autoComplete="off"
            spellCheck="false"
          />

          {/* 搜索图标 */}
          <div className="absolute left-[20px] top-[15px] pointer-events-none select-none z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-slate-400 transition-colors"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

      </form>

      <AnimatePresence>
        {isOpen && searchQuery.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border border-white/50 dark:border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden max-h-[450px] overflow-y-auto z-20"
          >
            {searchResults.length > 0 ? (
              <div className="flex flex-col py-3">
                {searchResults.map((post) => (
                  <Link
                    href={`/blog/${post.slug}`}
                    key={post.slug}
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-5 hover:bg-indigo-50/80 dark:hover:bg-indigo-500/10 transition-colors group border-b border-slate-100/50 dark:border-slate-800/50 last:border-0 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 transition-colors line-clamp-1">
                        <Highlight text={post.title} query={searchQuery} />
                      </h4>
                      {post.date && (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded-md shrink-0 mt-1">
                          {post.date.split(' ')[0]}
                        </span>
                      )}
                    </div>

                    {post.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        <Highlight text={post.description} query={searchQuery} />
                      </p>
                    )}

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.tags.map(tag => (
                          <span key={tag} className="flex items-center text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5 opacity-60">
                              <line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line>
                            </svg>
                            <Highlight text={tag} query={searchQuery} />
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-slate-400">
                    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  数据海中未发现关于 "<span className="text-indigo-500 font-bold">{searchQuery}</span>" 的踪迹
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        /* 光晕效果 */
        .search-glow {
          filter: blur(30px);
          opacity: 0.4;
          z-index: -1;
        }
        .search-glow-before {
          position: absolute;
          content: "";
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(60deg);
          width: 999px;
          height: 999px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            #000,
            #402fb5 5%,
            #000 38%,
            #000 50%,
            #cf30aa 60%,
            #000 87%
          );
          transition: all 2s;
        }
        .search-glow-active .search-glow-before {
          transform: translate(-50%, -50%) rotate(420deg);
          transition: all 4s;
        }

        /* 深色边框背景 */
        .search-dark-border {
          filter: blur(3px);
          z-index: -1;
        }
        .search-dark-border-before {
          position: absolute;
          content: "";
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(82deg);
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            rgba(0, 0, 0, 0),
            #18116a,
            rgba(0, 0, 0, 0) 10%,
            rgba(0, 0, 0, 0) 50%,
            #6e1b60,
            rgba(0, 0, 0, 0) 60%
          );
          transition: all 2s;
        }
        .search-dark-border-active .search-dark-border-before {
          transform: translate(-50%, -50%) rotate(442deg);
          transition: all 4s;
        }
        #search-container:hover .search-dark-border-before {
          transform: translate(-50%, -50%) rotate(-98deg);
        }

        /* 白色层 */
        .search-white {
          filter: blur(2px);
          z-index: -1;
        }
        .search-white-before {
          position: absolute;
          content: "";
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(83deg);
          width: 600px;
          height: 600px;
          background-repeat: no-repeat;
          background-position: 0 0;
          filter: brightness(1.4);
          background-image: conic-gradient(
            rgba(0, 0, 0, 0) 0%,
            #a099d8,
            rgba(0, 0, 0, 0) 8%,
            rgba(0, 0, 0, 0) 50%,
            #dfa2da,
            rgba(0, 0, 0, 0) 58%
          );
          transition: all 2s;
        }
        .search-white-active .search-white-before {
          transform: translate(-50%, -50%) rotate(443deg);
          transition: all 4s;
        }
        #search-container:hover .search-white-before {
          transform: translate(-50%, -50%) rotate(-97deg);
        }

        /* 边框层 */
        .search-border {
          filter: blur(0.5px);
          z-index: -1;
        }
        .search-border-before {
          position: absolute;
          content: "";
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(70deg);
          width: 600px;
          height: 600px;
          filter: brightness(1.3);
          background-repeat: no-repeat;
          background-position: 0 0;
          background-image: conic-gradient(
            #1c191c,
            #402fb5 5%,
            #1c191c 14%,
            #1c191c 50%,
            #cf30aa 60%,
            #1c191c 64%
          );
          transition: all 2s;
        }
        .search-border-active .search-border-before {
          transform: translate(-50%, -50%) rotate(430deg);
          transition: all 4s;
        }
        #search-container:hover .search-border-before {
          transform: translate(-50%, -50%) rotate(-110deg);
        }
      `}</style>
    </div>
  );
}
