"use client";

import { useState, useEffect } from "react";
import { projectService } from '@/services/projectService';
import ProjectsClient from "@/components/client/projects-client";
import Loader from "@/components/loader";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await projectService.getProjects();
                setProjects(data);
            } catch (error) {
                console.error('Failed to load projects:', error);
                setProjects([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return <ProjectsClient initialProjects={projects} />;
}
