"use client";

import { usePathname } from "next/navigation";
import BackgroundEffects from "@/components/BackgroundEffects";
import BackgroundSlider from "@/components/BackgroundSlider";
import ParticleBackground from "@/components/ParticleBackground";
import DanmakuBackground from "@/components/DanmakuBackground";
import WeatherEffects from "@/components/WeatherEffects";
import SplashScreen from "@/components/SplashScreen";
import CursorEffect from "@/components/CursorEffect";
import ClickEffect from "@/components/ClickEffect";
import FireflyEffect from "@/components/FireflyEffect";
import SakuraEffect from "@/components/SakuraEffect";
import GlobalToolbox from "@/components/GlobalToolbox";
import WindyGrass from "@/components/WindyGrass";
import RainEffect from "@/components/RainEffect";
import GlobalSnow from "@/components/GlobalSnow";
import FloatingPlayer from "@/components/FloatingPlayer";
import AIAssistant from "@/components/AIAssistant";

function isAdminRoute(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export default function GlobalEffects() {
  const pathname = usePathname();

  if (isAdminRoute(pathname)) {
    return null;
  }

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
