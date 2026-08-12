import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import FloatingActionButtons from "@/components/floating-action-buttons";
import VersionManager from "@/components/VersionManager";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

import JsonLd from "@/components/json-ld";
import Header from "@/components/header";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/cart-drawer";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk'),
    title: {
        default: "TiTEC Automation | Industrial Automation Solutions in Sri Lanka",
        template: "%s | TiTEC Automation"
    },
    description: "Leading provider of industrial automation solutions, PLC programming, SCADA systems, and electrical design in Sri Lanka. Expert engineering for manufacturing efficiency.",
    keywords: ["Industrial Automation", "PLC Programming", "SCADA Systems", "Electrical Design", "Sri Lanka Automation", "TiTEC Automation", "Control Panels", "Factory Automation"],
    authors: [{ name: "TiTEC Automation" }],
    creator: "TiTEC Automation",
    publisher: "TiTEC Automation",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    icons: {
        icon: '/icon.svg',
        shortcut: '/icon.svg',
        apple: '/icon.svg',
    },
    openGraph: {
        title: "TiTEC Automation | Industrial Automation Solutions",
        description: "Expert industrial automation solutions including PLC, SCADA, and robotics. Transform your manufacturing with TiTEC Automation.",
        url: process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk',
        siteName: "TiTEC Automation",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: '/og-image.jpg', // Ensure this image exists in public folder
                width: 1200,
                height: 630,
                alt: 'TiTEC Automation Solutions',
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "TiTEC Automation | Industrial Automation Solutions",
        description: "Expert industrial automation solutions including PLC, SCADA, and robotics.",
        // creator: "@titecautomation", // Add if available
        images: ['/og-image.jpg'], // Ensure this image exists
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
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
                <VersionManager />
                <AuthProvider>
                    <CartProvider>
                        <JsonLd />
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
