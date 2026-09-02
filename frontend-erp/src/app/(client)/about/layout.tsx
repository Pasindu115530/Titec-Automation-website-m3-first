import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | TiTEC Automation",
    description: "Learn about TiTEC Automation, Sri Lanka's leading industrial automation experts. Our mission, vision, and commitment to engineering excellence.",
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
