"use client";

import { useEffect } from "react";
import LoadMoreButton from "@/components/nannies/LoadMoreButton";
import NanniesControls from "@/components/nannies/NanniesControls";
import NanniesList from "@/components/nannies/NanniesList";
import { useNanniesStore } from "@/store/useNanniesStore";
import Spinner from "@/components/ui/Spinner";

export default function NanniesPage() {
  const {
    nannies,
    isLoading,
    loadNannies,
    page,
    totalPages,
    loadMoreNannies,
    sort,
    setSort,
    region,
    setRegion,
  } = useNanniesStore();

  useEffect(() => {
    loadNannies();
  }, [loadNannies, sort, region]);

  const hasNannies = nannies.length > 0;

  return (
    <main className="app-container py-6 md:py-4">
      {isLoading && <Spinner label="Loading nannies..." className="mb-4" />}

      <NanniesControls
        sort={sort}
        region={region}
        onSortChange={setSort}
        onRegionChange={setRegion}
      />

      <div className="mt-6 md:mt-8">
        {!isLoading && !hasNannies && (
          <div className="rounded-3xl bg-surface p-8 text-center">
            <p className="text-lg font-medium">No nannies found</p>
            <p className="mt-2 text-sm text-(--color-muted)">
              Try changing the region or sorting option.
            </p>
          </div>
        )}

        {hasNannies && <NanniesList nannies={nannies} />}
      </div>

      {page < totalPages && (
        <div className="mt-8 flex justify-center">
          <LoadMoreButton isLoading={isLoading} onClick={loadMoreNannies} />
        </div>
      )}
    </main>
  );
}
