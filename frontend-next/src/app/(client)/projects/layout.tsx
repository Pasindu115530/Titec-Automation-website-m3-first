import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Projects | TiTEC Automation",
    description: "Explore our portfolio of industrial automation solutions, including completed projects in PLC programming, HMI design, and manufacturing efficiency.",
};

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
