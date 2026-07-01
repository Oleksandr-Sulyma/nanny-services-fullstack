import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import AuthProvider from "@/components/providers/AuthProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import ToastProvider from "@/components/providers/ToastProvider";

import "./globals.css";

const siteUrl = "https://nanny-services-fullstack.vercel.app";
const siteDescription =
  "Find trusted nannies, book appointments, manage favorites, and leave reviews in one fullstack childcare platform.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nanny Services",
    template: "%s | Nanny Services",
  },
  description: siteDescription,
  applicationName: "Nanny Services",
  keywords: [
    "nanny services",
    "babysitter booking",
    "childcare",
    "nanny appointments",
    "family care",
  ],
  authors: [{ name: "Oleksandr Sulyma" }],
  creator: "Oleksandr Sulyma",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Nanny Services",
    title: "Nanny Services",
    description: siteDescription,
    images: [
      {
        url: "/screenshots/home.jpg",
        width: 1200,
        height: 630,
        alt: "Nanny Services home page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nanny Services",
    description: siteDescription,
    images: ["/screenshots/home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <Header />
              {children}
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
