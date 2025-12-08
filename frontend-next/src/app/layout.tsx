import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Header from "../components/header";

export const metadata: Metadata = {
  title: "Titec Automation",
  description: "Industrial Automation Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="w-full min-h-screen flex flex-col">
          <Header />
          <div className="w-full grow bg-white text-black">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
