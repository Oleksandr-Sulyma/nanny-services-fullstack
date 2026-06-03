import { create } from "zustand";
import type { NanniesState } from "@/types/types";
import { getNannies } from "@/lib/nanniesApi";

export const useNanniesStore = create<NanniesState>()((set, get) => ({
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
      nannies: [],
      page: 1,
      totalPages: 0,
    });
  },

  setRegion: (region) => {
    set({
      region,
      nannies: [],
      page: 1,
      totalPages: 0,
    });
  },

  resetNannies: () =>
    set({
      nannies: [],
      page: 1,
      totalPages: 0,
    }),

  loadNannies: async () => {
    set({
      isLoading: true,
    });
    try {
      const { page, sort, region } = get();

      const response = await getNannies({ page, sort, region });

      set({
        nannies: response.data,
        totalPages: response.totalPages,
      });
    } finally {
      set({
        isLoading: false,
      });
    }
  },

  loadMoreNannies: async () => {
    const { page, totalPages, sort, region, nannies, isLoading } = get();

    if (page >= totalPages || isLoading) return;

    set({
      isLoading: true,
    });

    try {
      const nextPage = page + 1;

      const response = await getNannies({ page: nextPage, sort, region });

      set({
        nannies: [...nannies, ...response.data],
        totalPages: response.totalPages,
        page: nextPage,
      });
    } finally {
      set({
        isLoading: false,
      });
    }
  },
}));
