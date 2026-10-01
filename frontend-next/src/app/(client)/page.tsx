import HomeClient from "@/components/client/home-client";
import { projectService } from "@/services/projectService";
import { Project } from "@/types";

export const revalidate = 300; // Revalidate every 5 minutes

export default async function Homepage() {
    let initialProjects: Project[] = [];
    try {
        const result = await projectService.getProjects();
        if (Array.isArray(result)) {
            initialProjects = result;
        }
    } catch {
        // Fail silently — HomeClient handles empty state
    }

    return <HomeClient initialProjects={initialProjects} />;
}
