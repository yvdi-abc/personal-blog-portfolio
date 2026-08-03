const BASE = "";
const STORAGE_KEY = "bg-settings";

export const DEFAULT_IMAGES = [
  "/bg/bg1.jpg",
  "/bg/bg2.jpg",
  "/bg/bg3.jpg",
  "/images/bg-funingna-1.png",
  "/images/bg-funingna-2.jpg"
].map((p) => BASE + p);

export interface BgSettingsData {
  mode: "gradient" | "images" | "webcam";
  enabled: boolean;
  opacity: number;
  interval: number;
  blur: number;
  customImages: string[];
  activeDefaults: boolean[];
  activeCustom: boolean[];
  // 特效开关
  effects: {
    firefly: boolean;
    sakura: boolean;
    grass: boolean;
    rain: boolean;
    snow: boolean;
  };
  // 主题模式
  theme: "light" | "dark" | "system";
}

const DEFAULTS: BgSettingsData = {
  mode: "webcam", enabled: true, opacity: 80, interval: 6, blur: 0,
  customImages: [], activeDefaults: [true, true, true, true, true], activeCustom: [],
  effects: {
    firefly: true,
    sakura: true,
    grass: true,
    rain: false,
    snow: false,
  },
  theme: "system",
};

export function readBg(): BgSettingsData {
  if (typeof window === "undefined") return structuredClone(DEFAULTS);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // 确保 activeDefaults 长度与 DEFAULT_IMAGES 一致
      if (!parsed.activeDefaults || parsed.activeDefaults.length !== DEFAULT_IMAGES.length) {
        parsed.activeDefaults = DEFAULT_IMAGES.map(() => true);
      }
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

export function getActiveImages(s: BgSettingsData): string[] {
  const defaults = DEFAULT_IMAGES.filter((_, i) => s.activeDefaults?.[i] !== false);
  const customs = (s.customImages || []).filter((_, i) => s.activeCustom?.[i] !== false);
  return [...defaults, ...customs];
}
