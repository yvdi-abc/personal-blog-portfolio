'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';
import Footer from '@/components/Footer';

interface PostData {
  title: string;
  date: string;
  tags: string[];
  cover: string;
  description: string;
  content: string;
}

export default function Post({ params }: { params: { slug: string } }) {
  const [postData, setPostData] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 直接从本地获取文章内容
    const slug = params.slug;

    // 根据 slug 匹配文章（这里简化处理，实际应该从文件读取）
    fetch(`/posts/${slug}.md`)
      .then(res => res.text())
      .then(text => {
        // 简单解析 frontmatter（生产环境应该在服务端处理）
        const lines = text.split('\n');
        let inFrontmatter = false;
        let frontmatter: any = {};
        let content = '';
        let frontmatterStr = '';

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim() === '---') {
            if (!inFrontmatter) {
              inFrontmatter = true;
            } else {
              // 解析 frontmatter
              frontmatterStr.split('\n').forEach(line => {
                const match = line.match(/^(\w+):\s*(.+)$/);
                if (match) {
                  const key = match[1];
                  let value: any = match[2];

                  // 处理引号
                  if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                  }

                  // 处理数组
                  if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).split(',').map((v: string) => v.trim().replace(/"/g, ''));
                  }

                  frontmatter[key] = value;
                }
              });
              inFrontmatter = false;
              content = lines.slice(i + 1).join('\n');
              break;
            }
          } else if (inFrontmatter) {
            frontmatterStr += lines[i] + '\n';
          }
        }

        setPostData({
          title: frontmatter.title || '无标题',
          date: frontmatter.date || '未知日期',
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
          cover: frontmatter.cover || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop',
          description: frontmatter.description || '',
          content: content
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen relative pb-20">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="min-h-screen relative pb-20">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">文章未找到</h1>
            <Link href="/blog" className="text-teal-600 dark:text-teal-400 hover:underline">
              返回博客列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-20">
      <Navbar />
      <PageTransition>
        <main className="w-[95%] md:w-[90%] max-w-6xl mx-auto mt-24 md:mt-28 flex flex-col lg:flex-row gap-6 md:gap-8 relative zi-content">

          <article className="flex-1 bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 dark:border-white/10 overflow-hidden transition-colors duration-700">
            <div className="w-full aspect-video bg-slate-200 dark:bg-slate-700 relative group overflow-hidden">
              <img
                src={postData.cover}
                alt="封面"
                className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105"
              />
            </div>

            <div className="p-5 md:p-12 relative">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold mb-6 transition-colors group"
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                返回博客列表
              </Link>

              <header className="mb-6 md:mb-8 border-b border-slate-300/50 dark:border-slate-700 pb-5 md:pb-6 relative">
                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors duration-700 leading-snug">
                  {postData.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <div className="flex items-center gap-1.5 md:gap-2 text-indigo-700 dark:text-indigo-400 font-bold bg-white/30 dark:bg-slate-900/50 px-3 md:px-4 py-1.5 md:py-2 rounded-full w-max text-xs md:text-sm transition-colors duration-700 shadow-sm border border-white/20 dark:border-white/5">
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {postData.date}
                  </div>

                  {postData.tags.map((tag: string) => (
                    <div key={tag} className="flex items-center gap-1 text-pink-600 dark:text-pink-400 font-bold bg-white/30 dark:bg-slate-900/50 px-2.5 md:px-3 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition-colors duration-700 shadow-sm border border-white/20 dark:border-white/5">
                      <span className="text-[10px] md:text-xs opacity-70">#</span> {tag}
                    </div>
                  ))}
                </div>
              </header>

              <div className="relative">
                <ReactMarkdown
                  className="prose prose-slate dark:prose-invert prose-base md:prose-lg max-w-none text-slate-800 dark:text-slate-200 transition-colors duration-700"
                >
                  {postData.content}
                </ReactMarkdown>

                <style>{`
                  .prose { color: inherit; }
                  .prose h1 { font-size: 1.8rem !important; font-weight: 900 !important; margin-bottom: 1.2rem !important; margin-top: 2rem !important; line-height: 1.3 !important; color: inherit !important; }
                  .prose h2 { font-size: 1.5rem !important; font-weight: 800 !important; margin-bottom: 1rem !important; margin-top: 1.5rem !important; color: inherit !important; }
                  .prose h3 { font-size: 1.2rem !important; font-weight: 700 !important; margin-bottom: 0.8rem !important; color: inherit !important; }
                  .prose p { font-size: 0.95rem !important; line-height: 1.75 !important; color: inherit !important; margin-bottom: 1rem !important; }

                  .prose a { color: #6366f1 !important; text-decoration: none !important; font-weight: 600 !important; border-bottom: 1px dashed #6366f1 !important; transition: all 0.3s ease !important; }
                  .prose a:hover { color: #4f46e5 !important; border-bottom-style: solid !important; background-color: rgba(99, 102, 241, 0.1) !important; padding: 0 0.2rem !important; border-radius: 0.2rem !important; }
                  .dark .prose a { color: #818cf8 !important; border-bottom-color: #818cf8 !important; }
                  .dark .prose a:hover { color: #a5b4fc !important; background-color: rgba(129, 140, 248, 0.15) !important; }

                  .prose ul { list-style-type: disc !important; padding-left: 1.5rem !important; font-size: 0.95rem !important; }
                  .prose ol { list-style-type: decimal !important; padding-left: 1.5rem !important; font-size: 0.95rem !important; }
                  .prose li { display: list-item !important; margin-bottom: 0.5rem !important; color: inherit !important; }

                  .prose ul ul, .prose ol ul { list-style-type: circle !important; margin-top: 0.25rem !important; margin-bottom: 0.25rem !important; }
                  .prose ol ol, .prose ul ol { list-style-type: lower-alpha !important; margin-top: 0.25rem !important; margin-bottom: 0.25rem !important; }

                  .prose del { text-decoration-color: inherit !important; opacity: 0.6; }

                  .prose blockquote {
                    border-left: 4px solid #6366f1 !important;
                    background-color: rgba(99, 102, 241, 0.05) !important;
                    padding: 1rem 1.5rem !important;
                    margin: 1.5rem 0 !important;
                    border-radius: 0 1.25rem 1.25rem 0 !important;
                    font-style: italic !important;
                    color: #64748b !important;
                  }
                  .prose blockquote p {
                    margin: 0 !important;
                    color: inherit !important;
                  }
                  .dark .prose blockquote {
                    border-left-color: #818cf8 !important;
                    background-color: rgba(129, 140, 248, 0.1) !important;
                    color: #94a3b8 !important;
                  }

                  .prose pre {
                    background-color: #282c34 !important;
                    color: #abb2bf !important;
                    padding: 1rem !important;
                    border-radius: 0.75rem !important;
                    overflow-x: auto !important;
                    box-shadow: inset 0 0 10px rgba(0,0,0,0.3) !important;
                    margin-top: 1rem !important;
                    margin-bottom: 1rem !important;
                  }

                  .prose pre code, .prose p code, .prose li code {
                    font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, ui-monospace, monospace !important;
                    font-variant-ligatures: contextual !important;
                  }
                  .prose pre code {
                    background-color: transparent !important;
                    padding: 0 !important;
                    color: inherit !important;
                    font-size: 0.85em !important;
                  }

                  .prose code::before, .prose code::after { content: none !important; }
                  .prose p code, .prose li code {
                    background-color: rgba(99, 102, 241, 0.1) !important;
                    color: #6366f1 !important;
                    padding: 0.1rem 0.3rem !important;
                    border-radius: 0.25rem !important;
                    font-weight: 600 !important;
                    font-size: 0.85em !important;
                  }
                  .dark .prose p code, .dark .prose li code {
                    background-color: rgba(99, 102, 241, 0.2) !important;
                    color: #818cf8 !important;
                  }

                  .prose img {
                    display: block !important;
                    margin: 1.5rem auto !important;
                    border-radius: 1rem !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
                    max-width: 100% !important;
                    height: auto !important;
                  }

                  .prose table {
                    width: 100% !important;
                    border-collapse: collapse !important;
                    margin: 1.5rem 0 !important;
                    font-size: 0.9rem !important;
                  }
                  .prose th {
                    background-color: rgba(99, 102, 241, 0.1) !important;
                    padding: 0.75rem !important;
                    text-align: left !important;
                    font-weight: 700 !important;
                    border: 1px solid rgba(99, 102, 241, 0.2) !important;
                  }
                  .prose td {
                    padding: 0.75rem !important;
                    border: 1px solid rgba(203, 213, 225, 0.5) !important;
                  }
                  .dark .prose td {
                    border-color: rgba(71, 85, 105, 0.5) !important;
                  }
                  .prose tr:hover {
                    background-color: rgba(99, 102, 241, 0.05) !important;
                  }

                  @media (min-width: 768px) {
                    .prose h1 { font-size: 3rem !important; font-weight: 950 !important; margin-bottom: 2rem !important; margin-top: 3rem !important; line-height: 1.1 !important; }
                    .prose h2 { font-size: 2.2rem !important; margin-bottom: 1.5rem !important; margin-top: 2rem !important; }
                    .prose h3 { font-size: 1.5rem !important; margin-bottom: 1rem !important; }
                    .prose p { font-size: 1.15rem !important; line-height: 1.85 !important; }

                    .prose ul, .prose ol { padding-left: 2rem !important; font-size: 1.1rem !important; }

                    .prose pre { padding: 1.25rem !important; margin-top: 1.5rem !important; margin-bottom: 1.5rem !important; }
                    .prose pre code { font-size: 0.9em !important; }
                    .prose p code, .prose li code { padding: 0.2rem 0.4rem !important; font-size: 0.9em !important; border-radius: 0.375rem !important;}
                    .prose img { margin: 2rem auto !important; border-radius: 2rem !important; box-shadow: 0 20px 50px rgba(0,0,0,0.15) !important; }
                  }
                `}</style>
              </div>

            </div>
          </article>

          <aside className="w-full lg:w-[320px] flex flex-col gap-6 flex-shrink-0">
            <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-white/40 dark:border-white/10 shadow-xl">
              <h3 className="font-black text-slate-900 dark:text-white mb-4 border-l-4 border-indigo-500 pl-2 text-sm">文章信息</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">发布时间</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{postData.date}</p>
                </div>
                {postData.tags.length > 0 && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">标签</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {postData.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-md text-xs font-semibold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
}
