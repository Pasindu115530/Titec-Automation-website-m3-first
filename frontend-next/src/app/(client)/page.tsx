import type { Metadata } from 'next';
import HomeClient from "@/components/client/home-client";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk';

export const metadata: Metadata = {
    title: "Industrial Automation Sri Lanka | TiTEC Automation",
    description: "TiTEC Automation delivers high-precision industrial automation solutions in Sri Lanka — including PLC programming, robotics, electrical control panels, HMI/SCADA systems, and machinery integration.",
    keywords: [
        "industrial automation Sri Lanka",
        "industrial automation company Sri Lanka",
        "PLC programming Sri Lanka",
        "industrial robotics Sri Lanka",
        "robotic packaging systems",
        "electrical control panel manufacturing Sri Lanka",
        "HMI SCADA integration",
        "factory automation Sri Lanka",
        "TiTEC Automation",
    ],
    alternates: {
        canonical: baseUrl,
    },
    openGraph: {
        title: "Industrial Automation Sri Lanka | TiTEC Automation",
        description: "TiTEC Automation delivers high-precision industrial automation in Sri Lanka — PLC programming, robotics, control panels, and SCADA integration.",
        url: baseUrl,
        siteName: "TiTEC Automation",
        images: [
            {
                url: `${baseUrl}/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: "TiTEC Automation Sri Lanka",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Industrial Automation Sri Lanka | TiTEC Automation",
        description: "High-precision industrial automation solutions in Sri Lanka — PLCs, robotics, SCADA & electrical design.",
        images: [`${baseUrl}/og-image.jpg`],
    },
};

export default function Homepage() {
    return <HomeClient />;
}
