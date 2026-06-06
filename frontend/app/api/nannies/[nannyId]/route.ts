import { API_URL } from "@/lib/backendApi";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ nannyId: string }> },
) {
  try {
    const { nannyId } = await params;
    const res = await fetch(`${API_URL}/nannies/${nannyId}`, {
      cache: "no-store",
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
