import { API_URL } from "@/lib/backendApi";

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const response = await res.json();

  if (!res.ok) {
    return Response.json(response, { status: res.status });
  }

  return Response.json(response);
}
