"use client";

import { useState } from 'react';
import { Send } from 'lucide-react';

const PRESET_COLORS = [
  { name: '白色', value: '#FFFFFF' },
  { name: '红色', value: '#FF6B6B' },
  { name: '橙色', value: '#FFA94D' },
  { name: '黄色', value: '#FFD43B' },
  { name: '绿色', value: '#51CF66' },
  { name: '青色', value: '#22B8CF' },
  { name: '蓝色', value: '#4C6EF5' },
  { name: '紫色', value: '#9775FA' },
  { name: '粉色', value: '#F783AC' },
];

export default function DanmakuSender() {
  const [text, setText] = useState('');
  const [color, setColor] = useState('#FFFFFF');
  const [fontSize, setFontSize] = useState(18);

  const sendDanmaku = () => {
    if (!text.trim()) return;

    // 创建弹幕元素
    const danmaku = document.createElement('div');
    danmaku.textContent = text;
    danmaku.style.cssText = `
      position: fixed;
      top: ${Math.random() * 60 + 10}vh;
      right: -100%;
      color: ${color};
      font-size: ${fontSize}px;
      font-weight: bold;
      white-space: nowrap;
      z-index: 9998;
      pointer-events: none;
      text-shadow:
        -1px -1px 0 rgba(0,0,0,0.8),
        1px -1px 0 rgba(0,0,0,0.8),
        -1px 1px 0 rgba(0,0,0,0.8),
        1px 1px 0 rgba(0,0,0,0.8),
        0 0 10px rgba(0,0,0,0.5);
      animation: danmaku-scroll ${8 + Math.random() * 4}s linear forwards;
    `;

    // 添加动画样式（如果还没有）
    if (!document.getElementById('danmaku-style')) {
      const style = document.createElement('style');
      style.id = 'danmaku-style';
      style.textContent = `
        @keyframes danmaku-scroll {
          from {
            right: -100%;
          }
          to {
            right: 100%;
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(danmaku);

    // 动画结束后移除元素
    danmaku.addEventListener('animationend', () => {
      danmaku.remove();
    });

    // 清空输入
    setText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendDanmaku();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 输入区 */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
          弹幕内容
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入弹幕内容... (Enter发送)"
          rows={3}
          maxLength={50}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="text-[10px] text-slate-400 text-right">
          {text.length}/50
        </div>
      </div>

      {/* 颜色选择 */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
          弹幕颜色
        </label>
        <div className="grid grid-cols-5 gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 flex items-center justify-center ${
                color === c.value
                  ? 'border-indigo-500 ring-2 ring-indigo-500/50'
                  : 'border-slate-300 dark:border-slate-600'
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            >
              {color === c.value && (
                <svg className="w-4 h-4 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 字体大小 */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
          字体大小: {fontSize}px
        </label>
        <input
          type="range"
          min="12"
          max="20"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>12px</span>
          <span>16px</span>
          <span>20px</span>
        </div>
      </div>

      {/* 预览 */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 min-h-[60px] flex items-center justify-center">
        <div
          style={{
            color: color,
            fontSize: `${fontSize}px`,
            textShadow: '-1px -1px 0 rgba(0,0,0,0.8), 1px -1px 0 rgba(0,0,0,0.8), -1px 1px 0 rgba(0,0,0,0.8), 1px 1px 0 rgba(0,0,0,0.8)'
          }}
          className="font-bold"
        >
          {text || '预览效果'}
        </div>
      </div>

      {/* 发送按钮 */}
      <button
        onClick={sendDanmaku}
        disabled={!text.trim()}
        className="w-full px-4 py-3 bg-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Send size={16} />
        发送弹幕
      </button>

      {/* 提示 */}
      <div className="text-[10px] text-slate-400 text-center leading-relaxed">
        💡 弹幕会从右向左飘过屏幕<br/>
        每条弹幕会自动消失
      </div>
    </div>
  );
}
