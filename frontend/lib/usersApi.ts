import type {
  UpdateUserProfilePayload,
  UpdateUserProfileResponse,
} from "@/types/types";

export async function updateUserProfile(
  payload: UpdateUserProfilePayload,
): Promise<UpdateUserProfileResponse> {
  const res = await fetch("/api/users/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(
      response.message ?? `Failed to update profile: ${res.status}`,
    );
  }

  return response;
}
