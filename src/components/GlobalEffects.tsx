"use client";

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { memo } from 'react';

// 动态导入特效组件，减少初始包大小
const SplashScreen = dynamic(() => import('./SplashScreen'), { ssr: false });
const BackgroundSlider = dynamic(() => import('./BackgroundSlider'), { ssr: false });
const ParticleBackground = dynamic(() => import('./ParticleBackground'), { ssr: false });
const DanmakuBackground = dynamic(() => import('./DanmakuBackground'), { ssr: false });
const FireflyEffect = dynamic(() => import('./FireflyEffect'), { ssr: false });
const SakuraEffect = dynamic(() => import('./SakuraEffect'), { ssr: false });
const WindyGrass = dynamic(() => import('./WindyGrass'), { ssr: false });
const RainEffect = dynamic(() => import('./RainEffect'), { ssr: false });
const GlobalSnow = dynamic(() => import('./GlobalSnow'), { ssr: false });
const WeatherEffects = dynamic(() => import('./WeatherEffects'), { ssr: false });
const BackgroundEffects = dynamic(() => import('./BackgroundEffects'), { ssr: false });
const CursorEffect = dynamic(() => import('./CursorEffect'), { ssr: false });
const ClickEffect = dynamic(() => import('./ClickEffect'), { ssr: false });
const GlobalToolbox = dynamic(() => import('./GlobalToolbox'), { ssr: false });
const FloatingPlayer = dynamic(() => import('./FloatingPlayer'), { ssr: false });
const AIAssistant = dynamic(() => import('./AIAssistant'), { ssr: false });

function GlobalEffects() {
  const pathname = usePathname();

  // 后台页面不渲染特效
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <>
      <SplashScreen />
      <BackgroundSlider />
      <ParticleBackground />
      <DanmakuBackground />
      <FireflyEffect />
      <SakuraEffect />
      <WindyGrass />
      <RainEffect />
      <GlobalSnow />
      <WeatherEffects />
      <BackgroundEffects />
      <CursorEffect />
      <ClickEffect />
      <GlobalToolbox />
      <FloatingPlayer />
      <AIAssistant />
    </>
  );
}

// 使用 memo 避免不必要的重新渲染
export default memo(GlobalEffects);
