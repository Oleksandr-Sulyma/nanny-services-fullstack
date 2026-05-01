import { create } from "zustand";
import type { FavoritesState } from "@/types/types";

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
  favoriteIds: [],

  isFavorite: (id: string) => {
    const favoriteIdsAr = get().favoriteIds;
    return favoriteIdsAr.includes(id);
  },

  addFavorite: (id: string) => {
    if (!get().isFavorite(id)) {
      set({
        favoriteIds: [...get().favoriteIds, id],
      });
    }
  },

  removeFavorite: (id: string) => {
    set({
      favoriteIds: get().favoriteIds.filter((el) => el !== id),
    });
  },

  toggleFavorite: (id: string) => {
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

  setFavorites: (ids: string[]) => {
    set({
      favoriteIds: ids,
    });
  },
}));
