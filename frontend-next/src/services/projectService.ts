import { api } from '@/lib/api';
import { Project } from '../types';

export const projectService = {
    async getProjects(): Promise<Project[]> {
        try {
            const response = await api.get<{ data: Project[] }>('/api/projects');
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            return [];
        }
    },

    async getProjectById(id: string): Promise<Project> {
        const response = await api.get<{ data: Project }>(`/api/projects/${id}`);
        return response.data.data;
    },

    async getProjectsByClient(clientName: string): Promise<Project[]> {
        try {
            const response = await api.get<{ data: Project[] }>('/api/projects', {
                params: { client: clientName }
            });
            return response.data.data;
        } catch (error) {
            console.error(`Failed to fetch projects for client ${clientName}:`, error);
            return [];
        }
    }
};
