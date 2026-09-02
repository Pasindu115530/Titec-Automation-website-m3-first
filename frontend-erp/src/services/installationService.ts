import { api } from '@/lib/api';

export interface Technician {
    id: number;
    name: string;
    email: string;
}

export interface InstallationNote {
    id: number;
    content: string;
    image_url: string | null;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
}

export interface Installation {
    id: number;
    uuid: string;
    client_id: number;
    invoice_id: number | null;
    title: string;
    description: string | null;
    status: 'scheduled' | 'in_progress' | 'on_hold' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    scheduled_date: string | null;
    completed_date: string | null;
    location_address: string | null;
    location_coordinates: string | null;
    created_at: string;
    updated_at: string;
    client?: {
        id: number;
        company_name: string;
        contact_name: string;
        phone: string;
        city: string;
    };
    invoice?: {
        id: number;
        invoice_number: string;
    };
    technicians?: Technician[];
    notes?: InstallationNote[];
}

export const installationService = {
    async getInstallations(params?: { status?: string, priority?: string, search?: string, page?: number }): Promise<any> {
        const response = await api.get('/api/installations', { params });
        return response.data;
    },

    async getMyInstallations(params?: { status?: string, page?: number }): Promise<any> {
        const response = await api.get('/api/my-installations', { params });
        return response.data;
    },

    async getInstallationById(id: number | string): Promise<Installation> {
        const response = await api.get(`/api/installations/${id}`);
        return response.data;
    },

    async createInstallation(data: any): Promise<Installation> {
        const response = await api.post('/api/installations', data);
        return response.data;
    },

    async updateInstallation(id: number | string, data: any): Promise<Installation> {
        const response = await api.put(`/api/installations/${id}`, data);
        return response.data;
    },

    async updateStatus(id: number | string, status: string): Promise<Installation> {
        const response = await api.patch(`/api/installations/${id}/status`, { status });
        return response.data;
    },

    async assignTechnicians(id: number | string, technicianIds: number[]): Promise<any> {
        const response = await api.post(`/api/installations/${id}/assign`, { technician_ids: technicianIds });
        return response.data;
    },

    async addNote(id: number | string, content: string, image?: File): Promise<InstallationNote> {
        const formData = new FormData();
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        const response = await api.post(`/api/installations/${id}/notes`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    }
};
