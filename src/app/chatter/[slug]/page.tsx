import { chattersData } from '@/data/chatters';
import { siteConfig } from "@/siteConfig";
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return chattersData.map((chatter) => ({
    slug: chatter.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chatter = chattersData.find(c => c.slug === slug);

  if (!chatter) {
    return {
      title: '碎语未找到 | ' + siteConfig.title,
    };
  }

  return {
    title: chatter.title + ' | ' + siteConfig.title,
    description: chatter.content.slice(0, 150),
  };
}

export default async function ChatterDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chatter = chattersData.find(c => c.slug === slug);

  if (!chatter) {
    notFound();
  }

  return (
    <div className="min-h-screen relative pb-32">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-10 pt-32 relative z-10">

        {/* 返回按钮 */}
        <Link
          href="/chatter"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回碎语列表
        </Link>

        {/* 封面图 */}
        {chatter.cover && (
          <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-8 shadow-2xl">
            <img src={chatter.cover} alt={chatter.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* 主内容卡片 */}
        <article className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-6 md:p-10 shadow-xl">

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-3 py-1 rounded-lg">
              {chatter.date}
            </span>
            {chatter.mood && (
              <span className="text-xs font-black text-pink-600 dark:text-pink-400 bg-pink-500/10 px-3 py-1 rounded-lg">
                ✨ {chatter.mood}
              </span>
            )}
          </div>

          {/* 标题 */}
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-8 leading-tight">
            {chatter.title}
          </h1>

          {/* 正文 */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {chatter.content}
            </p>
          </div>

          {/* 标签 */}
          {chatter.tags && chatter.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
              <div className="flex flex-wrap gap-2">
                {chatter.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-500/10 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-500/10 dark:border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* 相关推荐 */}
        <div className="mt-12">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">
            更多碎语
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chattersData
              .filter(c => c.slug !== chatter.slug)
              .slice(0, 2)
              .map(related => (
                <Link
                  key={related.slug}
                  href={`/chatter/${related.slug}`}
                  className="block bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                    {related.date}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {related.content}
                  </p>
                </Link>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}
