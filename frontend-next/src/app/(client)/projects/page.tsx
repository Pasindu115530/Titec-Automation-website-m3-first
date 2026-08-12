import { projectService } from '@/services/projectService';
import ProjectsClient from "@/components/client/projects-client";
import { Metadata } from "next";
import { Project } from "@/types";

export const revalidate = 300;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.titecautomation.lk';

export const metadata: Metadata = {
    title: "Industrial Automation Projects Portfolio | TiTEC Automation Sri Lanka",
    description: "Explore TiTEC Automation's portfolio of completed industrial projects — PLC programming, SCADA systems, HMI design, conveyor automation, and factory solutions across Sri Lanka.",
    keywords: [
        "industrial automation projects",
        "PLC programming Sri Lanka",
        "SCADA projects",
        "HMI design",
        "conveyor automation",
        "factory automation Sri Lanka",
        "TiTEC Automation portfolio",
        "automation case studies",
    ],
    alternates: {
        canonical: `${baseUrl}/projects`,
    },
    openGraph: {
        title: "Our Projects - Titec Automation",
        description: "Explore our portfolio of successful industrial automation projects including PLC programming, HMI design, SCADA systems, and manufacturing automation solutions.",
        type: "website",
        url: `${baseUrl}/projects`,
        siteName: "TiTEC Automation",
        images: [
            {
                url: `${baseUrl}/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: "TiTEC Automation Projects Portfolio",
            },
        ],
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Industrial Automation Projects Portfolio | TiTEC Automation Sri Lanka",
        description: "Explore TiTEC Automation's portfolio of completed industrial projects across Sri Lanka.",
        images: [`${baseUrl}/og-image.jpg`],
    },
};

export default async function ProjectsPage() {
    let projects: Project[] = [];
    try {
        const result = await projectService.getProjects();
        if (Array.isArray(result)) {
            projects = result;
        } else {
            projects = [];
        }
    } catch {
        // Fail silently — StoreClient will show empty state
    }

    // ── JSON-LD: ItemList Schema ──
    // Tells Google each project by name + URL so individual pages get discovered faster
    const itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${baseUrl}/projects`,
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
