import { cookies } from "next/headers";
import { API_URL } from "@/lib/backendApi";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ appointmentId: string }> },
) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("auth_token")?.value;
  const { appointmentId } = await params;

  if (!token) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (body.status !== "accepted" && body.status !== "rejected") {
    return Response.json(
      { message: "Status must be accepted or rejected" },
      { status: 400 },
    );
  }

  const res = await fetch(`${API_URL}/appointments/${appointmentId}/status`, {
    method: "PATCH",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const response = await res.json();

  if (!res.ok) {
    return Response.json(response, { status: res.status });
  }

  return Response.json(response);
}
