"use client";

import Image from "next/image";
import { useState } from "react";
import type { Nanny, Review } from "@/types/types";
import { getAgeFromBirthday } from "@/lib/date";
import { formatLocationPart } from "@/lib/format";
import { Heart, MapPin, Star } from "lucide-react";
import Chip from "@/components/ui/Chip";
import NannyReviews from "./NannyReviews";
import Button from "@/components/ui/Button";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useAuthStore } from "@/store/useAuthStore";
import { getNannyDetails } from "@/lib/nanniesApi";
import { toggleFavoriteRequest } from "@/lib/favoritesApi";
import Spinner from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { useToast } from "@/components/providers/ToastProvider";

type NannyCardProps = {
  nanny: Nanny;
};

export default function NannyCard({ nanny }: NannyCardProps) {
  const age = getAgeFromBirthday(nanny.birthday);

  const settlement = formatLocationPart(nanny.location.settlement);
  const region = formatLocationPart(nanny.location.region);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(nanny.id));
  const setFavorites = useFavoritesStore((state) => state.setFavorites);
  const [isExpanded, setIsExpanded] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [hasReviewsError, setHasReviewsError] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { showToast } = useToast();

  const handleFavoriteClick = async () => {
    try {
      if (!isAuthenticated) {
        showToast({
          variant: "warning",
          title: "Log in required",
          description: "Please log in to add nannies to favorites.",
        });
        return;
      }
      const { favorites } = await toggleFavoriteRequest(nanny.id);
      setFavorites(favorites);
      showToast({
        variant: "success",
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite
          ? `${nanny.name} was removed from your favorites.`
          : `${nanny.name} was added to your favorites.`,
      });
    } catch (error) {
      console.error(error);
      showToast({
        variant: "error",
        title: "Could not update favorites",
        description: "Please try again.",
      });
    }
  };

  const handleReadMore = async () => {
    setIsExpanded(true);
    setHasReviewsError(false);
    if (reviews.length > 0) return;
    try {
      setIsReviewsLoading(true);
      const response = await getNannyDetails(nanny.id);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error(error);
      setHasReviewsError(true);
      showToast({
        variant: "error",
        title: "Could not load reviews",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsReviewsLoading(false);
    }
  };

  const handleAppointmentClick = () => {
    if (!isAuthenticated) {
      showToast({
        variant: "warning",
        title: "Log in required",
        description: "Please log in to make an appointment.",
      });
      return;
    }

    setIsAppointmentOpen(true);
  };

  const allowedAvatarHosts = ["ftp.goit.study", "res.cloudinary.com"];

  const hasAllowedAvatarUrl = (() => {
    try {
      return allowedAvatarHosts.includes(new URL(nanny.avatar_url).hostname);
    } catch {
      return false;
    }
  })();

  return (
    <li className="relative flex flex-col gap-4 rounded-3xl bg-surface p-6">
      <button
        type="button"
        className="absolute right-6 top-6 rounded-full transition-colors hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={handleFavoriteClick}
      >
        <Heart
          className={`h-6 w-6 ${isFavorite ? "fill-brand text-brand" : ""}`}
        />
      </button>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex gap-4 pr-10 lg:block lg:pr-0">
          <div className="relative flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-[30px] border-2 border-brand-soft">
            {hasAllowedAvatarUrl ? (
              <Image
                className="h-24 w-24 rounded-[15px] object-cover"
                src={nanny.avatar_url}
                alt={nanny.name}
                width={96}
                height={96}
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-[15px] bg-brand-soft text-3xl font-medium text-brand">
                {nanny.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            <span className="absolute right-3 top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white">
              <span className="h-[9px] w-[9px] rounded-full bg-[#38CD3E]" />
            </span>
          </div>

          <div className="min-w-0 flex-1 self-center lg:hidden">
            <p className="mb-2 text-sm font-medium text-[var(--color-muted)]">
              Nanny
            </p>
            <strong className="text-2xl font-medium leading-none text-foreground">
              {nanny.name}
            </strong>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="hidden lg:block">
              <p className="mb-2 text-sm font-medium text-[var(--color-muted)]">
                Nanny
              </p>
              <strong className="text-2xl font-medium leading-none text-foreground">
                {nanny.name}
              </strong>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium lg:justify-end lg:pr-10">
              <p className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {settlement}, {region}
              </p>

              <span className="hidden h-4 w-px bg-[rgba(17,16,28,0.2)] sm:block" />

              <p className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#FFC531] text-[#FFC531]" />
                Rating: {nanny.rating}
              </p>

              <span className="hidden h-4 w-px bg-[rgba(17,16,28,0.2)] sm:block" />

              <p>
                Price / 1 hour:{" "}
                <span className="text-[#38CD3E]">{nanny.price_per_hour}$</span>
              </p>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {age !== null && <Chip label="Age" value={age} />}
            <Chip label="Experience" value={nanny.experience} />
            <Chip label="Kids Age" value={nanny.kids_age} />
            <Chip label="Characters" value={nanny.characters.join(", ")} />
            <Chip label="Education" value={nanny.education} />
          </div>
          <div>
            <p className="text-base leading-[1.25] text-[var(--color-muted)]">
              {nanny.about}
            </p>
          </div>

          {!isExpanded && (
            <button
              type="button"
              className="mt-3.5 self-start font-medium underline"
              onClick={handleReadMore}
            >
              Read more
            </button>
          )}
          {isExpanded && (
            <div className="mt-12 flex flex-col gap-12">
              {hasReviewsError && (
                <p className="text-base text-[var(--color-muted)]">
                  Reviews could not be loaded.
                </p>
              )}
              {isReviewsLoading && <Spinner label="Loading reviews..." />}
              {!isReviewsLoading && !hasReviewsError && (
                <>
                  <NannyReviews reviews={reviews} />
                  <Button
                    size="md"
                    className="w-full self-start sm:w-[215px]"
                    onClick={handleAppointmentClick}
                  >
                    Make an appointment
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isAppointmentOpen}
        onOpenChange={setIsAppointmentOpen}
        title="Make an appointment with a babysitter"
        description="Arranging a meeting with a caregiver for your child is the first step to creating a safe and comfortable environment. Fill out the form below so we can match you with the perfect care partner."
        maxWidth="max-w-[600px]"
        contentClassName="max-w-[472px]"
      >
        <AppointmentForm
          nanny={nanny}
          onSuccess={() => setIsAppointmentOpen(false)}
        />
      </Modal>
    </li>
  );
}
