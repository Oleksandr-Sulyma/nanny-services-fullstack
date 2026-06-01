import { create } from "zustand";
import type { FavoritesState } from "@/types/types";

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
  favoriteIds: [],

  isFavorite: (id) => {
    const favoriteIdsAr = get().favoriteIds;
    return favoriteIdsAr.includes(id);
  },

  addFavorite: (id) => {
    if (!get().isFavorite(id)) {
      set({
        favoriteIds: [...get().favoriteIds, id],
      });
    }
  },

  removeFavorite: (id) => {
    set({
      favoriteIds: get().favoriteIds.filter((el) => el !== id),
    });
  },

  toggleFavorite: (id) => {
    if (get().isFavorite(id)) {
      get().removeFavorite(id);
    } else {
      get().addFavorite(id);
    }
  },

  clearFavorites: () => {
    set({
      favoriteIds: [],
    });
  },

  setFavorites: (ids) => {
    set({
      favoriteIds: ids,
    });
  },
}));
