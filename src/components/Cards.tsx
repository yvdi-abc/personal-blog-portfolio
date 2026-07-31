"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export function BlogCard({ title, desc, date, tag, slug, index = 0 }: {
  title: string; desc: string; date: string; tag: string; slug: string; index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: "spring", damping: 18, stiffness: 100 }}
    >
      <Link href={`/blog/${slug}`}
        className="block glass rounded-2xl p-6 glass-hover group">
        <div className="flex items-center gap-3 mb-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold">{tag}</span>
          <span>{date}</span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">{desc}</p>
      </Link>
    </motion.div>
  );
}

export function ProjectCard({ name, desc, tags, icon, index = 0 }: {
  name: string; desc: string; tags: string[]; icon: string; index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: "spring", damping: 18, stiffness: 100 }}
      className="glass rounded-2xl p-6 glass-hover group cursor-pointer"
    >
      <div className="text-3xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">{icon}</div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{name}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold">
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function SectionTitle({ label, title, desc }: { label: string; title: string; desc?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="mb-8"
    >
      <span className="text-xs font-bold tracking-widest text-teal-600 dark:text-teal-400 uppercase">{label}</span>
      <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mt-1">{title}</h2>
      {desc && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">{desc}</p>}
    </motion.div>
  );
}
