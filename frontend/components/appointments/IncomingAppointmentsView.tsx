"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import { getIncomingAppointmentsRequest } from "@/lib/appointmentsApi";
import AppointmentCard from "./AppointmentCard";
import type { Appointment } from "@/types/types";
import { updateAppointmentStatusRequest } from "@/lib/appointmentsApi";

export default function IncomingAppointmentsView() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response = await getIncomingAppointmentsRequest();
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

  const handleStatusChange = async (
    appointmentId: string,
    status: "accepted" | "rejected",
  ) => {
    try {
      setUpdatingAppointmentId(appointmentId);
      setErrorMessage("");
      const response = await updateAppointmentStatusRequest(
        appointmentId,
        status,
      );
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
      {isLoading && <Spinner />}
      {errorMessage && <p className="text-sm text-brand">{errorMessage}</p>}
      {!isLoading && !errorMessage && appointments.length === 0 && (
        <div className="rounded-3xl bg-surface p-8 text-center">
          <p className="text-lg font-medium">No incoming appointments yet</p>
          <p className="mt-2 text-sm text-(--color-muted)">
            Appointment requests from parents will appear here.
          </p>
        </div>
      )}
      {!isLoading && !errorMessage && appointments.length > 0 && (
        <ul className="flex flex-col gap-4 md:gap-6">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onAccept={() => handleStatusChange(appointment.id, "accepted")}
              onReject={() => handleStatusChange(appointment.id, "rejected")}
              isUpdating={updatingAppointmentId === appointment.id}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
