import { api } from '@/lib/api';
import { ServiceCategory } from '../types';

export const serviceService = {
    async getServices(): Promise<ServiceCategory[]> {
        try {
            const response = await api.get<{ data: ServiceCategory[] }>('/api/services');
            return response.data.data;
        } catch (error) {
            if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
                console.error('Failed to fetch services:', error);
            }
            return [];
        }
    },

    async getServiceBySlug(slug: string): Promise<ServiceCategory | null> {
        try {
            const response = await api.get<{ data: ServiceCategory }>(`/api/services/${slug}`);
            return response.data.data;
        } catch (error) {
            if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
                console.error('Failed to fetch service:', error);
            }
            return null;
        }
    },

    async createService(formData: FormData): Promise<ServiceCategory> {
        const response = await api.post<{ data: ServiceCategory }>('/api/services', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    },

    async updateService(id: number, formData: FormData): Promise<ServiceCategory> {
        // Laravel needs _method for PUT with FormData
        formData.append('_method', 'PUT');
        const response = await api.post<{ data: ServiceCategory }>(`/api/services/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    },

    async deleteService(id: number): Promise<void> {
        await api.delete(`/api/services/${id}`);
    },
};
