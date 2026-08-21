"use client";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/Cards";
import { siteConfig } from "@/siteConfig";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const btn = e.currentTarget.querySelector("button")!;
    btn.textContent = "✓ 已发送";
    btn.setAttribute("disabled", "true");
    setTimeout(() => { btn.textContent = "发送消息 →"; btn.removeAttribute("disabled"); }, 2500);
  };

  const contactItems = [
    {
      icon: "✉️",
      label: "邮箱",
      value: siteConfig.social.email,
      link: `mailto:${siteConfig.social.email}`
    },
    {
      icon: "🐙",
      label: "GitHub",
      value: siteConfig.social.github.replace('https://', ''),
      link: siteConfig.social.github
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-[90%] max-w-4xl mx-auto mt-24 md:mt-28 px-4 pb-32 relative z-10">
      <SectionTitle label="Contact" title="联系我" desc="期待与你的交流" />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {contactItems.map((item, i) => (
            <motion.a
              key={item.label}
              href={item.link}
              target={item.link.startsWith('http') ? "_blank" : undefined}
              rel={item.link.startsWith('http') ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className="glass rounded-xl p-4 flex items-center gap-4 hover:translate-x-1 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-lg">{item.icon}</div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{item.label}</div>
                <div className="text-sm font-bold text-slate-800 dark:text-white">{item.value}</div>
              </div>
            </motion.a>
          ))}
        </div>
        <motion.form onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ type: "spring" }}
          className="glass rounded-2xl p-6 space-y-4">
          <div><input type="text" placeholder="你的名字" required className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-white/5 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50" /></div>
          <div><input type="email" placeholder="your@email.com" required className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-white/5 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50" /></div>
          <div><textarea rows={4} placeholder="想说的话..." required className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-700/50 border border-white/30 dark:border-white/5 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none" /></div>
          <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-sm hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/25 active:scale-95">
            发送消息 →
          </button>
        </motion.form>
      </div>
    </motion.div>
  );
}
