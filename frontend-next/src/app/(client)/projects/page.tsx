import { projectService } from '@/services/projectService';
import ProjectsClient from "@/components/client/projects-client";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Projects - Titec Automation",
    description: "Explore our portfolio of successful industrial automation projects including PLC programming, HMI design, SCADA systems, and manufacturing automation solutions.",
    openGraph: {
        title: "Our Projects - Titec Automation",
        description: "Explore our portfolio of successful industrial automation projects including PLC programming, HMI design, SCADA systems, and manufacturing automation solutions.",
        type: "website",
    }
};

export default async function ProjectsPage() {
    let projects: any[] = [];
    try {
        projects = await projectService.getProjects();
    } catch (error) {
        // Silently fail during build, log only in development client-side
        if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
            console.error("Failed to fetch projects server-side:", error);
        }
    }

    return <ProjectsClient initialProjects={projects} />;
}
