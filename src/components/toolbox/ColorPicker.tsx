"use client";

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function ColorPicker() {
  const [color, setColor] = useState('#6366f1');
  const [copied, setCopied] = useState(false);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgb = hexToRgb(color);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : { h: 0, s: 0, l: 0 };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presetColors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#ef4444', '#f59e0b', '#10b981', '#14b8a6',
    '#06b6d4', '#3b82f6', '#6b7280', '#000000'
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* 颜色预览 */}
      <div className="relative">
        <div
          className="w-full h-32 rounded-2xl border-4 border-white dark:border-slate-700 shadow-lg"
          style={{ backgroundColor: color }}
        />
        <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-white">
          {color.toUpperCase()}
        </div>
      </div>

      {/* 颜色选择器 */}
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-12 rounded-lg border-2 border-slate-300 dark:border-slate-600 cursor-pointer"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white uppercase font-mono"
        />
      </div>

      {/* 色值信息 */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <button
          onClick={() => copyToClipboard(color)}
          className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-between group"
        >
          <span className="font-mono font-bold text-slate-700 dark:text-slate-200">HEX</span>
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-slate-400 group-hover:text-slate-600" />}
        </button>
        <button
          onClick={() => copyToClipboard(rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '')}
          className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-between group"
        >
          <span className="font-mono font-bold text-slate-700 dark:text-slate-200">RGB</span>
          <Copy size={12} className="text-slate-400 group-hover:text-slate-600" />
        </button>
        <button
          onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
          className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-between group"
        >
          <span className="font-mono font-bold text-slate-700 dark:text-slate-200">HSL</span>
          <Copy size={12} className="text-slate-400 group-hover:text-slate-600" />
        </button>
      </div>

      {/* RGB/HSL 详细值 */}
      <div className="text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg space-y-1 font-mono">
        <div className="text-slate-600 dark:text-slate-400">
          RGB: <span className="text-slate-900 dark:text-white">{rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '-'}</span>
        </div>
        <div className="text-slate-600 dark:text-slate-400">
          HSL: <span className="text-slate-900 dark:text-white">{`${hsl.h}°, ${hsl.s}%, ${hsl.l}%`}</span>
        </div>
      </div>

      {/* 预设颜色 */}
      <div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-bold">快速选择</div>
        <div className="grid grid-cols-6 gap-2">
          {presetColors.map(presetColor => (
            <button
              key={presetColor}
              onClick={() => setColor(presetColor)}
              className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                color === presetColor ? 'border-white ring-2 ring-indigo-500' : 'border-slate-300 dark:border-slate-600'
              }`}
              style={{ backgroundColor: presetColor }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
