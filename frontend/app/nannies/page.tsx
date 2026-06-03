"use client";

import { useEffect } from "react";
import LoadMoreButton from "@/components/nannies/LoadMoreButton";
import NanniesControls from "@/components/nannies/NanniesControls";
import NanniesList from "@/components/nannies/NanniesList";
import { useNanniesStore } from "@/store/useNanniesStore";

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
    <main>
      <h2>Nannies</h2>
      {isLoading && <p>Loading...</p>}
      <NanniesControls
        sort={sort}
        region={region}
        onSortChange={setSort}
        onRegionChange={setRegion}
      />
      {!isLoading && !hasNannies && <p>No nannies found</p>}
      {hasNannies && <NanniesList nannies={nannies} />}
      {page < totalPages && (
        <LoadMoreButton isLoading={isLoading} onClick={loadMoreNannies} />
      )}
    </main>
  );
}
