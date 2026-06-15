"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/types/types";
import { useAuthStore } from "@/store/useAuthStore";
import Spinner from "@/components/ui/Spinner";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: Role[];
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isInitialized } = useAuthStore();

  const isCheckingAuth = isLoading || !isInitialized;
  const hasAllowedRole = allowedRoles
    ? !!user && allowedRoles.includes(user.role)
    : true;

  useEffect(() => {
    if (isCheckingAuth) return;

    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    if (!hasAllowedRole) {
      router.replace("/");
    }
  }, [hasAllowedRole, isAuthenticated, isCheckingAuth, router]);

  if (isCheckingAuth) {
    return <Spinner className="py-6" />;
  }

  if (!isAuthenticated || !hasAllowedRole) {
    return null;
  }

  return <>{children}</>;
}
