import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Industrial Automation Store | TiTEC Automation",
    description: "Browse our catalog of automation components, PLCs, sensors, and electrical supplies. High-quality industrial parts for your systems.",
};

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}
