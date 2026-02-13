import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenClaw Control Center",
  description: "Phase 3 Frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-100 min-h-screen flex flex-col`}
      >
        <nav className="border-b border-gray-800 bg-gray-900 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              OpenClaw Control
            </h1>
            <div className="space-x-4">
              <Link href="/" className="hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
                Dashboard
              </Link>
              <Link href="/matrix" className="hover:text-green-400 transition-colors">
                The Matrix
              </Link>
              <Link href="/config" className="hover:text-yellow-400 transition-colors">
                Config
              </Link>
            </div>
          </div>
        </nav>
        <main className="flex-1 container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
