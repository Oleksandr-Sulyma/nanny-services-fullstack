import { create } from "zustand";
import type { ThemeState } from "@/types/types";

export const useThemeStore = create<ThemeState>()((set) => ({
  theme: "red",
  setTheme: (theme) => {
    set({ theme });
  },
}));
