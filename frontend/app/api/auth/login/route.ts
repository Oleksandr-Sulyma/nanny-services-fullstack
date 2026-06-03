import { NextResponse } from "next/server";
import { API_URL } from "@/lib/backendApi";

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${API_URL}/auth/login`, {
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

  const token = response.data.token;
  if (!token) {
    return Response.json(
      { message: "Token was not returned by backend" },
      { status: 500 },
    );
  }

  const { user } = response.data;
  const nextRes = {
    message: response.message,
    data: {
      user,
    },
  };

  const nextResponse = NextResponse.json(nextRes);
  const name = "auth_token";
  const options = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  };

  nextResponse.cookies.set(name, token, options);

  return nextResponse;
}
