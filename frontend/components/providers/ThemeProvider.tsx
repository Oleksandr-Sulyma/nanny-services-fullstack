"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

type ThemeProviderProps = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return <>{children}</>;
}
