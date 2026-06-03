"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHomeActive = pathname === "/";
  const isNanniesActive = pathname === "/nannies";
  const isFavoritesActive = pathname === "/favorites";
  return (
    <header>
      <nav>
        <Link href="/">Home{isHomeActive && " *"}</Link>
        <Link href="/nannies">Nannies{isNanniesActive && " *"}</Link>
        <Link href="/favorites">Favorites{isFavoritesActive && " *"}</Link>
      </nav>
    </header>
  );
}
