import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import AuthProvider from "@/components/providers/AuthProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import ToastProvider from "@/components/providers/ToastProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Nanny Services",
  description: "Platform for finding and booking trusted nannies",
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
