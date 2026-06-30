"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "../ui/EmptyState";
import {
  cancelAppointmentRequest,
  completeAppointmentRequest,
  getMyAppointmentsRequest,
} from "@/lib/appointmentsApi";
import MyAppointmentCard from "./MyAppointmentCard";
import type { Appointment } from "@/types/types";
import { useToast } from "@/components/providers/ToastProvider";

export default function MyAppointmentsView() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState<
    string | null
  >(null);
  const { showToast } = useToast();

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response = await getMyAppointmentsRequest();
        setAppointments(response.data);
      } catch (error) {
        setHasLoadError(true);
        showToast({
          variant: "error",
          title: "Could not load appointments",
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, [showToast]);

  const handleAppointmentAction = async (
    appointmentId: string,
    action: "cancel" | "complete",
  ) => {
    try {
      setUpdatingAppointmentId(appointmentId);

      const response =
        action === "cancel"
          ? await cancelAppointmentRequest(appointmentId)
          : await completeAppointmentRequest(appointmentId);

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment.id === appointmentId ? response.data : appointment,
        ),
      );
    } catch (error) {
      showToast({
        variant: "error",
        title: "Could not update appointment",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setUpdatingAppointmentId(null);
    }
  };

  const statusOrder = {
    pending: 0,
    accepted: 1,
    completed: 2,
    cancelled: 3,
    rejected: 4,
  } as const;

  const sortedAppointments = [...appointments].sort((a, b) => {
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];

    if (statusDiff !== 0) {
      return statusDiff;
    }

    return (
      new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {isLoading && <Spinner label="Loading appointments..." />}

      {!isLoading && hasLoadError && (
        <EmptyState
          title="Could not load appointments"
          description="Please refresh the page or try again later."
        />
      )}

      {!isLoading && !hasLoadError && appointments.length === 0 && (
        <EmptyState
          title="No appointments yet"
          description="Your appointments will appear here."
        />
      )}

      {!isLoading && !hasLoadError && appointments.length > 0 && (
        <ul className="flex flex-col gap-4 md:gap-6">
          {sortedAppointments.map((appointment) => (
            <MyAppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={() => handleAppointmentAction(appointment.id, "cancel")}
              onComplete={() =>
                handleAppointmentAction(appointment.id, "complete")
              }
              isUpdating={updatingAppointmentId === appointment.id}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
