import { cookies } from "next/headers";
import { API_URL } from "@/lib/backendApi";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ nannyId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { nannyId } = await params;
  const body = await request.json();

  const res = await fetch(`${API_URL}/nannies/${nannyId}/appointments`, {
    method: "POST",
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

  return Response.json(response, { status: res.status });
}