"use client";

import Link from "next/link";
import { X } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import Button from "@/components/ui/Button";
import { Role, type User } from "@/types/types";

type MobileMenuProps = {
  isOpen: boolean;
  user: User | null;
  isAuthenticated: boolean;
  pathname: string;
  onClose: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogoutClick: () => void;
};

export default function MobileMenu({
  isOpen,
  user,
  isAuthenticated,
  pathname,
  onClose,
  onLoginClick,
  onRegisterClick,
  onLogoutClick,
}: MobileMenuProps) {
  if (!isOpen) return null;

  const getMobileLinkClassName = (href: string) =>
    `rounded-2xl px-4 py-3 transition-colors ${
      pathname === href ? "bg-white text-brand" : "text-white hover:bg-white/10"
    }`;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close menu"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 flex h-full w-[min(100%,360px)] flex-col bg-brand px-6 py-6 text-white shadow-[-20px_0_50px_rgba(17,16,28,0.18)]">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold" onClick={onClose}>
            Nanny.Services
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/40"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-8">
          <ThemeSwitcher />
        </div>

        <nav className="mt-10 flex flex-col gap-2 text-lg font-medium">
          <Link href="/" className={getMobileLinkClassName("/")} onClick={onClose}>
            Home
          </Link>
          <Link
            href="/nannies"
            className={getMobileLinkClassName("/nannies")}
            onClick={onClose}
          >
            Nannies
          </Link>

          {user?.role === Role.PARENT && (
            <>
              <Link
                href="/favorites"
                className={getMobileLinkClassName("/favorites")}
                onClick={onClose}
              >
                Favorites
              </Link>
              <Link
                href="/appointments"
                className={getMobileLinkClassName("/appointments")}
                onClick={onClose}
              >
                My appointments
              </Link>
            </>
          )}

          {user?.role === Role.NANNY && (
            <>
              <Link
                href="/appointments/incoming"
                className={getMobileLinkClassName("/appointments/incoming")}
                onClick={onClose}
              >
                Incoming
              </Link>
              <Link
                href="/nanny/profile"
                className={getMobileLinkClassName("/nanny/profile")}
                onClick={onClose}
              >
                Nanny profile
              </Link>
            </>
          )}
        </nav>

        <div className="mt-auto flex flex-col gap-3 pt-10">
          {!isAuthenticated && (
            <>
              <Button variant="outline" size="lg" onClick={onLoginClick}>
                Log In
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={onRegisterClick}
                className="border border-white/40"
              >
                Registration
              </Button>
            </>
          )}

          {isAuthenticated && (
            <>
              <Link
                href="/profile"
                className={`flex items-center gap-3 rounded-2xl p-3 ${
                  pathname === "/profile" ? "bg-white text-brand" : "bg-white/10"
                }`}
                onClick={onClose}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand">
                  {user?.name?.[0]}
                </div>
                <span className="min-w-0 wrap-break-word font-medium">
                  {user?.name}
                </span>
              </Link>
              <Button variant="outline" onClick={onLogoutClick} size="lg">
                Log out
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
