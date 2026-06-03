import { API_URL } from "@/lib/backendApi";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();

    const queryParams = query ? `?${query}` : "";

    const res = await fetch(`${API_URL}/nannies${queryParams}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Backend request failed: ${res.status}`);
    }

    const nannies = await res.json();

    return Response.json(nannies);
  } catch (error) {
    console.error("Failed to load nannies:", error);

    return Response.json(
      { message: "Failed to load nannies" },
      { status: 502 },
    );
  }
}
