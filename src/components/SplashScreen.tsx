"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const shapes = ["●", "■", "▲", "◆", "⬟", "◉"];

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    try { if (sessionStorage.getItem("splash-seen") === "true") setVisible(false); } catch {}
  }, []);

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => {
      try { sessionStorage.setItem("splash-seen", "true"); } catch {}
      setVisible(false);
    }, 900);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden cursor-pointer zi-splash"
          style={{ background: "linear-gradient(135deg, #0c0c14 0%, #14142a 50%, #0c0c14 100%)" }}
          onClick={handleEnter}
        >
          {shapes.map((s, i) => (
            <motion.div key={i}
              className="absolute text-teal-500/20 dark:text-teal-400/15 font-bold select-none pointer-events-none"
              style={{ fontSize: 20 + i * 12, left: `${10 + i * 12}%`, top: `${15 + i * 10}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0.12, 0.3, 0.12], scale: [1, 1.2, 1], x: [0, Math.random() * 60 - 30], y: [0, Math.random() * 60 - 30] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            >{s}</motion.div>
          ))}

          <motion.div className="absolute w-72 h-72 rounded-full border border-teal-500/10 pointer-events-none"
            animate={{ scale: [1, 1.08, 1], rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
          <motion.div className="absolute w-56 h-56 rounded-full border border-cyan-500/10 pointer-events-none"
            animate={{ scale: [1, 1.12, 1], rotate: [360, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />

          <div className="relative z-10 text-center px-6 pointer-events-none">
            <motion.div className="mb-6">
              {"Yuxi.Wang".split("").map((ch, i) => (
                <motion.span key={i}
                  className="inline-block text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight"
                  initial={{ opacity: 0, y: -80, rotateZ: -30, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, rotateZ: 0, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, type: "spring", damping: 7, stiffness: 90, mass: 0.5 }}
                  style={{ color: ch === "." ? "#14b8a6" : undefined }}
                >{ch === " " ? " " : ch}</motion.span>
              ))}
            </motion.div>

            <motion.p initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring", damping: 10, stiffness: 80 }}
              className="text-lg md:text-xl text-teal-400/70 font-light tracking-wider mb-12"
            >全栈开发 · 独立创作</motion.p>

            <motion.button onClick={(e) => { e.stopPropagation(); handleEnter(); }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, type: "spring", damping: 10, stiffness: 80 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.88 }}
              className="relative px-10 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-teal-500/30 text-teal-300 font-bold text-sm tracking-widest uppercase overflow-hidden group pointer-events-auto"
            >
              <motion.span className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-teal-500/20"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
              <span className="relative z-10 flex items-center gap-2">
                探索空间
                <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}>
                  →
                </motion.span>
              </span>
            </motion.button>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 text-xs text-white/15 tracking-widest pointer-events-none"
          >click anywhere to explore</motion.p>
        </motion.div>
      )}

      {exiting && (
        <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1, originY: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 "
          style={{ background: "linear-gradient(180deg, #0c0c14, #14b8a6, #0c0c14)" }}
        >
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 0.3, duration: 0.4 }}
            className="flex items-center justify-center h-full">
            <motion.span className="text-4xl text-white font-black"
              animate={{ scale: [1, 1.5, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >✦</motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
