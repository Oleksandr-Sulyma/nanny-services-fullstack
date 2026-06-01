import { create } from "zustand";
import type { NanniesState } from "@/types/types";

export const useNanniesStore = create<NanniesState>()((set) => ({
  nannies: [],
  page: 1,
  totalPages: 0,
  isLoading: false,
  sort: "a_to_z",
  region: "",

  setNannies: (nannies) => {
    set({
      nannies,
    });
  },

  addNannies: (nannies) => {
    set((state) => ({
      nannies: [...state.nannies, ...nannies],
    }));
  },

  setPage: (page) => {
    set({
      page,
    });
  },

  setTotalPages: (totalPages) => {
    set({
      totalPages,
    });
  },

  setLoading: (isLoading) => {
    set({
      isLoading,
    });
  },

  setSort: (sort) => {
    set({
      sort,
    });
  },

  setRegion: (region) => {
    set({
      region,
    });
  },

  resetNannies: () =>
    set({
      nannies: [],
      page: 1,
      totalPages: 0,
    }),
}));
