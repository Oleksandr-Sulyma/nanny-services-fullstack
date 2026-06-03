import type { UserFavorite } from "@/types/types";

export function getFavoriteIds(favorites: UserFavorite[]) {
  return favorites.map((favorite) =>
    typeof favorite === "string" ? favorite : favorite.id,
  );
}
