"use client";

import type { Appointment } from "@/types/types";
import ProfileField from "@/components/ui/ProfileField";
import { formatDateTime } from "@/lib/date";
import Button from "../ui/Button";
import StatusBadge from "../ui/StatusBadge";

type AppointmentCardProps = {
  appointment: Appointment;
  onAccept: () => void;
  onReject: () => void;
  isUpdating: boolean;
};

export default function AppointmentCard({
  appointment,
  onAccept,
  onReject,
  isUpdating,
}: AppointmentCardProps) {
  const scheduledAt = formatDateTime(appointment.scheduledAt);

  const handleRejectClick = () => {
    const shouldReject = window.confirm(
      "Are you sure you want to reject this appointment?",
    );

    if (!shouldReject) return;

    onReject();
  };

  return (
    <li className="rounded-3xl bg-surface p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-(--color-muted)">Status</p>
          <div className="mt-1">
            <StatusBadge status={appointment.status} />
          </div>
        </div>
        <ProfileField label="Parent name" value={appointment.parentName} />
        <ProfileField label="Email" value={appointment.email} />
        <ProfileField label="Address" value={appointment.address} />
        <ProfileField label="Child age" value={appointment.childAge} />
        <ProfileField label="Scheduled at" value={scheduledAt} />
        <ProfileField
          label="Comment"
          value={appointment.comment ? appointment.comment : "No comment"}
          className="md:col-span-2"
        />
      </div>
      {appointment.review && (
        <div className="mt-6 rounded-3xl bg-background p-4">
          <p className="font-medium">Parent review</p>

          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <ProfileField label="Rating" value={appointment.review.rating} />
            <ProfileField
              label="Comment"
              value={appointment.review.comment}
              className="md:col-span-2"
            />
          </div>
        </div>
      )}
      {appointment.status === "pending" && (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={onAccept} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Accept"}
          </Button>

          <Button
            variant="ghost"
            onClick={handleRejectClick}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Reject"}
          </Button>
        </div>
      )}
    </li>
  );
}
