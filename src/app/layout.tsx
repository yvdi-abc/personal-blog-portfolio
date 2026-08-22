import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MusicProvider } from "@/components/MusicProvider";
import { ToastProvider } from "@/components/ToastProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import BackgroundEffects from "@/components/BackgroundEffects";
import BackgroundSlider from "@/components/BackgroundSlider";
import ParticleBackground from "@/components/ParticleBackground";
import DanmakuBackground from "@/components/DanmakuBackground";
import FireflyEffect from "@/components/FireflyEffect";
import SakuraEffect from "@/components/SakuraEffect";
import WindyGrass from "@/components/WindyGrass";
import RainEffect from "@/components/RainEffect";
import GlobalSnow from "@/components/GlobalSnow";
import WeatherEffects from "@/components/WeatherEffects";
import SplashScreen from "@/components/SplashScreen";
import CursorEffect from "@/components/CursorEffect";
import ClickEffect from "@/components/ClickEffect";
import GlobalToolbox from "@/components/GlobalToolbox";
import FloatingPlayer from "@/components/FloatingPlayer";
import AIAssistant from "@/components/AIAssistant";
import { siteConfig } from "@/siteConfig";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.bio,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `try{document.documentElement.classList.toggle("dark",localStorage.getItem("theme")!=="light")}catch(e){}`
        }} />
      </head>
      <body className="font-serif min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-1000">
        <ThemeProvider>
          <ToastProvider>
            <MusicProvider>
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
              <Navbar />
              <PageTransition>
                {children}
              </PageTransition>
              <Footer />
            </MusicProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
