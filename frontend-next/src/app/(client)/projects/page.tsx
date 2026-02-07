import { projectService } from '@/services/projectService';
import ProjectsClient from "@/components/client/projects-client";

export default async function ProjectsPage() {
    let projects: any[] = [];
    try {
        projects = await projectService.getProjects();
    } catch (error) {
        // Silently fail during build, log only in development client-side
        if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
            console.error('Failed to load projects server-side', error);
        }
    }

    return <ProjectsClient initialProjects={projects} />;
}
