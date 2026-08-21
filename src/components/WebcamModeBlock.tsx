"use client";
import { useEffect, useState } from "react";
import { Camera, Image, Sparkles, CloudRain, Snowflake, Sun, Settings } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { readBg, type BgSettingsData, DEFAULT_IMAGES } from "@/lib/bgSettings";

const DEFAULT_SETTINGS: BgSettingsData = {
  mode: "webcam",
  enabled: true,
  opacity: 80,
  interval: 6,
  blur: 0,
  customImages: [],
  activeDefaults: [true, true, true, true, true],
  activeCustom: [],
  effects: {
    firefly: true,
    sakura: true,
    grass: true,
    rain: false,
    snow: false,
  },
  theme: "system",
};

export default function BackgroundControlBlock() {
  const [settings, setSettings] = useState<BgSettingsData>(DEFAULT_SETTINGS);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // 初始化读取设置
    setSettings(readBg());

    // 监听背景设置变化
    const handleStorageChange = () => {
      setSettings(readBg());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bg-settings-changed', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bg-settings-changed', handleStorageChange);
    };
  }, [isClient]);

  const saveSettings = (newSettings: BgSettingsData) => {
    try {
      localStorage.setItem("bg-settings", JSON.stringify(newSettings));
      setSettings(newSettings);
      window.dispatchEvent(new Event('bg-settings-changed'));
      window.dispatchEvent(new CustomEvent('bg-update'));
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  const handleModeChange = (mode: "gradient" | "images" | "webcam") => {
    const newSettings = { ...settings, mode };
    // 切换到其他模式时关闭展开
    if (mode !== "images") {
      setIsExpanded(false);
    }
    saveSettings(newSettings);
  };

  const handleWeatherChange = (weather: "clear" | "rain" | "snow") => {
    const newSettings = { ...settings };

    // 重置所有天气特效
    newSettings.effects.rain = false;
    newSettings.effects.snow = false;

    // 设置选中的天气
    if (weather === "rain") {
      newSettings.effects.rain = true;
    } else if (weather === "snow") {
      newSettings.effects.snow = true;
    }

    saveSettings(newSettings);
  };

  const handleImageSelect = (index: number) => {
    const newSettings = { ...settings };
    // 禁用轮换
    newSettings.enabled = false;
    // 只激活选中的图片
    newSettings.activeDefaults = DEFAULT_IMAGES.map((_, i) => i === index);
    // 清空自定义图片激活
    newSettings.activeCustom = newSettings.customImages.map(() => false);
    saveSettings(newSettings);
  };

  const handleCustomImageSelect = (index: number) => {
    const newSettings = { ...settings };
    // 禁用轮换
    newSettings.enabled = false;
    // 清空默认图片激活
    newSettings.activeDefaults = DEFAULT_IMAGES.map(() => false);
    // 只激活选中的自定义图片
    newSettings.activeCustom = newSettings.customImages.map((_, i) => i === index);
    saveSettings(newSettings);
  };

  // 获取当前选中的图片索引
  const getSelectedImageIndex = () => {
    const defaultIndex = settings.activeDefaults.findIndex(active => active);
    if (defaultIndex !== -1) return { type: 'default', index: defaultIndex };

    const customIndex = settings.activeCustom.findIndex(active => active);
    if (customIndex !== -1) return { type: 'custom', index: customIndex };

    return { type: 'default', index: 0 };
  };

  const getCurrentWeather = () => {
    if (settings.effects.rain) return "rain";
    if (settings.effects.snow) return "snow";
    return "clear";
  };

  return (
    <CardContainer className="w-full h-full">
      <CardBody className="w-full h-full">
        <CardItem
          translateZ="50"
          className="w-full h-full"
        >
          <div
            className={`h-full w-full rounded-3xl backdrop-blur-md border shadow-xl transition-all duration-500 relative overflow-hidden
              ${settings.mode === "webcam" ? 'bg-purple-500/20 dark:bg-purple-800/30 border-purple-400/50 dark:border-purple-600/50' : 'bg-white/40 dark:bg-slate-800/40 border-white/60 dark:border-slate-600/50'}
            `}
          >
            {/* 背景光效 */}
            <div className={`absolute -right-6 -top-6 w-32 h-32 blur-3xl rounded-full transition-all duration-700 ${settings.mode === "webcam" ? 'bg-purple-500/30' : 'bg-pink-500/20'}`}></div>

            <div className="relative z-10 h-full flex flex-col p-4 overflow-y-auto max-h-full">
              {/* 标题 */}
              <div className="flex items-center justify-between mb-3">
                <CardItem translateZ="80" as="h3" className={`text-lg font-bold transition-colors duration-500 ${settings.mode === "webcam" ? 'text-purple-700 dark:text-purple-300' : 'text-slate-800 dark:text-white'}`}>
                  背景控制
                </CardItem>
                {settings.mode === "images" && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    <Settings size={16} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                )}
              </div>

              {/* 背景模式选择 */}
              <div className="flex flex-col gap-2 mb-3">
                <CardItem translateZ="70" as="p" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  背景模式
                </CardItem>
                <CardItem translateZ="60" className="flex gap-2">
                  <button
                    onClick={() => handleModeChange("webcam")}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                      settings.mode === "webcam"
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
                    }`}
                    title="摄像头模式"
                  >
                    <Camera size={14} />
                  </button>
                  <button
                    onClick={() => handleModeChange("gradient")}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                      settings.mode === "gradient"
                        ? 'bg-indigo-500 text-white shadow-lg'
                        : 'bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
                    }`}
                    title="渐变模式"
                  >
                    <Sparkles size={14} />
                  </button>
                  <button
                    onClick={() => handleModeChange("images")}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                      settings.mode === "images"
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
                    }`}
                    title="图片模式"
                  >
                    <Image size={14} />
                  </button>
                </CardItem>
              </div>

              {/* 天气特效选择 */}
              <div className="flex flex-col gap-2 mb-3">
                <CardItem translateZ="70" as="p" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  天气特效
                </CardItem>
                <CardItem translateZ="60" className="flex gap-2">
                  <button
                    onClick={() => handleWeatherChange("clear")}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                      getCurrentWeather() === "clear"
                        ? 'bg-amber-500 text-white shadow-lg'
                        : 'bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
                    }`}
                    title="晴天"
                  >
                    <Sun size={14} />
                  </button>
                  <button
                    onClick={() => handleWeatherChange("rain")}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                      getCurrentWeather() === "rain"
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
                    }`}
                    title="雨天"
                  >
                    <CloudRain size={14} />
                  </button>
                  <button
                    onClick={() => handleWeatherChange("snow")}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                      getCurrentWeather() === "snow"
                        ? 'bg-cyan-500 text-white shadow-lg'
                        : 'bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
                    }`}
                    title="雪天"
                  >
                    <Snowflake size={14} />
                  </button>
                </CardItem>
              </div>

              {/* 图片选择 - 仅在展开且为图片模式时显示 */}
              {isExpanded && settings.mode === "images" && (
                <div className="flex flex-col gap-2">
                  <CardItem translateZ="70" as="p" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    选择背景图片
                  </CardItem>
                  <CardItem translateZ="60" className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                    {/* 默认图片 */}
                    {DEFAULT_IMAGES.map((url, i) => {
                      const selected = getSelectedImageIndex();
                      const isSelected = selected.type === 'default' && selected.index === i;
                      return (
                        <button
                          key={`default-${i}`}
                          onClick={() => handleImageSelect(i)}
                          className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                            isSelected
                              ? 'bg-blue-500/20 border-2 border-blue-500'
                              : 'bg-white/40 dark:bg-slate-700/40 border-2 border-transparent hover:border-blue-300'
                          }`}
                        >
                          <img src={url} alt={`背景 ${i + 1}`} className="w-16 h-10 rounded object-cover" />
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">默认 {i + 1}</span>
                          {isSelected && (
                            <svg className="w-4 h-4 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                    {/* 自定义图片 */}
                    {settings.customImages.map((url, i) => {
                      const selected = getSelectedImageIndex();
                      const isSelected = selected.type === 'custom' && selected.index === i;
                      return (
                        <button
                          key={`custom-${i}`}
                          onClick={() => handleCustomImageSelect(i)}
                          className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                            isSelected
                              ? 'bg-blue-500/20 border-2 border-blue-500'
                              : 'bg-white/40 dark:bg-slate-700/40 border-2 border-transparent hover:border-blue-300'
                          }`}
                        >
                          <img src={url} alt={`自定义 ${i + 1}`} className="w-16 h-10 rounded object-cover" />
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">自定义 {i + 1}</span>
                          {isSelected && (
                            <svg className="w-4 h-4 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </CardItem>
                </div>
              )}

              {/* 状态显示 */}
              {!isExpanded && (
                <CardItem translateZ="60" as="p" className="text-xs text-center text-slate-600 dark:text-slate-400 mt-auto">
                  {settings.mode === "webcam" && "摄像头"}
                  {settings.mode === "gradient" && "渐变"}
                  {settings.mode === "images" && "图片"}
                  {" · "}
                  {getCurrentWeather() === "clear" && "晴天"}
                  {getCurrentWeather() === "rain" && "雨天"}
                  {getCurrentWeather() === "snow" && "雪天"}
                </CardItem>
              )}
            </div>
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
