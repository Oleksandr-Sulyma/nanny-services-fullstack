export enum Role {
  PARENT = "parent",
  NANNY = "nanny",
}

export enum AppointmentStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export type UserFavorite = string | Nanny;

export type Location = {
  country: string;
  region: string;
  settlement: string;
};

export type ReviewAuthor = {
  id: string;
  name: string;
  avatar: string;
};

export type Review = {
  id: string;
  authorId: ReviewAuthor;
  nannyId: string;
  appointmentId?: string;
  rating: number;
  comment: string;
};

export type Nanny = {
  id: string;
  userId: string;
  name: string;
  avatar_url: string;
  birthday?: string;
  experience: string;
  reviews?: Review[];
  education: string;
  kids_age: string;
  price_per_hour: number;
  location: Location;
  about: string;
  characters: string[];
  rating: number;
  isProfileComplete: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  favorites: UserFavorite[];
  role: Role;
};

export type Appointment = {
  id: string;
  parentId: string;
  nannyId: string;
  parentName: string;
  email: string;
  address: string;
  phone: string;
  childAge: string;
  scheduledAt: string;
  comment: string;
  status: AppointmentStatus;
};

export type NanniesState = {
  nannies: Nanny[];
  setNannies: (nannies: Nanny[]) => void;
  addNannies: (nannies: Nanny[]) => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  sort: NanniesSort;
  setSort: (sort: NanniesSort) => void;
  region: string;
  setRegion: (region: string) => void;
  resetNannies: () => void;
  loadNannies: () => Promise<void>;
  loadMoreNannies: () => Promise<void>;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  fetchCurrentUser: () => Promise<void>;
};

export type FavoritesState = {
  favoriteIds: string[];
  setFavorites: (ids: string[]) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
};

export type NanniesSort =
  | "a_to_z"
  | "z_to_a"
  | "popular"
  | "not_popular"
  | "price_asc"
  | "price_desc";

export const NANNIES_SORT_LABELS: Record<NanniesSort, string> = {
  a_to_z: "A to Z",
  z_to_a: "Z to A",
  popular: "Popular",
  not_popular: "Not popular",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
};

export type NanniesResponse = {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  data: Nanny[];
};

export type CurrentUserResponse = {
  data: User;
};

export type ThemeName = "red" | "blue" | "green";

export type ThemeState = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};

export type NannyDetailsResponse = {
  data: {
    nanny: Nanny;
    reviews: Review[];
  };
};

export type ToggleFavoriteResponse = {
  message: string;
  favorites: string[];
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

export type RegisterResponse = {
  data: {
    user: User;
    nanny?: Nanny | null;
  };
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  data: {
    user: User;
  };
};

export type MyNannyProfileResponse = {
  data: Nanny;
};

export type LogoutResponse = {
  message: string;
};

export type UpdateNannyProfilePayload = {
  avatar_url?: string;
  birthday?: string;
  experience?: string;
  education?: string;
  kids_age?: string;
  price_per_hour?: number;
  location?: {
    country?: string;
    region?: string;
    settlement?: string;
  };
  about?: string;
  characters?: string[];
};

export type UpdateNannyProfileResponse = {
  message: string;
  data: Nanny;
};

export type UpdateUserProfilePayload = {
  name?: string;
  email?: string;
  avatar?: string;
};

export type UpdateUserProfileResponse = {
  message: string;
  data: User;
};

export type UploadAvatarResponse = {
  message: string;
  data: {
    url: string;
  };
};

