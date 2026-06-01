import { create } from "zustand";
import type { AuthState } from "@/types/types";

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setAuth: (user) => {
    set({
      user,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  setLoading: (isLoading) => {
    set({
      isLoading,
    });
  },
}));
