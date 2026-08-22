"use client";

import { useEffect, useState } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // 检测屏幕宽度和触摸设备
      const mobileWidth = window.innerWidth < 768;
      const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(mobileWidth || touchDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}
