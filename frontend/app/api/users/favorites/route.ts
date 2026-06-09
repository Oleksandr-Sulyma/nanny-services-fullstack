import { cookies } from "next/headers";
import { API_URL } from "@/lib/backendApi";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const res = await fetch(`${API_URL}/users/favorites`, {
    method: "POST",
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
