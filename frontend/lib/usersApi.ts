import type {
  UpdateUserAvatarPayload,
  UpdateUserAvatarResponse,
} from "@/types/types";

export async function updateUserAvatar(
  payload: UpdateUserAvatarPayload,
): Promise<UpdateUserAvatarResponse> {
  const res = await fetch("/api/users/avatar", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message ?? `Failed to update avatar: ${res.status}`);
  }

  return response;
}