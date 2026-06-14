import { cookies } from "next/headers";
import { API_URL } from "@/lib/backendApi";

export async function POST(request: Request) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("auth_token")?.value;

  if (!token) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    const res = await fetch(`${API_URL}/uploads/avatar`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Backend error text:", errorText);

      return Response.json(
        { message: errorText || "Backend returned an error" },
        { status: res.status },
      );
    }

    const response = await res.json();
    return Response.json(response, { status: res.status });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return Response.json({ message }, { status: 500 });
  }
}
