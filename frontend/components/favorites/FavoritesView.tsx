"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { NanniesSort, Nanny, UserFavorite } from "@/types/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import NanniesList from "@/components/nannies/NanniesList";
import NanniesControls from "@/components/nannies/NanniesControls";
import LoadMoreButton from "@/components/nannies/LoadMoreButton";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

const FAVORITES_PAGE_SIZE = 3;

function isNannyFavorite(favorite: UserFavorite): favorite is Nanny {
  return typeof favorite !== "string";
}

function sortNannies(nannies: Nanny[], sort: NanniesSort) {
  return [...nannies].sort((firstNanny, secondNanny) => {
    switch (sort) {
      case "z_to_a":
        return secondNanny.name.localeCompare(firstNanny.name);
      case "popular":
        return secondNanny.rating - firstNanny.rating;
      case "not_popular":
        return firstNanny.rating - secondNanny.rating;
      case "price_asc":
        return firstNanny.price_per_hour - secondNanny.price_per_hour;
      case "price_desc":
        return secondNanny.price_per_hour - firstNanny.price_per_hour;
      case "a_to_z":
      default:
        return firstNanny.name.localeCompare(secondNanny.name);
    }
  });
}

export default function FavoritesView() {
  const router = useRouter();
  const { user, isLoading, fetchCurrentUser } = useAuthStore();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const [sort, setSort] = useState<NanniesSort>("a_to_z");
  const [region, setRegion] = useState("");
  const [visibleCount, setVisibleCount] = useState(FAVORITES_PAGE_SIZE);

  const favoriteNannies = (user?.favorites ?? [])
    .filter(isNannyFavorite)
    .filter((nanny) => favoriteIds.includes(nanny.id));

  const normalizedRegion = region.trim().toLowerCase();
  const filteredNannies = normalizedRegion
    ? favoriteNannies.filter((nanny) => {
        const locationParts = [
          nanny.location.country,
          nanny.location.region,
          nanny.location.settlement,
        ];

        return locationParts.some((locationPart) =>
          locationPart.toLowerCase().includes(normalizedRegion),
        );
      })
    : favoriteNannies;

  const sortedNannies = sortNannies(filteredNannies, sort);
  const visibleNannies = sortedNannies.slice(0, visibleCount);
  const hasMoreFavorites = visibleCount < sortedNannies.length;

  useEffect(() => {
    const hasMissingFavoriteNannies =
      favoriteIds.length > favoriteNannies.length;

    if (user && hasMissingFavoriteNannies && !isLoading) {
      fetchCurrentUser();
    }
  }, [
    favoriteIds.length,
    favoriteNannies.length,
    fetchCurrentUser,
    isLoading,
    user,
  ]);

  const handleSortChange = (nextSort: NanniesSort) => {
    setSort(nextSort);
    setVisibleCount(FAVORITES_PAGE_SIZE);
  };

  const handleRegionChange = (nextRegion: string) => {
    setRegion(nextRegion);
    setVisibleCount(FAVORITES_PAGE_SIZE);
  };

  const handleLoadMore = () => {
    setVisibleCount((currentCount) => currentCount + FAVORITES_PAGE_SIZE);
  };

  if (isLoading) {
    return <Spinner label="Loading favorites..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <section>
      {favoriteNannies.length ? (
        <>
          <NanniesControls
            sort={sort}
            region={region}
            onSortChange={handleSortChange}
            onRegionChange={handleRegionChange}
          />

          <div className="mt-6 md:mt-8">
            {visibleNannies.length ? (
              <NanniesList nannies={visibleNannies} />
            ) : (
              <div className="rounded-3xl bg-surface p-8 text-center">
                <p className="text-lg font-medium">
                  No favorites match filters
                </p>
                <p className="mt-2 text-sm text-(--color-muted)">
                  Try changing the region or sorting option.
                </p>
              </div>
            )}
          </div>

          {hasMoreFavorites && (
            <div className="mt-8 flex justify-center">
              <LoadMoreButton isLoading={false} onClick={handleLoadMore} />
            </div>
          )}
        </>
      ) : (
        <div className="rounded-3xl bg-surface p-8 text-center">
          <p className="text-lg font-medium">No favorite nannies yet</p>
          <p className="mt-2 text-sm text-(--color-muted)">
            Add nannies to favorites from the catalog.
          </p>
          <Button
            type="button"
            size="md"
            className="mt-6"
            onClick={() => router.push("/nannies")}
          >
            Browse nannies
          </Button>
        </div>
      )}
    </section>
  );
}
