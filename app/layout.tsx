import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ice Vision",
  description: "Ice Vision 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased overflow-x-hidden">

        {/* Shared Navbar */}
        <nav className="w-full flex items-center justify-between px-6 py-4 bg-black shadow-md sticky top-0 z-50">
          <div className="flex items-center">
            <Link href="/">
              <Image src="/logo.png" alt="Ice Vision Logo" width={80} height={80} />
            </Link>
          </div>
          <div className="flex space-x-6 text-md font-medium">
            <Link href="/examples" className="hover:underline">Examples</Link>
            <Link href="/requirements" className="hover:underline">Video Requirements</Link>
          </div>
        </nav>

        {/* Divider */}
        {/* <div className="border-t border-gray-500" /> */}

        {/* Page Content */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
