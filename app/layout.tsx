// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { SessionProvider } from "@/components/auth/session-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GameVault",
    template: "%s | GameVault",
  },
  description: "Discover, search, and save your favorite games using the IGDB API.",
  applicationName: "GameVault",
  keywords: [
    "GameVault",
    "IGDB",
    "Games",
    "Gaming",
    "Next.js",
    "Video Games",
  ],
  authors: [
    {
      name: "IKM Products",
    },
  ],
  creator: "IKM Products",
  openGraph: {
    title: "GameVault",
    description: "Discover, browse, and save your favorite games.",
    siteName: "GameVault",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionProvider>{children}</SessionProvider>

        <Toaster richColors position="top-right" expand closeButton />
      </body>
    </html>
  );
}