"use client";

import type { Appointment } from "@/types/types";
import ProfileField from "@/components/ui/ProfileField";
import { formatDateTime } from "@/lib/date";
import Button from "../ui/Button";

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
  return (
    <li className="rounded-3xl bg-surface p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <ProfileField label="Status" value={appointment.status} />
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
      {appointment.status === "pending" && (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={onAccept} disabled={isUpdating}>
            Accept
          </Button>

          <Button variant="ghost" onClick={onReject} disabled={isUpdating}>
            Reject
          </Button>
        </div>
      )}
    </li>
  );
}
