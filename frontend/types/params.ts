import type { NanniesSort } from "./types";

export type GetNanniesParams = {
  page: number;
  sort: NanniesSort;
  region?: string;
};