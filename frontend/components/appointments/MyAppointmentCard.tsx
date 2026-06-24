"use client";

import type { Appointment } from "@/types/types";
import ProfileField from "@/components/ui/ProfileField";
import { formatDateTime } from "@/lib/date";
import Button from "../ui/Button";

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
  if (!appointment.nannyId || typeof appointment.nannyId === "string") {
    return (
      <li className="rounded-3xl bg-surface p-6">
        Nanny profile is unavailable
      </li>
    );
  }
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
    </li>
  );
}
