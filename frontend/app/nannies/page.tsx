"use client";

import { useEffect } from "react";
import { useNanniesStore } from "@/store/useNanniesStore";
import { NANNIES_SORT_LABELS } from "@/types/types";
import type { NanniesSort } from "@/types/types";

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

  const buttonText = isLoading ? "Loading..." : "Load more";
  const entries = Object.entries(NANNIES_SORT_LABELS);
  const hasNannies = nannies.length > 0;

  return (
    <main>
      <h2>Nannies</h2>
      {isLoading && <p>Loading...</p>}
      <select
        value={sort}
        onChange={(event) => setSort(event.target.value as NanniesSort)}
      >
        {entries.map(([key, value]) => (
          <option value={key} key={key}>
            {value}
          </option>
        ))}
      </select>
      <input
        value={region}
        onChange={(event) => setRegion(event.target.value)}
        placeholder="Region"
      />
      {!isLoading && !hasNannies && <p>No nannies found</p>}
      {hasNannies && (
        <ul>
          {nannies.map((nanny) => (
            <li key={nanny.id}>
              <img
                src={nanny.avatar_url}
                alt={nanny.name}
                width={80}
                height={80}
              />
              <strong>{nanny.name}</strong>
              <p>
                {nanny.location.settlement}, {nanny.location.region}
              </p>
              <p>Price: ${nanny.price_per_hour}/hour</p>
              <p>Rating: {nanny.rating}</p>
            </li>
          ))}
        </ul>
      )}
      {page < totalPages && (
        <button onClick={loadMoreNannies} disabled={isLoading}>
          {buttonText}
        </button>
      )}
    </main>
  );
}
