"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIAssistant() {
  const [isPetted, setIsPetted] = useState(false);
  const [speech, setSpeech] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const chatTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 说话功能
  const speak = (text: string, duration = 6000) => {
    setSpeech(text);
    if (chatTimeoutRef.current) clearTimeout(chatTimeoutRef.current);
    chatTimeoutRef.current = setTimeout(() => {
      setSpeech(null);
    }, duration);
  };

  // 摸一摸
  const handlePet = () => {
    if (isPetted) return;
    setIsPetted(true);
    const petResponses = [
      "嘿嘿，好舒服~",
      "主人好温柔呢~",
      "呜...好开心！",
      "再摸一下嘛~",
    ];
    speak(petResponses[Math.floor(Math.random() * petResponses.length)], 2000);
    setTimeout(() => {
      setIsPetted(false);
    }, 2000);
  };

  // 喂食互动
  const handleFeed = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isThinking) return;

    setShowInput(false);
    setIsThinking(true);
    speak("谢谢你！让我想想说点什么...", 6000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "主人刚刚给我好吃的了！我要表达一下感谢~" }),
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      speak(data.reply, 8000);
    } catch (error) {
      speak("哎呀，我好像卡壳了...", 4000);
    } finally {
      setIsThinking(false);
    }
  };

  // 发送聊天
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isThinking) return;

    const userMessage = inputValue;
    setInputValue('');
    setShowInput(false);
    setIsThinking(true);
    speak("让我想想...", 10000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      speak(data.reply, 8000);
    } catch (error) {
      speak("网络好像有点问题呢~", 4000);
    } finally {
      setIsThinking(false);
    }
  };

  // 随机说话
  useEffect(() => {
    const randomMessages = [
      "今天过得怎么样呀~",
      "要不要和我聊聊天？",
      "有什么我能帮忙的吗？",
      "记得多休息哦，主人~",
      "写代码累了就歇会儿吧~",
      "主人真努力呢！",
      "陪我玩一会儿嘛~",
      "要不要吃点什么？",
    ];
    const randomTalkInterval = setInterval(() => {
      if (!speech && !showInput && !isThinking && Math.random() > 0.85) {
        const randomMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        speak(randomMsg, 4000);
      }
    }, 25000);

    return () => clearInterval(randomTalkInterval);
  }, [speech, showInput, isThinking]);

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.1, cursor: "grabbing" }}
      className="fixed bottom-20 right-20 z-[9998] flex flex-col items-center group cursor-grab active:cursor-grabbing"
    >
      {/* 聊天气泡 */}
      <div className="relative w-full flex justify-center mb-6">
        <AnimatePresence>
          {speech && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="absolute bottom-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-700 dark:text-gray-200 px-4 py-3 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 text-sm max-w-[240px] break-words text-center leading-relaxed"
              style={{ pointerEvents: 'none', transformOrigin: 'bottom center' }}
            >
              {speech}
              <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white/90 dark:bg-slate-800/90 border-b border-r border-gray-200 dark:border-slate-700 transform rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 助手本体 & 交互按钮区 */}
      <div className="relative">
        {/* 交互按钮 */}
        <div className="absolute -left-14 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
          {/* 聊天按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowInput(!showInput);
            }}
            className="bg-white/90 dark:bg-slate-700/90 p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-slate-600 text-blue-500 hover:text-blue-600 flex items-center justify-center backdrop-blur-sm"
            title="聊天"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
            </svg>
          </motion.button>

          {/* 喂食按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFeed}
            disabled={isThinking}
            className={`bg-white/90 dark:bg-slate-700/90 p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-slate-600 flex items-center justify-center backdrop-blur-sm ${isThinking ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="投喂"
          >
            <span className="text-xl leading-none">🍰</span>
          </motion.button>
        </div>

        {/* 助手头像 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-[120px] h-[120px] relative cursor-pointer"
          onClick={handlePet}
        >
          {/* 背景光晕 */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 blur-xl opacity-50 animate-pulse"></div>

          {/* 头像容器 */}
          <div className={`relative w-full h-full rounded-full bg-white shadow-2xl overflow-hidden transition-transform border-4 border-white/50 ${isPetted ? 'animate-bounce' : ''} ${isThinking ? 'animate-pulse' : ''}`}>
            {/* 二次元少女头像 */}
            <img
              src="/images/ai-assistant.png"
              alt="AI Assistant"
              className="w-full h-full object-cover"
              style={{
                objectPosition: 'center 30%',
                transform: 'scale(1.3)'
              }}
            />

            {/* 装饰元素 - 星星 */}
            {isPetted && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], y: -30, scale: [0, 1.2, 0] }}
                  transition={{ duration: 1 }}
                  className="absolute -top-2 -left-2 text-2xl z-10"
                >
                  ✨
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], y: -30, scale: [0, 1.2, 0] }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="absolute -top-2 -right-2 text-2xl z-10"
                >
                  💕
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], y: -25, scale: [0, 1, 0] }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 text-xl z-10"
                >
                  ✧
                </motion.div>
              </>
            )}

            {/* 思考时的气泡 */}
            {isThinking && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -top-4 -right-4 text-3xl z-10"
              >
                💭
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* 输入框 */}
      <AnimatePresence>
        {showInput && (
          <motion.form
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            onSubmit={handleChatSubmit}
            className="absolute -bottom-16 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-1.5 rounded-full shadow-xl flex items-center border border-gray-200 dark:border-slate-700 w-64 z-20"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="跟我聊聊吧..."
              className="bg-transparent border-none outline-none text-sm px-3 py-1 w-full dark:text-white placeholder-gray-400"
              disabled={isThinking}
              autoFocus
            />
            <button
              type="submit"
              disabled={isThinking || !inputValue.trim()}
              className={`rounded-full p-1.5 ml-1 flex items-center justify-center transition-colors ${
                isThinking || !inputValue.trim() ? 'bg-gray-300 text-gray-500' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
              </svg>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
