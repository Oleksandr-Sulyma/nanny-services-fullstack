"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import {
  cancelAppointmentRequest,
  completeAppointmentRequest,
  getMyAppointmentsRequest,
} from "@/lib/appointmentsApi";
import MyAppointmentCard from "./MyAppointmentCard";
import type { Appointment } from "@/types/types";

export default function MyAppointmentsView() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response = await getMyAppointmentsRequest();
        setAppointments(response.data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load appointments",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const handleAppointmentAction = async (
    appointmentId: string,
    action: "cancel" | "complete",
  ) => {
    try {
      setUpdatingAppointmentId(appointmentId);
      setErrorMessage("");

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
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to update appointment status",
      );
    } finally {
      setUpdatingAppointmentId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {isLoading && <Spinner label="Loading appointments..." />}

      {errorMessage && <p className="text-sm text-brand">{errorMessage}</p>}

      {!isLoading && !errorMessage && appointments.length === 0 && (
        <div className="rounded-3xl bg-surface p-8 text-center">
          <p className="text-lg font-medium">No appointments yet</p>
          <p className="mt-2 text-sm text-(--color-muted)">
            Your appointments will appear here.
          </p>
        </div>
      )}

      {!isLoading && !errorMessage && appointments.length > 0 && (
        <ul className="flex flex-col gap-4 md:gap-6">
          {appointments.map((appointment) => (
            <MyAppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={() =>
                handleAppointmentAction(appointment.id, "cancel")
              }
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