import type {
  CreateAppointmentPayload,
  CreateAppointmentResponse,
} from "@/types/types";

export async function createAppointmentRequest(
  nannyId: string,
  payload: CreateAppointmentPayload,
): Promise<CreateAppointmentResponse> {
  const res = await fetch(`/api/nannies/${nannyId}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message ?? `Failed to create appointment: ${res.status}`);
  }

  return response;
}