import { projectService } from "@/services/projectService";
import HomeClient from "@/components/client/home-client";

export default async function Homepage() {
  let projects: any[] = [];
  try {
    projects = await projectService.getProjects();
  } catch (error) {
    console.error("Failed to fetch projects server-side:", error);
  }

  return <HomeClient initialProjects={projects} />;
}
