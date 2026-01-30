import { api } from '@/lib/api';
import { Project } from '../types';

export const projectService = {
    async getProjects(): Promise<Project[]> {
        const response = await api.get<{ data: Project[] }>('/api/projects');
        return response.data.data;
    },

    async getProjectById(id: string): Promise<Project> {
        const response = await api.get<{ data: Project }>(`/api/projects/${id}`);
        return response.data.data;
    },

    async getProjectsByClient(clientName: string): Promise<Project[]> {
        const response = await api.get<{ data: Project[] }>('/api/projects', {
            params: { client: clientName }
        });
        return response.data.data;
    }
};
