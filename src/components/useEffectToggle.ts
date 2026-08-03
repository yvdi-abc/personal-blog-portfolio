// 统一的特效开关hook
import { useEffect, useState } from 'react';
import { readBg, BG_UPDATE_EVENT } from '@/lib/bgSettings';

export function useEffectToggle(effectName: 'firefly' | 'sakura' | 'grass' | 'rain' | 'snow') {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const updateEnabled = () => {
      const settings = readBg();
      setEnabled(settings.effects?.[effectName] !== false);
    };

    updateEnabled();
    window.addEventListener(BG_UPDATE_EVENT, updateEnabled);
    return () => window.removeEventListener(BG_UPDATE_EVENT, updateEnabled);
  }, [effectName]);

  return enabled;
}
