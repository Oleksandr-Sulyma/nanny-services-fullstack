import { cookies } from "next/headers";
import { API_URL } from "@/lib/backendApi";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const res = await fetch(`${API_URL}/appointments/incoming`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await res.json();

    if (!res.ok) {
      return Response.json(response, { status: res.status });
    }

    return Response.json(response);
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ message: "Network error" }, { status: 502 });
  }
}
