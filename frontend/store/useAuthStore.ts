import { create } from "zustand";
import type { AuthState } from "@/types/types";
import { getCurrentUser } from "@/lib/authApi";
import { getFavoriteIds } from "@/lib/favorites";
import { useFavoritesStore } from "./useFavoritesStore";

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

  fetchCurrentUser: async () => {
    set({
      isLoading: true,
    });
    try {
      const response = await getCurrentUser();
      set({
        user: response.data,
        isAuthenticated: true,
      });

      const favoriteIds = getFavoriteIds(response.data.favorites);
      const setFavorites = useFavoritesStore.getState().setFavorites;
      setFavorites(favoriteIds);
    } catch {
      set({
        user: null,
        isAuthenticated: false,
      });
      const clearFavorites = useFavoritesStore.getState().clearFavorites;
      clearFavorites();
    } finally {
      set({
        isLoading: false,
      });
    }
  },
}));
