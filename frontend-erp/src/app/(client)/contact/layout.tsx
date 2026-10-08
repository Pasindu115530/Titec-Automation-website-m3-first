import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | TiTEC Automation",
    description: "Get in touch with TiTEC Automation for your industrial automation needs. Contact us for quotes, support, or consultation on PLC and SCADA solutions.",
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
