"use client";

import { useState } from "react";
import type { Appointment } from "@/types/types";
import ProfileField from "@/components/ui/ProfileField";
import { formatDateTime } from "@/lib/date";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ReviewForm from "./ReviewForm";

type AppointmentCardProps = {
  appointment: Appointment;
  onCancel: () => void;
  onComplete: () => void;
  isUpdating: boolean;
};

export default function MyAppointmentCard({
  appointment,
  onCancel,
  onComplete,
  isUpdating,
}: AppointmentCardProps) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
  const hasReview = appointment.hasReview || isReviewSubmitted;

  if (!appointment.nannyId || typeof appointment.nannyId === "string") {
    return (
      <li className="rounded-3xl bg-surface p-6">
        Nanny profile is unavailable
      </li>
    );
  }

  const openReviewModal = () => {
    setIsReviewOpen(true);
  };

  const nanny = appointment.nannyId;
  const scheduledAt = formatDateTime(appointment.scheduledAt);

  return (
    <li className="rounded-3xl bg-surface p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <ProfileField label="Status" value={appointment.status} />
        <ProfileField label="Nanny name" value={nanny.name} />
        <ProfileField label="Scheduled at" value={scheduledAt} />
        <ProfileField label="Child age" value={appointment.childAge} />
      </div>
      {appointment.status === "pending" && (
        <div className="mt-6">
          <Button variant="ghost" onClick={onCancel} disabled={isUpdating}>
            Cancel
          </Button>
        </div>
      )}
      {appointment.status === "accepted" && (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={onComplete} disabled={isUpdating}>
            Complete
          </Button>

          <Button variant="ghost" onClick={onCancel} disabled={isUpdating}>
            Cancel
          </Button>
        </div>
      )}
      {appointment.status === "completed" && !hasReview && (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={openReviewModal} disabled={isUpdating}>
            Leave review
          </Button>
        </div>
      )}

      <Modal
        isOpen={isReviewOpen}
        onOpenChange={setIsReviewOpen}
        title="Leave a review"
        description="Share your experience with this nanny. Your feedback helps other parents make a confident choice."
      >
        <ReviewForm
          appointmentId={appointment.id}
          onCancel={() => setIsReviewOpen(false)}
          onSuccess={() => {
            setIsReviewSubmitted(true);
            setIsReviewOpen(false);
          }}
        />
      </Modal>
    </li>
  );
}
