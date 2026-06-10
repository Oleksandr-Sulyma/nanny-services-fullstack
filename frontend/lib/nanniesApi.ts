import type { GetNanniesParams } from "@/types/params";
import type {
  NanniesResponse,
  NannyDetailsResponse,
  MyNannyProfileResponse,
} from "@/types/types";

export async function getNannies(
  params: GetNanniesParams,
): Promise<NanniesResponse> {
  const { page, sort, region } = params;
  const searchParams = new URLSearchParams({
    page: String(page),
    sort,
  });

  if (region) {
    searchParams.set("region", region);
  }

  const res = await fetch(`/api/nannies?${searchParams.toString()}`);

  if (!res.ok) {
    throw new Error(`Backend request failed: ${res.status}`);
  }

  const nannies = await res.json();

  return nannies;
}

export async function getNannyDetails(
  nannyId: string,
): Promise<NannyDetailsResponse> {
  const res = await fetch(`/api/nannies/${nannyId}`);

  if (!res.ok) {
    throw new Error(`Backend request failed: ${res.status}`);
  }
  const response = await res.json();
  return response;
}

export async function getMyNannyProfile(): Promise<MyNannyProfileResponse> {
  const res = await fetch("/api/nannies/me", {
    cache: "no-store",
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(
      response.message ?? `Failed to load nanny profile: ${res.status}`,
    );
  }

  return response;
}
