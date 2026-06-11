"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ThemeSwitcher from "./ThemeSwitcher";
import { useAuthStore } from "@/store/useAuthStore";
import { Role } from "@/types/types";
import Modal from "@/components/ui/Modal";
import RegisterForm from "@/components/auth/RegisterForm";
import LoginForm from "@/components/auth/LoginForm";
import Button from "@/components/ui/Button";
import { logoutRequest } from "@/lib/authApi";
import { useFavoritesStore } from "@/store/useFavoritesStore";

export default function Header() {
  const pathname = usePathname();
  const isHomeActive = pathname === "/";
  const isNanniesActive = pathname === "/nannies";
  const isFavoritesActive = pathname === "/favorites";
  const isAppointmentsActive = pathname === "/appointments";
  const isIncomingActive = pathname === "/appointments/incoming";
  const isUserProfileActive = pathname === "/profile";
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const router = useRouter();
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } finally {
      clearAuth();
      clearFavorites();
      router.push("/");
    }
  };

  const getNavLinkClassName = (isActive: boolean) =>
    `relative pb-3 text-base font-medium ${
      isActive
        ? "after:absolute after:bottom-0 after:left-1/2 after:h-2 after:w-2 after:-translate-x-1/2 after:rounded-full after:bg-white"
        : ""
    }`;

  const getUserProfileLinkClassName = (isActive: boolean) =>
    `relative flex items-center gap-2 pb-4 ${
      isActive
        ? "after:absolute after:bottom-0 after:left-1/2 after:h-2 after:w-2 after:-translate-x-1/2 after:rounded-full after:bg-white"
        : ""
    }`;

  return (
    <>
      <header className="bg-brand text-white">
        <div className="app-container flex h-22 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              Nanny.Services
            </Link>
            <ThemeSwitcher />
          </div>

          <div className="hidden items-center gap-23 lg:flex">
            <nav className="flex items-center gap-10">
              <Link href="/" className={getNavLinkClassName(isHomeActive)}>
                Home
              </Link>
              <Link
                href="/nannies"
                className={getNavLinkClassName(isNanniesActive)}
              >
                Nannies
              </Link>
              {user?.role === Role.PARENT && (
                <>
                  <Link
                    href="/favorites"
                    className={getNavLinkClassName(isFavoritesActive)}
                  >
                    Favorites
                  </Link>
                  <Link
                    href="/appointments"
                    className={getNavLinkClassName(isAppointmentsActive)}
                  >
                    My appointments
                  </Link>
                </>
              )}
              {user?.role === Role.NANNY && (
                <>
                  <Link
                    href="/appointments/incoming"
                    className={getNavLinkClassName(isIncomingActive)}
                  >
                    Incoming
                  </Link>
                </>
              )}
            </nav>

            <div className="flex items-center gap-2">
              {!isAuthenticated && (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsLoginOpen(true)}
                  >
                    Log In
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setIsRegisterOpen(true)}
                  >
                    Registration
                  </Button>
                </>
              )}
              {isAuthenticated && (
                <>
                  {user?.role === Role.NANNY && (
                    <Link href="/nanny/profile" className={getUserProfileLinkClassName(pathname === "/nanny/profile")}>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand">
                        {user?.name?.[0]}
                      </div>
                      <span>{user?.name}</span>
                    </Link>
                  )}
                  {user?.role === Role.PARENT && (
                    <Link href="/profile" className={getUserProfileLinkClassName(isUserProfileActive)}>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand">
                        {user?.name?.[0]}
                      </div>
                      <span>{user?.name}</span>
                    </Link>
                  )}

                  <Button variant="outline" onClick={handleLogout} size="lg">
                    Log out
                  </Button>
                </>
              )}
            </div>
          </div>
          <button type="button" className="lg:hidden">
            Menu
          </button>
        </div>
      </header>
      <Modal
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        title="Log In"
        description="Welcome back! Please enter your credentials to access your account."
      >
        <LoginForm onSuccess={() => setIsLoginOpen(false)} />
      </Modal>
      <Modal
        isOpen={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
        title="Registration"
        description="Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information."
      >
        <RegisterForm onSuccess={() => setIsRegisterOpen(false)} />
      </Modal>
    </>
  );
}
