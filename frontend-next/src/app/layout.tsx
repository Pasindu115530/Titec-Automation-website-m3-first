import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { IoCallSharp } from "react-icons/io5";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Header from "../components/header";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/cart-drawer";

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
        <AuthProvider>
          <CartProvider>
            <div className="w-full min-h-screen flex flex-col">
              <div className="fixed bottom-25 right-25 bg-[#0C2340] rounded-full p-5 z-999 cursor-pointer hover:scale-105 transition-transform shadow-lg">
                <div className="flex flex-row items-center justify-center">

                  <div className="rotate-20"><IoCallSharp color="white" size={40} /></div>
                  <h1 className="text-white text-2xl font-bold ml-2 hidden sm:block">Call Us</h1>
                </div>
              </div>
              <Header />
              <div className="w-full grow bg-white text-black">
                {children}
              </div>
              <CartDrawer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
