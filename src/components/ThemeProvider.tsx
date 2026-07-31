"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeCtx = createContext<{ theme: Theme; isDark: boolean; toggleTheme: () => void }>({
  theme: "dark", isDark: true, toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const t = (localStorage.getItem("theme") as Theme) || "dark";
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };
  return <ThemeCtx.Provider value={{ theme, isDark: theme === "dark", toggleTheme }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
