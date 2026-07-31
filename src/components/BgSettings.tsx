"use client";
import { useState, useEffect, useRef } from "react";

const BASE = "";
const STORAGE_KEY = "bg-settings";
export const DEFAULT_IMAGES = ["/bg/bg1.jpg", "/bg/bg2.jpg", "/bg/bg3.jpg"].map((p) => BASE + p);

export interface BgSettingsData {
  mode: "gradient" | "images";
  enabled: boolean;
  opacity: number;
  interval: number;
  blur: number;
  customImages: string[];
  activeDefaults: boolean[];
  activeCustom: boolean[];
}

const DEFAULTS: BgSettingsData = {
  mode: "images", enabled: true, opacity: 20, interval: 6, blur: 8,
  customImages: [], activeDefaults: [true, true, true], activeCustom: [],
};

export function readBg(): BgSettingsData {
  if (typeof window === "undefined") return structuredClone(DEFAULTS);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.activeDefaults) parsed.activeDefaults = [true, true, true];
      if (!parsed.activeCustom) parsed.activeCustom = [];

      // 自动修复旧的高透明度设置
      if (parsed.opacity && parsed.opacity > 30) {
        parsed.opacity = 20;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }

      return { ...DEFAULTS, ...parsed };
    }
  } catch {}
  return structuredClone(DEFAULTS);
}

export const BG_UPDATE_EVENT = "bg-update";

function compressImage(file: File, maxDim = 800): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * ratio); h = Math.round(h * ratio);
        }
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d")!.drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL("image/jpeg", 0.75));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function saveSafe(data: BgSettingsData): boolean {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; }
  catch {
    if (data.customImages.length > 0) {
      const sorted = [...data.customImages].sort((a, b) => b.length - a.length);
      data.customImages = data.customImages.filter((u) => u !== sorted[0]);
      data.activeCustom = data.activeCustom.slice(0, data.customImages.length);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; } catch {}
    }
    return false;
  }
}

interface Props { open: boolean; onClose: () => void; }

export function getActiveImages(s: BgSettingsData): string[] {
  const defaults = DEFAULT_IMAGES.filter((_, i) => s.activeDefaults?.[i] !== false);
  const customs = (s.customImages || []).filter((_, i) => s.activeCustom?.[i] !== false);
  return [...customs, ...defaults];
}

