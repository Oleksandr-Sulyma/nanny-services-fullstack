"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const { fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return <>{children}</>;
}