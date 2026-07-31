"use client";
import { useState } from "react";
import BgSettingsPanel from "./BgSettings";
import { Settings } from "lucide-react";

export default function BgSettingsButton() {
  const [open, setOpen] = useState(false);

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
