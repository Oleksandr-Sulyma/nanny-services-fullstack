import type {
  AppointmentResponse,
  AppointmentStatusUpdate,
  AppointmentsResponse,
  CreateAppointmentPayload,
} from "@/types/types";

export async function createAppointmentRequest(
  nannyId: string,
  payload: CreateAppointmentPayload,
): Promise<AppointmentResponse> {
  const res = await fetch(`/api/nannies/${nannyId}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(
      response.message ?? `Failed to create appointment: ${res.status}`,
    );
  }

  return response;
}

export async function getIncomingAppointmentsRequest(): Promise<AppointmentsResponse> {
  const res = await fetch("/api/appointments/incoming");

  const response = await res.json();
  if (!res.ok) {
    throw new Error(
      response.message ?? `Failed to load incoming appointments: ${res.status}`,
    );
  }

  return response;
}

export async function updateAppointmentStatusRequest(
  appointmentId: string,
  status: AppointmentStatusUpdate,
): Promise<AppointmentResponse> {
  const res = await fetch(`/api/appointments/${appointmentId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(
      response.message ?? `Unable to change meeting status: ${res.status}`,
    );
  }

  return response;
}

export async function getMyAppointmentsRequest(): Promise<AppointmentsResponse> {
  const res = await fetch("/api/appointments/my");

  const response = await res.json();
  if (!res.ok) {
    throw new Error(
      response.message ?? `Failed to load my appointments: ${res.status}`,
    );
  }

  return response;
}

export async function cancelAppointmentRequest(
  appointmentId: string,
): Promise<AppointmentResponse> {
  const res = await fetch(`/api/appointments/${appointmentId}/cancel`, {
    method: "PATCH",
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(
      response.message ?? `Unable to cancel appointment: ${res.status}`,
    );
  }

  return response;
}

export async function completeAppointmentRequest(
  appointmentId: string,
): Promise<AppointmentResponse> {
  const res = await fetch(`/api/appointments/${appointmentId}/complete`, {
    method: "PATCH",
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(
      response.message ?? `Unable to complete appointment: ${res.status}`,
    );
  }

  return response;
}
