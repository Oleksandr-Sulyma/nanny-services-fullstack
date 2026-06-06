"use client";

import { useState } from "react";
import InitialAvatar from "@/components/ui/InitialAvatar";
import { Star } from "lucide-react";
import type { Review } from "@/types/types";
import Button from "@/components/ui/Button";

type NannyReviewsProps = {
  reviews: Review[];
};

export default function NannyReviews({ reviews }: NannyReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleReviews = showAll ? reviews : reviews.slice(0, 2);

  if (reviews.length === 0) return <p className="text-base text-[var(--color-muted)]">No reviews yet</p>;

  return (
    <div className="flex flex-col gap-[25px]">
      {visibleReviews.map((review) => (
        <div key={review.id} className="flex flex-col gap-4">
          <div className="flex flex-row gap-3">
            <InitialAvatar name={review.authorId.name} />
            <div className="flex flex-col">
              <p className="font-medium text-foreground">
                {review.authorId.name}
              </p>
              <p className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#FFC531] text-[#FFC531]" />
                {review.rating}
              </p>
            </div>
          </div>
          <p className="text-base leading-[1.25] text-[var(--color-muted)]">
            {review.comment}
          </p>
        </div>
      ))}
      {reviews.length > 2 && !showAll && (
        <Button
          size="md"
          onClick={() => setShowAll(true)}
          variant="ghost"
          className="mx-auto w-fit"
        >
          Show all reviews
        </Button>
      )}
    </div>
  );
}
