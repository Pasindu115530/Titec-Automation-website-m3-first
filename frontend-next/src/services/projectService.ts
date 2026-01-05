import { fetchFromApi } from './api';
import { Project } from '../types';

export const projectService = {
    async getProjects(): Promise<Project[]> {
        return fetchFromApi<Project[]>('/api/projects');
    },

    async getProjectById(id: string): Promise<Project> {
        return fetchFromApi<Project>(`/api/projects/${id}`);
    },

    async getProjectsByClient(clientName: string): Promise<Project[]> {
        // Assuming backend supports filtering by client via query param
        // If not, we might need to fetch all and filter client-side, 
        // but a query param is better practice. 
        // Let's assume /api/projects?client=ClientName
        // We need to encode the client name component
        return fetchFromApi<Project[]>(`/api/projects?client=${encodeURIComponent(clientName)}`);
    }
};
