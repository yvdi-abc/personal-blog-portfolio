"use client";
import { useState, useEffect } from "react";
import BgSettingsPanel, { readBg, applyBlur } from "./BgSettings";
import { Settings } from "lucide-react";

export default function BgSettingsButton() {
  const [open, setOpen] = useState(false);

  // 页面加载时应用保存的模糊度设置
  useEffect(() => {
    const settings = readBg();
    applyBlur(settings.blur);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-28 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 dark:from-teal-500 dark:to-cyan-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-40"
        title="背景设置"
      >
        <Settings size={20} />
      </button>
      <BgSettingsPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
