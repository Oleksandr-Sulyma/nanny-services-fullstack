import type {
  CurrentUserResponse,
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
  LogoutResponse,
} from "@/types/types";

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const res = await fetch("/api/users/me");

  if (!res.ok) {
    throw new Error(`Backend request failed: ${res.status}`);
  }

  return res.json();
}

export async function registerRequest(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message ?? `Registration failed: ${res.status}`);
  }

  return response;
}

export async function loginRequest(
  payload: LoginPayload,
): Promise<LoginResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message ?? `Login failed: ${res.status}`);
  }

  return response;
}

export async function logoutRequest(): Promise<LogoutResponse> {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message ?? `Logout failed: ${res.status}`);
  }

  return response;
}