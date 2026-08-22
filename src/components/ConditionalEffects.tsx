"use client";

import { usePathname } from 'next/navigation';
import { useEffects } from './EffectsProvider';
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
  const { heavyEffectsEnabled } = useEffects();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <>
      {/* 核心背景 - 始终显示 */}
      <BackgroundSlider />
      <BackgroundEffects />

      {/* 轻量特效 - 始终显示 */}
      <ParticleBackground />
      <CursorEffect />
      <ClickEffect />

      {/* 重量特效 - 用户可开关（默认关闭） */}
      {heavyEffectsEnabled && (
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
