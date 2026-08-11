import { projectService } from '@/services/projectService';
import ProjectsClient from "@/components/client/projects-client";
import { Metadata } from "next";

// ISR: revalidate every 5 minutes
export const revalidate = 300;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk';

export const metadata: Metadata = {
    title: "Industrial Automation Projects Portfolio | TiTEC Automation Sri Lanka",
    description: "Explore TiTEC Automation's portfolio of completed industrial projects — PLC programming, SCADA systems, HMI design, conveyor automation, and factory solutions across Sri Lanka.",
    alternates: {
        canonical: `${baseUrl}/projects`,
    },
    openGraph: {
        title: "Industrial Automation Projects Portfolio | TiTEC Automation Sri Lanka",
        description: "Explore TiTEC Automation's portfolio of completed industrial projects across Sri Lanka.",
        type: "website",
        url: `${baseUrl}/projects`,
        siteName: "TiTEC Automation",
    },
    twitter: {
        card: "summary_large_image",
        title: "Industrial Automation Projects Portfolio | TiTEC Automation Sri Lanka",
        description: "Explore TiTEC Automation's portfolio of completed industrial projects across Sri Lanka.",
    }
};

export default async function ProjectsPage() {
    let projects: any[] = [];
    try {
        const result = await projectService.getProjects();
        if (Array.isArray(result)) {
            projects = result;
        } else {
            console.error("Invalid projects data received in ProjectsPage:", result);
            projects = [];
        }
    } catch (error) {
        if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
            console.error("Failed to fetch projects server-side:", error);
        }
    }

    // ── JSON-LD: ItemList Schema ──
    // Tells Google each project by name + URL so individual pages get discovered faster
    const itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "TiTEC Automation Project Portfolio",
        "description": "Completed industrial automation projects by TiTEC Automation Sri Lanka",
        "url": `${baseUrl}/projects`,
        "numberOfItems": projects.length,
        "itemListElement": projects.map((project, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": project.title,
            "url": `${baseUrl}/projects/${project.id}`,
        })),
    };

    // ── JSON-LD: BreadcrumbList ──
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": "Projects", "item": `${baseUrl}/projects` },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <ProjectsClient initialProjects={projects} />
        </>
    );
}
