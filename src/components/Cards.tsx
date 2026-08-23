"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ExternalLink } from "lucide-react";

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
      <Link href={`/blog/${slug}`}>
        <Card className="glass glass-hover group transition-all hover:shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="secondary" className="bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20">
                {tag}
              </Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400">{date}</span>
            </div>
            <CardTitle className="group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="line-clamp-2">{desc}</CardDescription>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export function ProjectCard({ name, desc, tags, icon, link, index = 0 }: {
  name: string; desc: string; tags: string[]; icon: string; link?: string; index?: number;
}) {
  const CardWrapper = link ? HoverCard : "div";

  const cardContent = (
    <Card className="glass glass-hover group transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer h-full">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="text-4xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
            {icon}
          </div>
          {link && (
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors" />
          )}
        </div>
        <CardTitle className="group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="leading-relaxed">{desc}</CardDescription>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Badge key={t} variant="secondary" className="bg-teal-500/10 text-teal-600 dark:text-teal-400">
              {t}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: "spring", damping: 18, stiffness: 100 }}
      className="h-full"
    >
      {link ? (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              {cardContent}
            </a>
          </HoverCardTrigger>
          <HoverCardContent className="w-80" side="top">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">🔗 项目链接</h4>
              <p className="text-xs text-muted-foreground break-all">{link}</p>
              <p className="text-xs text-teal-600 dark:text-teal-400">点击卡片访问项目</p>
            </div>
          </HoverCardContent>
        </HoverCard>
      ) : (
        cardContent
      )}
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
