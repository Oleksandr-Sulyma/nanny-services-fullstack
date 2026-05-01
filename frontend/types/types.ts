export type Review = {
    reviewer: string;
    rating: number;
    comment: string
}

  export type Nanny = {
name: string;
avatar_url: string;
birthday: string;
experience: string;
reviews: Review[];
education: string;
kids_age: string;
price_per_hour: number;
location: string;
about: string;
characters: string[];
rating: number;
_id: string
};

export type NanniesState = {};

export type User = {};
export type AuthState = {};

export type FavoritesState = {
  favoriteIds: string[];
  setFavorites: (ids: string[]) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
};

