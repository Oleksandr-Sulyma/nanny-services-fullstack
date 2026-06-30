"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createReviewRequest } from "@/lib/appointmentsApi";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";

const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z.string().trim().min(3, "Comment must be at least 3 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

type ReviewFormProps = {
  appointmentId: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function ReviewForm({
  appointmentId,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewFormData) => {
    try {
      await createReviewRequest(appointmentId, data);

      showToast({
        variant: "success",
        title: "Review submitted",
        description: "Thank you for sharing your experience.",
      });
      onSuccess?.();
    } catch (error) {
      showToast({
        variant: "error",
        title: "Could not submit review",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  const inputClassName =
    "h-[36px] w-full rounded-xl border border-[rgba(17,16,28,0.1)] px-[18px] text-base outline-none transition placeholder:text-(--color-muted) focus:border-brand";

  const textareaClassName =
    "min-h-12 w-full resize-y rounded-xl border border-[rgba(17,16,28,0.1)] px-[18px] py-3 text-base whitespace-pre-wrap break-words outline-none transition placeholder:text-(--color-muted) focus:border-brand";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-10 grid gap-3 md:grid-cols-2">
        <div>
          <input
            type="number"
            min={1}
            max={5}
            {...register("rating", { valueAsNumber: true })}
            placeholder="Rating"
            className={inputClassName}
          />
          {errors.rating && (
            <p className="mt-1 text-sm text-brand">{errors.rating.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <textarea
            {...register("comment")}
            className={textareaClassName}
            placeholder="Comment"
          />
          {errors.comment && (
            <p className="mt-1 text-sm text-brand">{errors.comment.message}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send review"}
        </Button>

        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>

    </form>
  );
}