export default function BgSettingsPanel({ open, onClose }: Props) {
  const [settings, setSettings] = useState<BgSettingsData>(structuredClone(DEFAULTS));
  const [storageError, setStorageError] = useState("");
  const init = useRef(false);

  // 只在面板打开时初始化
  useEffect(() => {
    if (!open) return;
    if (init.current) return;
    init.current = true;
    const data = readBg();
    setSettings(data);
  }, [open]);

  // 监听设置变化并保存
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!saveSafe(settings)) {
      setStorageError("存储空间不足，已自动清理旧图片");
      setTimeout(() => setStorageError(""), 3000);
    } else setStorageError("");
    requestAnimationFrame(() => window.dispatchEvent(new CustomEvent(BG_UPDATE_EVENT)));
  }, [settings]);

  const update = (partial: Partial<BgSettingsData>) =>
    setSettings((prev) => ({ ...prev, ...partial }));

  const toggleDefault = (idx: number) => {
    const arr = [...settings.activeDefaults];
    const allDefaults = DEFAULT_IMAGES.filter((_, i) => i === idx ? !arr[idx] : arr[i]);
    const allCustoms = (settings.customImages || []).filter((_, i) => settings.activeCustom?.[i] !== false);
    if (allDefaults.length + allCustoms.length < 1) return;
    arr[idx] = !arr[idx];
    update({ activeDefaults: arr });
  };

  const toggleCustom = (idx: number) => {
    const arr = [...(settings.activeCustom || [])];
    while (arr.length < settings.customImages.length) arr.push(true);
    const allDefaults = DEFAULT_IMAGES.filter((_, i) => settings.activeDefaults?.[i] !== false);
    const allCustoms = settings.customImages.filter((_, i) => i === idx ? !(arr[i] ?? true) : (arr[i] ?? true));
    if (allDefaults.length + allCustoms.length < 1) return;
    arr[idx] = !(arr[idx] ?? true);
    update({ activeCustom: arr });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const currentSize = JSON.stringify(settings).length;
    if (currentSize > 3_000_000) {
      setStorageError("存储空间将满，请先删除部分旧图片");
      setTimeout(() => setStorageError(""), 3000); return;
    }
    const urls: string[] = [];
    for (const f of files) urls.push(await compressImage(f, 600));
    const newActive = [...(settings.activeCustom || []).slice(0, settings.customImages.length), ...urls.map(() => true)];
    update({ customImages: [...settings.customImages, ...urls], activeCustom: newActive });
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    const newImages = settings.customImages.filter((_, i) => i !== idx);
    const newActive = settings.activeCustom.filter((_, i) => i !== idx);
    update({ customImages: newImages, activeCustom: newActive });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex zi-overlay" onClick={onClose}>
      <div className="flex-1" />
      <div className="w-80 max-w-[90vw] h-full glass overflow-y-auto p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-slate-800 dark:text-white">显示设置</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-teal-500 text-white text-xs font-bold hover:bg-amber-500 transition-colors">✕</button>
        </div>

        {storageError && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold">{storageError}</div>
        )}

        <div className="mb-6 p-3 rounded-xl bg-white/30 dark:bg-slate-700/30">
          <div className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">背景模式</div>
          <div className="flex gap-2">
            <button onClick={() => update({ mode: "gradient" })}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${settings.mode === "gradient" ? "bg-teal-500 text-white shadow" : "bg-white/40 dark:bg-slate-600/40 text-slate-600 dark:text-slate-300"}`}>渐变</button>
            <button onClick={() => update({ mode: "images" })}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${settings.mode === "images" ? "bg-teal-500 text-white shadow" : "bg-white/40 dark:bg-slate-600/40 text-slate-600 dark:text-slate-300"}`}>图片轮换</button>
          </div>
        </div>

        {settings.mode === "images" && (
          <>
            <div className="flex items-center justify-between mb-6 p-3 rounded-xl bg-white/30 dark:bg-slate-700/30">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">自动轮换</span>
              <button onClick={() => update({ enabled: !settings.enabled })}
                className={`w-12 h-6 rounded-full transition-colors ${settings.enabled ? "bg-teal-500" : "bg-slate-400"}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.enabled ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>

            <div className="mb-6 p-3 rounded-xl bg-white/30 dark:bg-slate-700/30">
              <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                <span>切换间隔</span><span>{settings.interval}s</span>
              </div>
              <input type="range" min={3} max={20} value={settings.interval}
                onChange={(e) => update({ interval: Number(e.target.value) })} className="w-full accent-teal-500" />
            </div>
          </>
        )}

        <div className="mb-6 p-3 rounded-xl bg-white/30 dark:bg-slate-700/30">
          <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
            <span>遮罩透明度</span><span>{settings.opacity}%</span>
          </div>
          <input type="range" min={0} max={80} value={settings.opacity}
            onChange={(e) => update({ opacity: Number(e.target.value) })} className="w-full accent-teal-500" />
        </div>

        <div className="mb-6 p-3 rounded-xl bg-white/30 dark:bg-slate-700/30">
          <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
            <span>毛玻璃强度</span><span>{settings.blur}px</span>
          </div>
          <input type="range" min={0} max={15} value={settings.blur}
            onChange={(e) => update({ blur: Number(e.target.value) })} className="w-full accent-teal-500" />
          <div className="flex justify-between text-xs text-slate-400 mt-1"><span>清晰</span><span>模糊</span></div>
        </div>

        {settings.mode === "images" && (
          <>
            <div className="mb-4 p-3 rounded-xl bg-white/30 dark:bg-slate-700/30">
              <div className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">选择背景图</div>
              <div className="space-y-2">
                {DEFAULT_IMAGES.map((url, i) => (
                  <div key={url} className="flex items-center gap-2 p-1.5 rounded-lg bg-white/20 dark:bg-slate-700/20 cursor-pointer"
                    onClick={() => toggleDefault(i)}>
                    <img src={url} alt="" className="w-10 h-7 rounded object-cover flex-shrink-0" />
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex-1">默认{i + 1}</span>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${settings.activeDefaults[i] ? "bg-teal-500 border-teal-500" : "border-slate-400"}`}>
                      {settings.activeDefaults[i] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </div>
                ))}
                {settings.customImages.map((url, i) => (
                  <div key={url} className="flex items-center gap-2 p-1.5 rounded-lg bg-white/20 dark:bg-slate-700/20">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer flex-shrink-0 transition-all ${(settings.activeCustom[i] ?? true) ? "bg-teal-500 border-teal-500" : "border-slate-400"}`}
                      onClick={() => toggleCustom(i)}>
                      {(settings.activeCustom[i] ?? true) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <img src={url} alt="" className="w-10 h-7 rounded object-cover flex-shrink-0" />
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate flex-1">上传{i + 1}</span>
                    <button onClick={() => removeImage(i)} className="text-xs text-red-500 hover:text-red-600 font-bold flex-shrink-0">✕</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4 p-3 rounded-xl bg-white/30 dark:bg-slate-700/30">
              <label className="block w-full py-2 px-3 rounded-lg bg-teal-500 text-white text-xs font-bold text-center cursor-pointer hover:bg-teal-600 transition-colors">
                + 添加图片
                <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
              </label>
              <p className="text-xs text-slate-400 mt-1">点击选择，自动压缩至 600px</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
