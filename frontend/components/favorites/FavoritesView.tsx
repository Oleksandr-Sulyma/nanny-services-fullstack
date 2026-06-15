"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Nanny, UserFavorite } from "@/types/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import NanniesList from "@/components/nannies/NanniesList";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

function isNannyFavorite(favorite: UserFavorite): favorite is Nanny {
  return typeof favorite !== "string";
}

export default function FavoritesView() {
  const router = useRouter();
  const { user, isLoading, fetchCurrentUser } = useAuthStore();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);

  const favoriteNannies = (user?.favorites ?? [])
    .filter(isNannyFavorite)
    .filter((nanny) => favoriteIds.includes(nanny.id));

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

  if (isLoading) {
    return <Spinner label="Loading favorites..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-2 md:mb-8">
        <h1 className="text-3xl font-medium leading-none text-foreground">
          Favorites
        </h1>
        <p className="text-sm text-(--color-muted)">
          {favoriteNannies.length
            ? `${favoriteNannies.length} saved nannies`
            : "Saved nannies will appear here."}
        </p>
      </div>

      {favoriteNannies.length ? (
        <NanniesList nannies={favoriteNannies} />
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
