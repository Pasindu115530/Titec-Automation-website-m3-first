import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import FloatingActionButtons from "@/components/floating-action-buttons";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

import Header from "@/components/header";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/cart-drawer";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: "Titec Automation",
    description: "Industrial Automation Solutions",
};

export default function ClientRootLayout({
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
                            <FloatingActionButtons />
                            <Header />
                            <div className="w-full grow bg-white text-black">
                                {children}
                            </div>
                            <CartDrawer />
                            <Toaster />
                        </div>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
