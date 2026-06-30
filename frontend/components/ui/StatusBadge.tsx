import { AppointmentStatus } from "@/types/types";

type StatusBadgeProps = {
  status: AppointmentStatus;
};

const statusLabel: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]: "Pending",
  [AppointmentStatus.ACCEPTED]: "Accepted",
  [AppointmentStatus.COMPLETED]: "Completed",
  [AppointmentStatus.CANCELLED]: "Cancelled",
  [AppointmentStatus.REJECTED]: "Rejected",
};

const statusClassName: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]: "bg-yellow-100 text-yellow-700",
  [AppointmentStatus.ACCEPTED]: "bg-blue-100 text-blue-700",
  [AppointmentStatus.COMPLETED]: "bg-green-100 text-green-700",
  [AppointmentStatus.CANCELLED]: "bg-gray-100 text-gray-600",
  [AppointmentStatus.REJECTED]: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex min-h-8 w-fit items-center rounded-full px-3 text-sm font-medium ${statusClassName[status]}`}
    >
      {statusLabel[status]}
    </span>
  );
}