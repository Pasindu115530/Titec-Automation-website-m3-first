import { api } from '@/lib/api';

export type NoteType = 'progress' | 'completion' | 'extra_cost' | 'defect' | 'additional_parts';

export interface Technician {
    id: number;
    name: string;
    email: string;
}

export interface InstallationNote {
    id: number;
    content: string;
    type: NoteType;
    cost_amount: number | null;
    cost_description: string | null;
    review_status: 'pending' | 'approved' | 'rejected' | null;
    reviewed_by_user?: { id: number; name: string } | null;
    reviewed_at: string | null;
    rejection_reason: string | null;
    image_url: string | null;
    image_urls: string[];
    attachments: string[] | null;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
}

export interface Installation {
    id: number;
    uuid: string;
    reference_number: string;
    client_id: number;
    invoice_id: number | null;
    title: string;
    description: string | null;
    status: 'scheduled' | 'in_progress' | 'on_hold' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    scheduled_date: string | null;
    completed_date: string | null;
    location: string;
    location_coordinates: string | null;
    created_at: string;
    updated_at: string;
    client?: {
        id: number;
        company_name?: string;
        contact_name?: string;
        contact_person?: string;
        phone?: string;
        city?: string;
        address?: string;
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
        const payload = {
            technicians: technicianIds.map((id, index) => ({
                user_id: id,
                role: index === 0 ? 'lead' : 'assistant'
            }))
        };
        const response = await api.post(`/api/installations/${id}/assign`, payload);
        return response.data;
    },

    async addNote(
        id: number | string,
        content: string,
        type: NoteType = 'progress',
        images?: File[],
        costAmount?: number,
        costDescription?: string
    ): Promise<InstallationNote> {
        const formData = new FormData();
        formData.append('content', content);
        formData.append('type', type);

        if (images && images.length > 0) {
            images.forEach((img) => {
                formData.append('images[]', img);
            });
        }

        if (costAmount !== undefined && costAmount !== null) {
            formData.append('cost_amount', String(costAmount));
        }
        if (costDescription) {
            formData.append('cost_description', costDescription);
        }

        const response = await api.post(`/api/installations/${id}/notes`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    },

    async reviewNote(
        installationId: number | string,
        noteId: number | string,
        action: 'approve' | 'reject',
        rejectionReason?: string
    ): Promise<InstallationNote> {
        const response = await api.post(
            `/api/installations/${installationId}/notes/${noteId}/review`,
            { action, rejection_reason: rejectionReason }
        );
        return response.data;
    },

    async getPendingReviews(page?: number): Promise<any> {
        const response = await api.get('/api/installation-notes/pending-review', { params: { page } });
        return response.data;
    },
};
