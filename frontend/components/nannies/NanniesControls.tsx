 "use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { NanniesSort } from "@/types/types";
import { NANNIES_SORT_LABELS } from "@/types/types";

type NanniesControlsProps = {
  sort: NanniesSort;
  region: string;
  onSortChange: (sort: NanniesSort) => void;
  onRegionChange: (region: string) => void;
};

export default function NanniesControls({
  sort,
  region,
  onSortChange,
  onRegionChange,
}: NanniesControlsProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const entries = Object.entries(NANNIES_SORT_LABELS) as [
    NanniesSort,
    string,
  ][];

  const handleSortChange = (nextSort: NanniesSort) => {
    onSortChange(nextSort);
    setIsSortOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="relative flex w-full flex-col gap-2 text-sm font-medium text-(--color-muted) sm:w-[280px]">
        <p>Filters</p>
        <div className="relative">
          <button
            type="button"
            className="flex h-12 w-full items-center justify-between rounded-[14px] bg-brand px-[18px] pr-12 text-left text-base font-medium text-white outline-none transition focus:ring-2 focus:ring-brand-soft"
            aria-expanded={isSortOpen}
            onClick={() => setIsSortOpen((current) => !current)}
          >
            <span>{NANNIES_SORT_LABELS[sort]}</span>
            <ChevronDown
              className={`pointer-events-none absolute right-[18px] top-1/2 h-5 w-5 -translate-y-1/2 text-white transition-transform ${
                isSortOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isSortOpen && (
            <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-full rounded-[14px] bg-surface px-[18px] py-4 shadow-[0_20px_40px_rgba(17,16,28,0.08)]">
              <ul className="flex flex-col gap-3">
                {entries.map(([key, value]) => (
                  <li key={key}>
                    <button
                      type="button"
                      className={`w-full text-left text-base font-medium transition-colors hover:text-brand ${
                        sort === key
                          ? "text-foreground"
                          : "text-(--color-muted)"
                      }`}
                      onClick={() => handleSortChange(key)}
                    >
                      {value}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-(--color-muted)">
        Region
        <input
          className="h-12 min-w-0 rounded-xl border border-[rgba(17,16,28,0.1)] bg-surface px-4 text-base text-foreground outline-none transition placeholder:text-(--color-muted) focus:border-brand sm:w-72"
          value={region}
          onChange={(event) => onRegionChange(event.target.value)}
          placeholder="Enter region"
        />
      </label>
    </div>
  );
}
