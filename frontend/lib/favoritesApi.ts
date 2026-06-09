import type { ToggleFavoriteResponse } from "@/types/types";

export async function toggleFavoriteRequest(
  nannyId: string,
): Promise<ToggleFavoriteResponse> {
  const res = await fetch("/api/users/favorites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nannyId }),
  });

  if (!res.ok) {
    throw new Error(`Backend request failed: ${res.status}`);
  }

  return res.json();
}
