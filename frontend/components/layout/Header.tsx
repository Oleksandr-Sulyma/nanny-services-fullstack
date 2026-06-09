"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import ThemeSwitcher from "./ThemeSwitcher";
import { useAuthStore } from "@/store/useAuthStore";
import { Role } from "@/types/types";
import Modal from "@/components/ui/Modal";
import RegisterForm from "@/components/auth/RegisterForm";
import Button from "@/components/ui/Button";

export default function Header() {
  const pathname = usePathname();
  const isHomeActive = pathname === "/";
  const isNanniesActive = pathname === "/nannies";
  const isFavoritesActive = pathname === "/favorites";
  const isAppointmentsActive = pathname === "/appointments";
  const isProfileActive = pathname === "/nanny/profile";
  const isIncomingActive = pathname === "/appointments/incoming";
  const { user, isAuthenticated } = useAuthStore();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <>
      <header className="bg-[var(--color-primary)] text-white">
        <div className="app-container flex h-[88px] items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Nanny.Services
          </Link>

          <nav className="hidden items-center gap-10 lg:flex">
            <Link href="/">Home{isHomeActive && " *"}</Link>
            <Link href="/nannies">Nannies{isNanniesActive && " *"}</Link>
            {user?.role === Role.PARENT && (
              <>
                <Link href="/favorites">
                  Favorites{isFavoritesActive && " *"}
                </Link>
                <Link href="/appointments">
                  My appointments{isAppointmentsActive && " *"}
                </Link>
              </>
            )}
            {user?.role === Role.NANNY && (
              <>
                <Link href="/nanny/profile">
                  My profile{isProfileActive && " *"}
                </Link>
                <Link href="/appointments/incoming">
                  Incoming{isIncomingActive && " *"}
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {!isAuthenticated && (
              <>
                <button type="button">Log In</button>

                <Button size="lg" onClick={() => setIsRegisterOpen(true)}>
                  Registration
                </Button>
              </>
            )}
            {isAuthenticated && (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--color-primary)]">
                  {user?.name?.[0]}
                </div>
                <span>{user?.name}</span>
                <button type="button">Log out</button>
              </>
            )}
            <ThemeSwitcher />
            <button type="button" className="lg:hidden">
              Menu
            </button>
          </div>
        </div>
      </header>
      <Modal
        isOpen={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
        title="Registration"
        description="Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information."
      >
        <RegisterForm />
      </Modal>
    </>
  );
}
