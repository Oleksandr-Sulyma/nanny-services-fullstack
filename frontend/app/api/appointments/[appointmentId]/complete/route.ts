import { cookies } from "next/headers";
import { API_URL } from "@/lib/backendApi";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ appointmentId: string }> },
) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("auth_token")?.value;
  const { appointmentId } = await params;

  if (!token) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/appointments/${appointmentId}/complete`, {
    method: "PATCH",
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
}
