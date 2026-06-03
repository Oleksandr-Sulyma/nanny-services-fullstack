import type { CurrentUserResponse } from "@/types/types";

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const res = await fetch("/api/users/me");

  if (!res.ok) {
    throw new Error(`Backend request failed: ${res.status}`);
  }

  return res.json();
}
