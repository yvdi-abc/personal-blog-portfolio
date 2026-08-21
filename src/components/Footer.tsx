import Link from "next/link";
import { siteConfig } from "@/siteConfig";

export default function Footer() {
  return (
    <footer className="glass border-t border-white/20 dark:border-white/5 mt-16 mb-24">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; 2026 {siteConfig.author.name}
          </p>
          <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">首页</Link>
            <Link href="/blog" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">博客</Link>
            <Link href="/projects" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">项目</Link>
            <Link href="/about" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">关于</Link>
            <Link href="/contact" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">联系</Link>
          </div>
        </div>
        <div className="mt-4 text-center">
          <a
            href="https://icp.gov.moe/?keyword=20260249"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
          >
            萌ICP备20260249号
          </a>
        </div>
      </div>
    </footer>
  );
}
