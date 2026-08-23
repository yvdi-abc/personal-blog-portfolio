"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Friend } from '@/lib/content-repository';
import { siteConfig } from "@/siteConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

// 根据友链名称自动分类
function categorizeFriends(friends: Friend[]) {
  const techKeywords = ['GitHub', 'MDN', 'React', 'Next.js', 'TypeScript', 'Tailwind'];
  const personalKeywords = ['闲云', '博客', '小站'];

  const tech: Friend[] = [];
  const personal: Friend[] = [];
  const others: Friend[] = [];

  friends.forEach(friend => {
    if (techKeywords.some(kw => friend.name.includes(kw))) {
      tech.push(friend);
    } else if (personalKeywords.some(kw => friend.name.includes(kw)) || friend.url.includes('blog') || friend.url.includes('btllk')) {
      personal.push(friend);
    } else {
      others.push(friend);
    }
  });

  return { tech, personal, others };
}

function FriendCard({ friend }: { friend: Friend }) {
  return (
    <motion.div variants={itemVariants} className="h-full">
      <a
        href={friend.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        <Card className="h-full glass glass-hover group transition-all hover:shadow-xl hover:scale-[1.02] relative overflow-hidden">
          {/* 光晕效果 */}
          <div
            className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ backgroundColor: friend.themeColor }}
          />

          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-indigo-500/50 to-purple-500/50 shadow-md group-hover:rotate-[360deg] transition-transform duration-1000 ease-in-out flex-shrink-0">
                <img src={friend.avatar} alt={friend.name} className="w-full h-full rounded-full object-cover bg-white" />
              </div>

              <div className="flex-1 overflow-hidden">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {friend.name}
                </h3>
                <Badge variant="secondary" className="mt-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse mr-1"></span>
                  Online
                </Badge>
              </div>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-2">
              {friend.description}
            </p>
          </CardContent>
        </Card>
      </a>
    </motion.div>
  );
}

export default function FriendsBoard({ friends }: { friends: Friend[] }) {
  const [isCopied, setIsCopied] = useState(false);
  const { tech, personal, others } = categorizeFriends(friends);
  const allFriends = friends;

  const applyFormat = `名称：${siteConfig.author.name}
网址：${typeof window !== 'undefined' ? window.location.origin : 'https://your-site.com'}
头像：${typeof window !== 'undefined' ? window.location.origin : 'https://your-site.com'}/avatar.jpg
简介：${siteConfig.bio}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(applyFormat);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-10 py-6 md:py-10 relative z-10 scroll-smooth">

      {/* 标题 */}
      <div className="mb-8 md:mb-12 text-center md:text-left w-full px-2 md:px-0">
        <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 md:mb-4 tracking-widest drop-shadow-sm uppercase">
          云端引力
        </h1>
        <p className="text-xs md:text-base text-slate-600 dark:text-slate-400 font-serif">
          那些散落在赛博宇宙各处的有趣灵魂与神经节点。
        </p>
      </div>

      {/* Tabs 分类展示 */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="glass mb-6">
          <TabsTrigger value="all">全部 ({allFriends.length})</TabsTrigger>
          <TabsTrigger value="tech">技术 ({tech.length})</TabsTrigger>
          <TabsTrigger value="personal">博客 ({personal.length})</TabsTrigger>
          {others.length > 0 && <TabsTrigger value="others">其他 ({others.length})</TabsTrigger>}
        </TabsList>

        <TabsContent value="all">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {allFriends.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="tech">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {tech.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="personal">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {personal.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </motion.div>
        </TabsContent>

        {others.length > 0 && (
          <TabsContent value="others">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {others.map((friend) => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
            </motion.div>
          </TabsContent>
        )}
      </Tabs>

      {/* 申请友链引导区 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="mt-14 md:mt-20 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl md:rounded-3xl p-5 md:p-8 max-w-3xl mx-auto text-center shadow-lg md:shadow-xl relative"
      >
        <h2 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white mb-2 md:mb-4 tracking-wider">
          ✨ 建立神经连接
        </h2>
        <p className="text-xs md:text-base text-slate-600 dark:text-slate-400 font-serif mb-4 md:mb-6">
          欢迎交换友链！请一键复制下方格式，并在底部留言板申请：
        </p>

        {/* 代码展示框 */}
        <div className="relative bg-slate-100/60 dark:bg-slate-900/60 rounded-xl md:rounded-2xl p-4 md:p-5 text-left inline-block w-full max-w-md border border-slate-200/50 dark:border-slate-700/50 group overflow-hidden">
          <pre className="font-mono text-[10px] md:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all pr-8 md:pr-10">
            {applyFormat}
          </pre>

          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 transition-all duration-300 shadow-sm backdrop-blur-sm"
            title="一键复制"
          >
            {isCopied ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-500 hover:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
              </svg>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
          💬 在联系页面留言申请即可
        </p>
      </motion.div>

    </div>
  );
}
