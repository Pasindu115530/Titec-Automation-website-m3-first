import { fetchFromApi } from './api';
import { Project } from '../types';

export const projectService = {
    async getProjects(): Promise<Project[]> {
        const response = await fetchFromApi<{ data: Project[] }>('/api/projects');
        return response.data;
    },

    async getProjectById(id: string): Promise<Project> {
        const response = await fetchFromApi<{ data: Project }>(`/api/projects/${id}`);
        return response.data;
    },

    async getProjectsByClient(clientName: string): Promise<Project[]> {
        const response = await fetchFromApi<{ data: Project[] }>(`/api/projects?client=${encodeURIComponent(clientName)}`);
        return response.data;
    }
};
