export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden zi-fx">
      {/* Subtle gradient sheen — very faint */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10 transition-opacity duration-1000"
        style={{
          background: "linear-gradient(-45deg, #14b8a6, #06b6d4, #0ea5e9, #10b981, #f59e0b)",
          backgroundSize: "400% 400%",
          animation: "gradientMove 15s ease infinite",
        }}
      />
      {/* Minimal ambient lift for glass readability */}
      <div className="absolute inset-0 bg-white/10 dark:bg-slate-900/20 transition-colors duration-1000" />
      {/* Ambient blobs — behind glass for depth */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-teal-400/20 dark:bg-teal-500/15 blur-[120px] rounded-full animate-[float-slow_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-cyan-400/20 dark:bg-cyan-500/15 blur-[120px] rounded-full animate-[float-slower_12s_ease-in-out_infinite]" />
      <div className="absolute top-[30%] left-[25%] w-[25%] h-[25%] bg-amber-300/15 dark:bg-amber-400/10 blur-[100px] rounded-full animate-[float-slow_10s_ease-in-out_infinite_reverse]" />
    </div>
  );
}
