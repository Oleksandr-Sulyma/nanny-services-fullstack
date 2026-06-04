"use client";

import { useThemeStore } from "@/store/useThemeStore";
import type { ThemeName } from "@/types/types";

export default function ThemeSwitcher() {
  const themes: ThemeName[] = ["red", "blue", "green"];
  const themeColors: Record<ThemeName, string> = {
    red: "#f03f3b",
    blue: "#0957c3",
    green: "#103931",
  };
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex gap-2">
      {themes.map((themeName) => (
        <button
          className="h-6 w-6 rounded-full border-2 border-white disabled:ring-2 disabled:ring-white disabled:ring-offset-2 disabled:ring-offset-[var(--color-primary)]"
          type="button"
          key={themeName}
          onClick={() => setTheme(themeName)}
          disabled={theme === themeName}
          aria-label={`Set ${themeName} theme`}
          style={{ backgroundColor: themeColors[themeName] }}
        ></button>
      ))}
    </div>
  );
}
