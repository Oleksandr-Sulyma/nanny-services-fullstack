import { cookies } from "next/headers";
import { API_URL } from "@/lib/backendApi";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const res = await fetch(`${API_URL}/appointments/my`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = res.headers.get("content-type") ?? "";
    const response = contentType.includes("application/json")
      ? await res.json()
      : null;

    if (!res.ok) {
      return Response.json(
        response ?? { message: `Backend request failed: ${res.status}` },
        { status: res.status },
      );
    }

    if (!response) {
      return Response.json(
        { message: "Backend returned an invalid response" },
        { status: 502 },
      );
    }

    return Response.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error";
    console.error("Failed to load my appointments:", error);
    return Response.json({ message }, { status: 502 });
  }
}
