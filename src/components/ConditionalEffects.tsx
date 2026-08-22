"use client";

import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';
import BackgroundSlider from './BackgroundSlider';
import ParticleBackground from './ParticleBackground';
import DanmakuBackground from './DanmakuBackground';
import FireflyEffect from './FireflyEffect';
import SakuraEffect from './SakuraEffect';
import WindyGrass from './WindyGrass';
import RainEffect from './RainEffect';
import GlobalSnow from './GlobalSnow';
import WeatherEffects from './WeatherEffects';
import BackgroundEffects from './BackgroundEffects';
import CursorEffect from './CursorEffect';
import ClickEffect from './ClickEffect';

export default function ConditionalEffects() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <>
      {/* 核心背景 - 所有设备 */}
      <BackgroundSlider />
      <BackgroundEffects />

      {/* 轻量特效 - 所有设备 */}
      <ClickEffect />

      {/* 中量特效 - 桌面端 */}
      {!isMobile && (
        <>
          <ParticleBackground />
          <CursorEffect />
        </>
      )}

      {/* 重量特效 - 仅桌面端 */}
      {!isMobile && (
        <>
          <DanmakuBackground />
          <FireflyEffect />
          <SakuraEffect />
          <WindyGrass />
          <RainEffect />
          <GlobalSnow />
          <WeatherEffects />
        </>
      )}
    </>
  );
}
