import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { MdHomeRepairService } from "react-icons/md";
import { ShoppingBag } from 'lucide-react';

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
                            <div className="fixed bottom-10 right-10 z-99">
                                <div className="flex flex-col gap-1.5 items-center justify-center">
                                    <div className="bg-(--secondary-blue) rounded-full p-4 cursor-pointer hover:scale-105 transition-transform shadow-lg">
                                        <ShoppingBag color="white" size={30}/>
                                    </div>
                                    <div className="bg-(--cta-hover-red) rounded-full p-4  cursor-pointer hover:scale-105 transition-transform shadow-lg">
                                            <MdHomeRepairService color="white" size={30} />
                                        </div>
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
