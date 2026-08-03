"use client";

import { useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { readBg } from '@/lib/bgSettings';

export default function WebcamModeTip() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 检查是否已关闭提示
    const dismissed = localStorage.getItem('webcam-tip-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // 检查当前背景模式
    const settings = readBg();
    if (settings.mode !== 'webcam') {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('webcam-tip-dismissed', 'true');
  };

  const handleTry = () => {
    // 直接关闭提示，用户可以通过背景控制组件切换模式
    handleDismiss();
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-[90%]"
        >
          <div className="relative rounded-2xl bg-gradient-to-br from-indigo-500/90 to-purple-600/90 backdrop-blur-xl border border-white/20 shadow-2xl p-4 overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

            {/* 关闭按钮 */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-10"
            >
              <X size={14} className="text-white" />
            </button>

            <div className="relative z-10 flex items-start gap-4">
              {/* 图标 */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Camera size={24} className="text-white" />
              </div>

              {/* 内容 */}
              <div className="flex-1 pt-1">
                <h3 className="text-white font-bold text-base mb-1">
                  背景不够美？试试这个 ✨
                </h3>
                <p className="text-white/80 text-sm mb-3 leading-relaxed">
                  开启摄像头像素网格模式，体验超酷的 3D 动态背景效果
                </p>

                {/* 按钮 */}
                <button
                  onClick={handleTry}
                  className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
                >
                  立即体验
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
