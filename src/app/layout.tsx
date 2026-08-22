import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MusicProvider } from "@/components/MusicProvider";
import { ToastProvider } from "@/components/ToastProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import GlobalEffects from "@/components/GlobalEffects";
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
              <GlobalEffects />
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
