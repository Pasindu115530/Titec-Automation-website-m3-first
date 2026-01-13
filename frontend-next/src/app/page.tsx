import { projectService } from "../services/projectService";
import { Project } from "../types";
import HomePageContent from "../components/home-page-content";

export default async function Homepage() {
  // Fetch projects from API
  let projects: Project[] = [];
  try {
    projects = await projectService.getProjects();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    // Optionally handle error state or show empty list
  }

  return (
    <>
      <HomePageContent projects={projects} />
    </>
  );
}
